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
  const filePath = join(__dirname, "..", "latest_statuses.jsonl")
  const content = readFileSync(filePath, "utf-8").trim()
  if (!content) return null
  const parsed = JSON.parse(content)
  return parsed
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const service = req.query.service as string | undefined

  const latestStatus = getLatestStatuses()

  if (!latestStatus) {
    return res.status(404).json({ error: "No status data available" })
  }

  if (service) {
    if (!VALID_SERVICES.includes(service)) {
      return res.status(400).json({
        error: "Invalid service",
        validServices: VALID_SERVICES,
      })
    }

    const serviceData = latestStatus.checks.find((c) => c.service === service)

    if (!serviceData) {
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

    return res.status(200).json(response)
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

  return res.status(200).json(response)
}
