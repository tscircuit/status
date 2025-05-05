import { writeFile } from "node:fs/promises"
import { execSync } from "node:child_process"
import type { StatusCheck } from "../lib/types"

// Check if webhook URL is set
if (!process.env.DISCORD_WEBHOOK_URL) {
  console.error("Error: DISCORD_WEBHOOK_URL environment variable is not set")
  console.error(
    "Please set it using: export DISCORD_WEBHOOK_URL='your-webhook-url'",
  )
  process.exit(1)
}

console.log("Creating test outage data...")

// Create multiple test status checks to simulate a longer outage
const now = Date.now()
const testChecks: StatusCheck[] = [
  {
    timestamp: new Date(now - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "ok",
      },
      {
        service: "autorouting-api",
        status: "ok",
      },
    ],
  },
  {
    timestamp: new Date(now - 25 * 60 * 1000).toISOString(), // 25 minutes ago
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "ok",
      },
      {
        service: "autorouting-api",
        status: "error",
        error: "Autorouting error - test",
      },
    ],
  },
  {
    timestamp: new Date(now - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "ok",
      },
      {
        service: "autorouting-api",
        status: "error",
        error: "Autorouting error - test",
      },
    ],
  },
  {
    timestamp: new Date(now - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "error",
        error: "Registry API Health Ping Failed",
      },
      {
        service: "autorouting-api",
        status: "error",
        error: "Autorouting error - test",
      },
    ],
  },
  {
    timestamp: new Date(now - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "error",
        error: "Registry API Health Ping Failed",
      },
      {
        service: "autorouting-api",
        status: "ok",
      },
    ],
  },
  {
    timestamp: new Date(now - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "error",
        error: "Registry API Health Ping Failed",
      },
      {
        service: "autorouting-api",
        status: "ok",
      },
    ],
  },
  {
    timestamp: new Date(now).toISOString(), // Now
    checks: [
      {
        service: "test-service",
        status: "error",
        error: "Test outage for notification testing",
      },
      {
        service: "registry-api",
        status: "error",
        error: "Registry API Health Ping Failed",
      },
      {
        service: "autorouting-api",
        status: "ok",
      },
    ],
  },
]

async function runTest() {
  try {
    // Write the test checks to statuses.jsonl
    await writeFile(
      "./statuses.jsonl",
      testChecks.map((check) => JSON.stringify(check)).join("\n") + "\n",
    )
    console.log("Test outage data written successfully")

    // Run the notification script
    console.log("Sending notification to Discord...")
    execSync("bun run scripts/discord-notification.ts", {
      env: { ...process.env },
      stdio: "inherit",
    })

    console.log("Test completed successfully")
  } catch (error) {
    console.error("Error during test:", error)
    process.exit(1)
  }
}

runTest()
