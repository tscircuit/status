import ky from "ky"
import * as fs from "fs"
import type { StatusCheck, Outage } from "../lib/types"

// Configuration
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const NOTIFICATION_THRESHOLD = 20 * 60 * 1000 // 20 minutes in milliseconds
const STATUS_FILE = "./statuses.jsonl"
const REPORTED_OUTAGES_FILE = "./reported-outages.json"
const IGNORED_SERVICES = ["usercode_api"] // Services to ignore for notifications

console.log("Starting Discord notification script for ongoing outages...")
console.log("Webhook URL present:", !!DISCORD_WEBHOOK_URL)

// Exit if webhook URL is not set
if (!DISCORD_WEBHOOK_URL) {
  console.error("DISCORD_WEBHOOK_URL environment variable is not set")
  process.exit(1)
}

/**
 * Load previously reported outages to prevent duplicate notifications
 */
function loadReportedOutages(): Record<string, number> {
  try {
    if (fs.existsSync(REPORTED_OUTAGES_FILE)) {
      const data = fs.readFileSync(REPORTED_OUTAGES_FILE, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error reading reported outages file:", error)
  }
  return {}
}

/**
 * Save reported outages to file
 */
function saveReportedOutages(reportedOutages: Record<string, number>): void {
  try {
    fs.writeFileSync(
      REPORTED_OUTAGES_FILE,
      JSON.stringify(reportedOutages, null, 2),
    )
  } catch (error) {
    console.error("Error saving reported outages:", error)
  }
}

/**
 * Format duration from milliseconds to a readable string
 */
function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.round(milliseconds / 1000 / 60)
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}hr ${minutes.toString().padStart(2, "0")}min`
  } else {
    return `${totalMinutes}min`
  }
}

/**
 * Read the status checks from statuses.jsonl
 */
async function readStatusChecks(): Promise<StatusCheck[]> {
  const content = await Bun.file(STATUS_FILE).text()
  return content
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
}

/**
 * Find current outages from status checks
 */
function findCurrentOutages(statusChecks: StatusCheck[]): Map<
  string,
  {
    service: string
    startTime: Date
    duration: number
    error: string
    isOngoing: boolean
  }
> {
  const outageMap = new Map()
  const serviceStatus = new Map()

  // Sort checks chronologically
  statusChecks.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )

  for (const check of statusChecks) {
    const checkTime = new Date(check.timestamp)

    // Process each service in the check
    for (const service of check.checks) {
      const serviceName = service.service

      // Skip ignored services
      if (IGNORED_SERVICES.includes(serviceName)) {
        continue
      }

      // Service has an error
      if (service.status === "error") {
        if (
          !serviceStatus.has(serviceName) ||
          serviceStatus.get(serviceName).status === "ok"
        ) {
          // New outage
          serviceStatus.set(serviceName, {
            status: "error",
            since: checkTime,
            error: service.error || "Unknown error",
          })

          // Record the outage
          outageMap.set(serviceName, {
            service: serviceName,
            startTime: checkTime,
            duration: 0,
            error: service.error || "Unknown error",
            isOngoing: true,
          })
        }
      }
      // Service is OK
      else if (service.status === "ok") {
        // If there was an outage before, remove it
        if (
          serviceStatus.has(serviceName) &&
          serviceStatus.get(serviceName).status === "error"
        ) {
          serviceStatus.set(serviceName, {
            status: "ok",
            since: checkTime,
          })

          // The service is back online, remove from current outages
          outageMap.delete(serviceName)
        }
      }
    }
  }

  // Calculate duration for current outages
  const now = new Date()
  console.log(`Current time: ${now.toISOString()}`) // Debug: Current time
  for (const [serviceName, outage] of outageMap.entries()) {
    outage.duration = now.getTime() - outage.startTime.getTime()
    console.log(
      `Outage for ${serviceName}: StartTime = ${outage.startTime.toISOString()}, Now = ${now.toISOString()}, Duration = ${outage.duration}ms`,
    ) // Debug: Outage details
  }

  return outageMap
}

/**
 * Send notifications for ongoing outages that exceed the threshold
 */
async function sendDiscordNotification() {
  try {
    // Load previously reported outages
    const reportedOutages = loadReportedOutages()

    // Read the status checks
    console.log("Reading status checks from statuses.jsonl...")
    const statusChecks = await readStatusChecks()
    console.log(`Found ${statusChecks.length} status checks`)

    // Find current outages
    console.log("Finding outages...")
    const currentOutages = findCurrentOutages(statusChecks)
    console.log(`Found ${currentOutages.size} current outages`)

    // Remove resolved outages from tracking
    const updatedReportedOutages = { ...reportedOutages }
    const resolvedOutages: Array<{
      service: string
      startTime: Date
      endTime: Date
      duration: number
    }> = []

    // Helper to find last outage period for a resolved service
    function findLastOutagePeriod(
      serviceName: string,
    ): { startTime: Date; endTime: Date; duration: number } | null {
      // Go through statusChecks in order, track error periods
      let inOutage = false
      let outageStart: Date | null = null
      let outageEnd: Date | null = null
      for (const check of statusChecks) {
        const service = check.checks.find((s) => s.service === serviceName)
        if (!service) continue
        if (service.status === "error") {
          if (!inOutage) {
            inOutage = true
            outageStart = new Date(check.timestamp)
          }
          outageEnd = new Date(check.timestamp)
        } else if (service.status === "ok" && inOutage) {
          // Outage ends here
          outageEnd = new Date(check.timestamp)
          break
        }
      }
      if (outageStart && outageEnd) {
        return {
          startTime: outageStart,
          endTime: outageEnd,
          duration: outageEnd.getTime() - outageStart.getTime(),
        }
      }
      return null
    }

    for (const serviceName in updatedReportedOutages) {
      if (!currentOutages.has(serviceName)) {
        console.log(
          `Service ${serviceName} is now resolved, removing from tracking`,
        )
        // Find last outage period from status history
        const period = findLastOutagePeriod(serviceName)
        if (period) {
          resolvedOutages.push({
            service: serviceName,
            startTime: period.startTime,
            endTime: period.endTime,
            duration: period.duration,
          })
        }
        delete updatedReportedOutages[serviceName]
      }
    }

    // Send resolution notifications if there are any resolved outages
    if (resolvedOutages.length > 0) {
      console.log(`Found ${resolvedOutages.length} resolved outages to report`)
      const resolutionMessage = {
        content: `**✅ Service Outage Resolved**`,
        embeds: resolvedOutages.map((outage) => ({
          title: `✅ Service Restored: ${outage.service}`,
          description: `This service has been restored after being down for ${formatDuration(outage.duration)}`,
          color: 0x00ff00, // Green color
          fields: [
            {
              name: "Start Time",
              value: outage.startTime.toLocaleString(),
              inline: true,
            },
            {
              name: "End Time",
              value: outage.endTime.toLocaleString(),
              inline: true,
            },
            {
              name: "Total Duration",
              value: formatDuration(outage.duration),
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        })),
      }

      console.log("Sending resolution message to Discord...")
      if (DISCORD_WEBHOOK_URL) {
        const response = await ky.post(DISCORD_WEBHOOK_URL, {
          json: resolutionMessage,
          timeout: 10000, // 10 second timeout
        })

        console.log("Discord API Response Status:", response.status)
        if (response.status >= 200 && response.status < 300) {
          console.log("Resolution notification sent successfully")
        } else {
          console.error(
            "Failed to send resolution notification - HTTP error:",
            response.status,
          )
        }
      }
    }

    // Filter for outages that have lasted more than the threshold
    const longOutages = Array.from(currentOutages.values()).filter(
      (outage) => outage.duration >= NOTIFICATION_THRESHOLD,
    )
    console.log(
      `Found ${longOutages.length} outages over ${NOTIFICATION_THRESHOLD / (60 * 1000)} minutes`,
    )

    if (longOutages.length === 0) {
      console.log("No long outages to report")
      saveReportedOutages(updatedReportedOutages)
      return
    }

    // Find new outages that haven't been reported yet
    const newOutages = longOutages.filter(
      (outage) => !updatedReportedOutages[outage.service],
    )

    console.log(`Found ${newOutages.length} new outages to report`)

    if (newOutages.length === 0) {
      console.log("All current outages have already been reported")
      saveReportedOutages(updatedReportedOutages)
      return
    }

    // Format the message for new outages only
    console.log("Preparing Discord message...")
    const message = {
      content: `**🚨 Service Outage Notification**`,
      embeds: newOutages.map((outage) => ({
        title: `🚨 Service Outage: ${outage.service}`,
        description: `This service has been down for ${formatDuration(outage.duration)}`,
        color: 0xff0000, // Red color
        fields: [
          {
            name: "Start Time",
            value: outage.startTime.toLocaleString(),
            inline: true,
          },
          {
            name: "Current Duration",
            value: formatDuration(outage.duration),
            inline: true,
          },
          {
            name: "Error",
            value: outage.error,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      })),
    }

    console.log("Sending message to Discord...")

    // Send to Discord
    if (DISCORD_WEBHOOK_URL) {
      const response = await ky.post(DISCORD_WEBHOOK_URL, {
        json: message,
        timeout: 10000, // 10 second timeout
      })

      console.log("Discord API Response Status:", response.status)

      if (response.status >= 200 && response.status < 300) {
        console.log("Discord notification sent successfully")

        // Update reported outages
        newOutages.forEach((outage) => {
          updatedReportedOutages[outage.service] = Date.now()
        })
      } else {
        console.error(
          "Failed to send notification - HTTP error:",
          response.status,
        )
      }
    } else {
      console.error("DISCORD_WEBHOOK_URL is not defined")
    }

    // Save the updated outages tracking file
    saveReportedOutages(updatedReportedOutages)
  } catch (error: any) {
    console.error("Failed to send Discord notification:")
    console.error("Error details:", error)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response body:", await error.response.text())
    }
    process.exit(1)
  }
}

// Execute the main function
sendDiscordNotification()
