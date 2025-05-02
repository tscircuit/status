import ky from "ky"
import { getOutages } from "../lib/get-outages"
import type { StatusCheck } from "../lib/types"

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const NOTIFICATION_THRESHOLD = 20 * 60 * 1000 // 20 minutes in milliseconds

console.log("Starting Discord notification script...")
console.log("Webhook URL present:", !!DISCORD_WEBHOOK_URL)

if (!DISCORD_WEBHOOK_URL) {
  console.error("DISCORD_WEBHOOK_URL environment variable is not set")
  process.exit(1)
}

async function sendDiscordNotification() {
  try {
    // Read the status checks
    console.log("Reading status checks from statuses.jsonl...")
    const content = await Bun.file("./statuses.jsonl").text()
    const checks: StatusCheck[] = content
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line))

    console.log(`Found ${checks.length} status checks`)

    // Get all outages
    console.log("Computing outages...")
    const outages = getOutages(checks)
    console.log(`Found ${outages.length} total outages`)

    // Filter for ongoing outages that have lasted more than 20 minutes
    const longOutages = outages.filter(
      (outage) => outage.isOngoing && outage.duration >= NOTIFICATION_THRESHOLD
    )
    console.log(`Found ${longOutages.length} outages over 20 minutes`)

    if (longOutages.length === 0) {
      console.log("No long outages to report")
      return
    }

    // Format the message
    console.log("Preparing Discord message...")
    const message = {
      embeds: longOutages.map((outage) => ({
        title: `🚨 Service Outage: ${outage.service}`,
        description: `This service has been down for ${formatDuration(
          outage.duration
        )}`,
        color: 0xff0000, // Red color
        fields: [
          {
            name: "Start Time",
            value: outage.start.toLocaleString(),
            inline: true,
          },
          {
            name: "Current Duration",
            value: formatDuration(outage.duration),
            inline: true,
          },
        ],
      })),
    }

    console.log("Sending message to Discord...")
    console.log("Message content:", JSON.stringify(message, null, 2))

    // Send to Discord
    const response = await ky.post(DISCORD_WEBHOOK_URL as string, {
      json: message,
    })

    console.log("Discord API Response Status:", response.status)
    console.log("Discord notification sent successfully")
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

sendDiscordNotification()
