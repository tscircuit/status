import React from "react"
import { renderToString } from "react-dom/server"
import { getOutages } from "../lib/get-outages"
import type { StatusCheck } from "lib/types"
import { StatusGrid } from "components/StatusGrid"
import { UptimeGraph } from "components/UptimeGraph"
import { OutageTable } from "components/OutageTable"

async function generateSite() {
  console.log("reading statuses...")
  const content = await Bun.file("./statuses.jsonl").text()
  const checks: StatusCheck[] = content
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
  console.log("found", checks.length, "checks")

  console.log("computing service outages...")
  const outages = getOutages(checks)
  console.log("found", outages.length, "outages")

  console.log("rendering html...")
  const html = renderToString(
    <html lang="en">
      <head>
        <title>tscircuit Status</title>
        <script src="https://cdn.tailwindcss.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">tscircuit Status</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-6">
            <label
              htmlFor="timezone-selector"
              className="text-sm font-medium text-gray-700"
            >
              Timezone
            </label>
            <select
              id="timezone-selector"
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
            </select>
          </div>
          <StatusGrid checks={checks} />
          <UptimeGraph checks={checks} />
          <OutageTable outages={outages} />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              ;(() => {
                const defaultTimezone = "UTC"
                const formatterCache = new Map()

                const getFormatter = (timezone, hour12) => {
                  const key =
                    timezone +
                    "|" +
                    (hour12 === undefined ? "auto" : hour12 ? "12" : "24")
                  if (!formatterCache.has(key)) {
                    formatterCache.set(
                      key,
                      new Intl.DateTimeFormat("en-US", {
                        timeZone: timezone,
                        dateStyle: "medium",
                        timeStyle: "short",
                        ...(hour12 !== undefined ? { hour12 } : {}),
                      }),
                    )
                  }
                  return formatterCache.get(key)
                }

                const formatDate = (value, timezone) => {
                  const formatter = getFormatter(
                    timezone,
                    timezone === "UTC" ? false : undefined,
                  )
                  return formatter.format(new Date(value))
                }

                const updateTimestamps = (timezone) => {
                  document.querySelectorAll("[data-timestamp]").forEach((element) => {
                    const timestamp = element.getAttribute("data-timestamp")
                    if (!timestamp) return
                    element.textContent = formatDate(timestamp, timezone)
                  })
                }

                const updateTitles = (timezone) => {
                  document.querySelectorAll("[data-hour-start]").forEach((element) => {
                    const hourStart = element.getAttribute("data-hour-start")
                    if (!hourStart) return
                    const hasData = element.getAttribute("data-has-data") === "true"
                    const formattedHour = formatDate(hourStart, timezone)

                    if (!hasData) {
                      element.setAttribute(
                        "title",
                        formattedHour + "\\nNo data available for this period",
                      )
                      return
                    }

                    const checksData = element.getAttribute("data-tooltip-checks")
                    if (!checksData) {
                      element.setAttribute("title", formattedHour)
                      return
                    }

                    let checks
                    try {
                      checks = JSON.parse(checksData)
                    } catch (error) {
                      console.error("Failed to parse tooltip data", error)
                      element.setAttribute("title", formattedHour)
                      return
                    }

                    const lines = checks.map((entry) => {
                      const formattedTimestamp = formatDate(entry.timestamp, timezone)
                      const status =
                        entry.status === "error"
                          ? "Issues Detected"
                          : "Operational"
                      return formattedTimestamp + ": " + status
                    })

                    element.setAttribute(
                      "title",
                      [formattedHour, ...lines].join("\\n"),
                    )
                  })
                }

                const applyTimezone = (timezone) => {
                  updateTimestamps(timezone)
                  updateTitles(timezone)
                }

                document.addEventListener("DOMContentLoaded", () => {
                  const selector = document.getElementById("timezone-selector")
                  if (selector) {
                    const existingValues = new Set(
                      Array.from(selector.options).map((option) => option.value),
                    )

                    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
                    if (localTimezone && !existingValues.has(localTimezone)) {
                      const option = document.createElement("option")
                      option.value = localTimezone
                      option.textContent = localTimezone + " (Local)"
                      selector.insertBefore(option, selector.options[1] ?? null)
                      existingValues.add(localTimezone)
                    }

                    if (typeof Intl.supportedValuesOf === "function") {
                      Intl.supportedValuesOf("timeZone").forEach((timezone) => {
                        if (existingValues.has(timezone)) return
                        const option = document.createElement("option")
                        option.value = timezone
                        option.textContent = timezone
                        selector.append(option)
                        existingValues.add(timezone)
                      })
                    }

                    selector.value = defaultTimezone
                    selector.addEventListener("change", () => {
                      applyTimezone(selector.value)
                    })
                  }

                  applyTimezone(selector ? selector.value : defaultTimezone)
                })
              })()
            `,
          }}
        />
      </body>
    </html>,
  )

  console.log("writing to ./public/index.html...")
  await Bun.write("./public/index.html", `<!DOCTYPE html>${html}`)
}

generateSite().catch(console.error)
