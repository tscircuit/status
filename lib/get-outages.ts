export const getOutages = (checks: StatusCheck[]) => {
  const outages: Array<{
    service: string
    start: Date
    end: Date
    duration: number
  }> = []

  // Group checks by service
  const serviceChecks = new Map<string, StatusCheck[]>()
  checks.forEach((check) => {
    check.checks.forEach((serviceCheck) => {
      if (!serviceChecks.has(serviceCheck.service)) {
        serviceChecks.set(serviceCheck.service, [])
      }
      serviceChecks.get(serviceCheck.service)?.push({
        ...check,
        checks: [serviceCheck],
      })
    })
  })

  // Find outage periods for each service
  serviceChecks.forEach((checks, service) => {
    let currentOutage: { start: Date; end: Date } | null = null

    checks.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    checks.forEach((check) => {
      const timestamp = new Date(check.timestamp)
      const hasError = check.checks[0].status === "error"

      if (hasError && !currentOutage) {
        // Start new outage
        currentOutage = {
          start: timestamp,
          end: timestamp,
        }
      } else if (!hasError && currentOutage) {
        // End current outage
        currentOutage.end = timestamp
        outages.push({
          service,
          start: currentOutage.start,
          end: currentOutage.end,
          duration: currentOutage.end.getTime() - currentOutage.start.getTime(),
        })
        currentOutage = null
      } else if (currentOutage) {
        // Update end time of ongoing outage
        currentOutage.end = timestamp
      }
    })

    // Handle ongoing outage
    if (currentOutage) {
      outages.push({
        service,
        start: currentOutage.start,
        end: currentOutage.end,
        duration: currentOutage.end.getTime() - currentOutage.start.getTime(),
      })
    }
  })

  return outages
}
