import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { StatusCheck } from "../lib/types"

interface ServiceStatus {
  service: string
  status: "ok" | "error"
  error?: string
  lastChecked: string
}

interface ApiResponse {
  timestamp: string
  services: ServiceStatus[]
}

const VALID_SERVICES = [
  "registry-api",
  "autorouting-api",
  "freerouting-cluster",
  "jlcsearch-api",
  "registry_bundling",
  "fly_registry_api",
  "compile_api",
  "svg_service",
  "png_service",
  "browser_preview",
  "tscircuit_package",
  "usercode_api",
]

function getLatestStatuses(): StatusCheck | null {
  const filePath = join(process.cwd(), "statuses.jsonl")
  const content = readFileSync(filePath, "utf-8")
  const lines = content.trim().split("\n").filter(Boolean)
  if (lines.length === 0) return null
  return JSON.parse(lines[lines.length - 1])
}

export default function handler(req: Request): Response {
  const url = new URL('https://status.tscircuit.com' + req.url)
  const service = url.searchParams.get("service")

  const latestStatus = getLatestStatuses()

  if (!latestStatus) {
    return new Response(JSON.stringify({ error: "No status data available" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (service) {
    if (!VALID_SERVICES.includes(service)) {
      return new Response(
        JSON.stringify({
          error: "Invalid service",
          validServices: VALID_SERVICES,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    const serviceData = latestStatus.checks.find((c) => c.service === service)

    if (!serviceData) {
      return new Response(
        JSON.stringify({
          error: `Service '${service}' not found in latest check`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      )
    }

    const response: ApiResponse = {
      timestamp: latestStatus.timestamp,
      services: [
        {
          service: serviceData.service,
          status: serviceData.status,
          ...(serviceData.error && { error: serviceData.error }),
          lastChecked: latestStatus.timestamp,
        },
      ],
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  const response: ApiResponse = {
    timestamp: latestStatus.timestamp,
    services: latestStatus.checks.map((c) => ({
      service: c.service,
      status: c.status,
      ...(c.error && { error: c.error }),
      lastChecked: latestStatus.timestamp,
    })),
  }

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
