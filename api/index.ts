import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { VercelRequest, VercelResponse } from "@vercel/node"
import type { StatusCheck } from "../lib/types"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
  console.log("[getLatestStatuses] __dirname:", __dirname)
  const filePath = join(__dirname, "..", "latest_statuses.jsonl")
  console.log("[getLatestStatuses] filePath:", filePath)
  const content = readFileSync(filePath, "utf-8").trim()
  console.log("[getLatestStatuses] content length:", content.length)
  if (!content) return null
  const parsed = JSON.parse(content)
  console.log("[getLatestStatuses] parsed timestamp:", parsed.timestamp)
  return parsed
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[handler] Request received:", req.url)
  const service = req.query.service as string | undefined
  console.log("[handler] Service param:", service)

  console.log("[handler] Fetching latest statuses...")
  const latestStatus = getLatestStatuses()
  console.log("[handler] Got latestStatus:", latestStatus ? "yes" : "null")

  if (!latestStatus) {
    console.log("[handler] No status data, returning 404")
    return res.status(404).json({ error: "No status data available" })
  }

  if (service) {
    console.log("[handler] Filtering for service:", service)
    if (!VALID_SERVICES.includes(service)) {
      console.log("[handler] Invalid service, returning 400")
      return res.status(400).json({
        error: "Invalid service",
        validServices: VALID_SERVICES,
      })
    }

    const serviceData = latestStatus.checks.find((c) => c.service === service)
    console.log("[handler] Found serviceData:", serviceData ? "yes" : "null")

    if (!serviceData) {
      console.log("[handler] Service not found in checks, returning 404")
      return res.status(404).json({
        error: `Service '${service}' not found in latest check`,
      })
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

    console.log("[handler] Returning single service response")
    return res.status(200).json(response)
  }

  console.log("[handler] Building all services response")
  const response: ApiResponse = {
    timestamp: latestStatus.timestamp,
    services: latestStatus.checks.map((c) => ({
      service: c.service,
      status: c.status,
      ...(c.error && { error: c.error }),
      lastChecked: latestStatus.timestamp,
    })),
  }

  console.log(
    "[handler] Returning all services response, count:",
    response.services.length,
  )
  return res.status(200).json(response)
}
