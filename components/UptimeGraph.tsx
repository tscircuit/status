import { formatDateTime } from "lib/format-date"
import type { StatusCheck } from "lib/types"

export function UptimeGraph({ checks }: { checks: StatusCheck[] }) {
  const latestCheck = checks[checks.length - 1]
  const services = latestCheck.checks.map((check) => check.service)

  // Create a map of hour strings to checks for efficient lookup
  const hourChecksMap = new Map<string, StatusCheck[]>()
  const hours: string[] = []

  // Build the map and hours array in a single pass through checks
  for (const check of checks) {
    const hourStart = new Date(check.timestamp)
    hourStart.setMinutes(0, 0, 0)
    const hourKey = hourStart.toISOString()

    if (!hourChecksMap.has(hourKey)) {
      hourChecksMap.set(hourKey, [])
      hours.push(hourKey)
    }
    hourChecksMap.get(hourKey)!.push(check)
  }

  // Sort hours once
  hours.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  console.log("rendering uptime graph...", hours.length)

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-hidden">
      <h3 className="text-lg font-semibold mb-4">Uptime History</h3>
      <div className="space-y-4 sm:overflow-visible overflow-x-auto pb-2">
        {services.map((service) => (
          <div key={service} className="relative">
            <div className="text-sm font-medium mb-1">{service}</div>
            <div className="grid grid-flow-col auto-cols-fr gap-px w-full sm:overflow-visible overflow-x-auto">
              {hours.map((hour) => {
                const hourChecks = hourChecksMap.get(hour) || []
                const serviceChecks = hourChecks.flatMap((check) =>
                  check.checks.filter((c) => c.service === service),
                )
                // Handle missing data case
                if (serviceChecks.length === 0) {
                  return (
                    <div
                      key={hour}
                      className="h-8 w-full bg-gray-200"
                      data-hour-start={hour}
                      data-has-data="false"
                      title={`${formatDateTime(hour, {
                        timeZone: "UTC",
                        hour12: false,
                      })}\nNo data available for this period`}
                    />
                  )
                }

                const hasError = serviceChecks.some(
                  (check) => check.status === "error",
                )
                const allErrors = serviceChecks.every(
                  (check) => check.status === "error",
                )

                const tooltipChecks: Array<{
                  timestamp: string
                  status: "ok" | "error"
                }> = hourChecks.flatMap((check) => {
                  const serviceCheck = check.checks.find(
                    (c) => c.service === service,
                  )
                  if (!serviceCheck) {
                    return []
                  }
                  return [
                    {
                      timestamp: check.timestamp,
                      status: serviceCheck.status,
                    },
                  ]
                })

                return (
                  <div
                    key={hour}
                    className={`h-6 sm:h-8 min-w-[12px] ${
                      allErrors
                        ? "bg-red-200"
                        : hasError
                          ? "bg-yellow-200"
                          : "bg-green-200"
                    }`}
                    data-hour-start={hour}
                    data-has-data="true"
                    data-tooltip-checks={JSON.stringify(tooltipChecks)}
                    title={`${formatDateTime(hour, {
                      timeZone: "UTC",
                      hour12: false,
                    })}\n${tooltipChecks
                      .map(
                        (entry) =>
                          `${formatDateTime(entry.timestamp, {
                            timeZone: "UTC",
                            hour12: false,
                          })}: ${entry.status === "error" ? "Issues Detected" : "Operational"}`,
                      )
                      .join("\n")}`}
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
