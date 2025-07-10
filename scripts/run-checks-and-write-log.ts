import { checkRegistryHealth } from "../status-checks/check-registry-health"
import { checkAutoroutingApiHealth } from "../status-checks/check-autorouting-api-health"
import { checkFreeroutingClusterHealth } from "../status-checks/check-freerouting-cluster-health"
import { checkJLCSearchHealth } from "../status-checks/check-jlcsearch-health"
import { checkRegistryAndBundlingHealth } from "../status-checks/check-registry-and-bundling-health"
import fs from "node:fs"
import { checkFlyRegistryHealth } from "status-checks/check-fly-registry-health"
import { checkCompileApiHealth } from "status-checks/check-compile-api-health"
import { checkSvgServiceHealth } from "../status-checks/check-svg-service-health"
import { checkPngServiceHealth } from "../status-checks/check-png-service-health"
import { checkBrowserPreviewHealth } from "../status-checks/check-browser-preview-health"
import { checkTscircuitPackageHealth } from "../status-checks/check-tscircuit-package-health"

interface StatusCheck {
  timestamp: string
  checks: {
    service: string
    status: "ok" | "error"
    error?: string
  }[]
}

async function runChecksAndWriteLog() {
  const checks = [
    { name: "registry-api", fn: checkRegistryHealth },
    { name: "autorouting-api", fn: checkAutoroutingApiHealth },
    { name: "freerouting-cluster", fn: checkFreeroutingClusterHealth },
    { name: "jlcsearch-api", fn: checkJLCSearchHealth },
    // TODO switch to underscore/dashes
    { name: "registry_bundling", fn: checkRegistryAndBundlingHealth },
    { name: "fly_registry_api", fn: checkFlyRegistryHealth },
    { name: "compile_api", fn: checkCompileApiHealth },
    { name: "svg_service", fn: checkSvgServiceHealth },
    { name: "png_service", fn: checkPngServiceHealth },
    { name: "browser_preview", fn: checkBrowserPreviewHealth },
    { name: "tscircuit_package", fn: checkTscircuitPackageHealth },
  ]

  const results: StatusCheck["checks"] = await Promise.all(
    checks.map(async (check) => {
      const result = await check.fn()
      if (!result.ok) {
        console.error(
          `${check.name} health check failed: ${result.error.message}`,
        )
      }
      return {
        service: check.name,
        status: result.ok ? "ok" : "error",
        ...(result.ok ? {} : { error: result.error.message }),
      }
    }),
  )

  const statusCheck: StatusCheck = {
    timestamp: new Date().toISOString(),
    checks: results,
  }

  // Append to statuses.jsonl
  fs.appendFileSync("./statuses.jsonl", `${JSON.stringify(statusCheck)}\n`)

  // Limit to 2 weeks of logs
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const content = await Bun.file("./statuses.jsonl").text()
  const lines = content.trim().split("\n")
  const recentLogs = lines
    .map((line) => JSON.parse(line))
    .filter((log: StatusCheck) => new Date(log.timestamp) >= twoWeeksAgo)

  await Bun.write(
    "./statuses.jsonl",
    // biome-ignore lint/style/useTemplate: <explanation>
    recentLogs.map((log) => JSON.stringify(log)).join("\n") + "\n",
  )
}

runChecksAndWriteLog().catch(console.error)
