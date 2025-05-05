import type { Outage, StatusCheck } from "./types"

export const getOutages = (checks: StatusCheck[]) => {
  const outages: Array<Outage> = []

  // Group checks by service
  const serviceChecks = new Map<string, StatusCheck[]>()
  for (const check of checks) {
    for (const serviceCheck of check.checks) {
      if (!serviceChecks.has(serviceCheck.service)) {
        serviceChecks.set(serviceCheck.service, [])
      }
      serviceChecks.get(serviceCheck.service)?.push({
        ...check,
        checks: [serviceCheck],
      })
    }
  }

  // Find outage periods for each service
  for (const [service, checks] of serviceChecks) {
    let currentOutage: { start: Date; end: Date; error?: string } | null = null

    checks.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    for (const check of checks) {
      const timestamp = new Date(check.timestamp)
      const hasError = check.checks[0].status === "error"
      const error = check.checks[0].error

      if (hasError && !currentOutage) {
        // Start new outage
        currentOutage = {
          start: timestamp,
          end: timestamp,
          error,
        }
      } else if (!hasError && currentOutage) {
        // End current outage
        currentOutage.end = timestamp
        outages.push({
          service,
          start: currentOutage.start,
          end: currentOutage.end,
          duration: currentOutage.end.getTime() - currentOutage.start.getTime(),
          isOngoing: false,
          error: currentOutage.error,
        })
        currentOutage = null
      } else if (currentOutage) {
        // Update end time of ongoing outage
        currentOutage.end = timestamp
        if (error) {
          currentOutage.error = error
        }
      }
    }

    // Handle ongoing outage
    if (currentOutage) {
      outages.push({
        service,
        start: currentOutage.start,
        end: currentOutage.end,
        duration: currentOutage.end.getTime() - currentOutage.start.getTime(),
        isOngoing: true,
        error: currentOutage.error,
      })
    }
  }

  return outages
}
