import React from "react"
import { renderToString } from "react-dom/server"

interface StatusCheck {
  timestamp: string
  checks: {
    service: string
    status: "ok" | "error"
    error?: string
  }[]
}

function calculateUptime(checks: StatusCheck[], service: string): number {
  const serviceChecks = checks.flatMap((check) =>
    check.checks.filter((c) => c.service === service),
  )
  const successfulChecks = serviceChecks.filter(
    (check) => check.status === "ok",
  )
  return (successfulChecks.length / serviceChecks.length) * 100
}

function StatusGrid({ checks }: { checks: StatusCheck[] }) {
  const latestCheck = checks[checks.length - 1]
  const services = latestCheck.checks.map((check) => check.service)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {services.map((service) => {
        const uptime = calculateUptime(checks, service)
        const latest = latestCheck.checks.find((c) => c.service === service)

        return (
          <div key={service} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{service}</h3>
            <div className="flex items-center mb-4">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${latest?.status === "ok" ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span>{latest?.status === "ok" ? "Operational" : "Error"}</span>
            </div>
            <div className="text-2xl font-bold mb-1">{uptime.toFixed(2)}%</div>
            <div className="text-sm text-gray-600">Uptime (14 days)</div>
          </div>
        )
      })}
    </div>
  )
}

function UptimeGraph({ checks }: { checks: StatusCheck[] }) {
  const services = checks[0].checks.map((check) => check.service)
  const days = [
    ...new Set(
      checks.map((check) => new Date(check.timestamp).toLocaleDateString()),
    ),
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Uptime History</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service} className="relative">
            <div className="text-sm font-medium mb-1">{service}</div>
            <div className="flex gap-1">
              {days.map((day) => {
                const dayChecks = checks.filter(
                  (check) =>
                    new Date(check.timestamp).toLocaleDateString() === day,
                )
                const serviceChecks = dayChecks.flatMap((check) =>
                  check.checks.filter((c) => c.service === service),
                )
                const hasError = serviceChecks.some(
                  (check) => check.status === "error",
                )

                return (
                  <div
                    key={day}
                    className={`flex-1 h-8 ${hasError ? "bg-red-200" : "bg-green-200"}`}
                    title={`${day}: ${hasError ? "Issues Detected" : "Operational"}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function generateSite() {
  const content = await Bun.file("./statuses.jsonl").text()
  const checks: StatusCheck[] = content
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))

  const html = renderToString(
    <html lang="en">
      <head>
        <title>TSCircuit Status</title>
        <script src="https://cdn.tailwindcss.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">TSCircuit Status</h1>
          <StatusGrid checks={checks} />
          <UptimeGraph checks={checks} />
        </div>
      </body>
    </html>,
  )

  await Bun.write("./public/index.html", `<!DOCTYPE html>${html}`)
}

generateSite().catch(console.error)
