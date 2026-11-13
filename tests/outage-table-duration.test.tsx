import { expect, test } from "bun:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { OutageTable, formatDuration } from "../components/OutageTable"

test("formatDuration formats outages under and over an hour", () => {
  expect(formatDuration(15 * 60 * 1000)).toBe("15min")
  expect(formatDuration(59 * 60 * 1000)).toBe("59min")
  expect(formatDuration(60 * 60 * 1000)).toBe("1hr 00min")
  expect(formatDuration(66 * 60 * 1000)).toBe("1hr 06min")
  expect(formatDuration(135 * 60 * 1000)).toBe("2hr 15min")
})

test("OutageTable renders multi-hour outages in hours and zero-padded minutes", () => {
  const html = renderToStaticMarkup(
    <OutageTable
      outages={[
        {
          service: "registry-api",
          start: new Date("2026-01-01T00:00:00.000Z"),
          end: new Date("2026-01-01T01:06:00.000Z"),
          duration: 66 * 60 * 1000,
          isOngoing: false,
        },
        {
          service: "compile-api",
          start: new Date("2026-01-01T02:00:00.000Z"),
          end: new Date("2026-01-01T02:25:00.000Z"),
          duration: 25 * 60 * 1000,
          isOngoing: true,
        },
      ]}
    />,
  )

  expect(html).toContain("1hr 06min")
  expect(html).toContain("25min")
})
