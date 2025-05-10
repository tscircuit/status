import ky from "ky"
import * as fs from "fs"
import type { StatusCheck, Outage } from "../lib/types"

// Slack Block Kit types
type SlackTextBlock = {
  type: "mrkdwn" | "plain_text"
  text: string
  emoji?: boolean
}

type SlackBlock = {
  type: "header" | "section" | "divider"
  text?: SlackTextBlock
}

// Configuration
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const NOTIFICATION_THRESHOLD = 20 * 60 * 1000 // 20 minutes in milliseconds
const STATUS_FILE = "./statuses.jsonl"
const REPORTED_OUTAGES_FILE = "./reported-outages.json"

console.log("Starting Slack notification script for ongoing outages...")
console.log("Webhook URL present:", !!SLACK_WEBHOOK_URL)

// Exit if webhook URL is not set
if (!SLACK_WEBHOOK_URL) {
  console.error("SLACK_WEBHOOK_URL environment variable is not set")
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
      `Outage for ${serviceName}: StartTime = ${outage.startTime.toISOString()}, Now = ${now.toISOString()}, Duration = ${
        outage.duration
      }ms`,
    ) // Debug: Outage details
  }

  return outageMap
}

/**
 * Send notifications for ongoing outages that exceed the threshold
 */
async function sendSlackNotification() {
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
    for (const serviceName in updatedReportedOutages) {
      if (!currentOutages.has(serviceName)) {
        console.log(
          `Service ${serviceName} is now resolved, removing from tracking`,
        )
        delete updatedReportedOutages[serviceName]
      }
    }

    // Filter for outages that have lasted more than the threshold
    const longOutages = Array.from(currentOutages.values()).filter(
      (outage) => outage.duration >= NOTIFICATION_THRESHOLD,
    )
    console.log(
      `Found ${longOutages.length} outages over ${
        NOTIFICATION_THRESHOLD / (60 * 1000)
      } minutes`,
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

    // Format the message for new outages
    console.log("Preparing Slack message...")
    const blocks: SlackBlock[] = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 Service Outage Notification",
          emoji: true,
        },
      },
    ]

    for (const outage of newOutages) {
      blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Service:* ${outage.service}\n*Duration:* ${formatDuration(
              outage.duration,
            )}\n*Start Time:* ${outage.startTime.toLocaleString()}\n*Error:* ${
              outage.error
            }`,
          },
        },
        {
          type: "divider",
        },
      )
    }

    const message = {
      blocks,
    }

    console.log("Sending message to Slack...")

    // Send to Slack
    if (SLACK_WEBHOOK_URL) {
      const response = await ky.post(SLACK_WEBHOOK_URL, {
        json: message,
        timeout: 10000, // 10 second timeout
      })

      console.log("Slack API Response Status:", response.status)

      if (response.status >= 200 && response.status < 300) {
        console.log("Slack notification sent successfully")

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
      console.error("SLACK_WEBHOOK_URL is not defined")
    }

    // Save the updated outages tracking file
    saveReportedOutages(updatedReportedOutages)
  } catch (error: any) {
    console.error("Failed to send Slack notification:")
    console.error("Error details:", error)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response body:", await error.response.text())
    }
    process.exit(1)
  }
}

// Execute the main function
sendSlackNotification()
