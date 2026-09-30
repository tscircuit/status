import type { HealthCheckFunction } from "./types"
import ky from "ky"

// Cold image renders can take 6–8 seconds even on the previous Node deployment.
// Bound the entire response, including its body, without treating that as downtime.
export const SVG_RENDER_TIMEOUT_MS = 15_000

export async function checkSvgImage(
  url: string,
  timeoutMs = SVG_RENDER_TIMEOUT_MS,
): Promise<void> {
  const response = await ky.get(url, {
    timeout: timeoutMs,
    retry: 0,
    signal: AbortSignal.timeout(timeoutMs),
  })
  const svg = await response.text()
  if (
    !response.headers.get("content-type")?.includes("image/svg+xml") ||
    !response.headers.get("cache-control")?.includes("immutable") ||
    !/<svg[ >]/.test(svg) ||
    !/<(path|rect|circle|polygon|line)[ >]/.test(svg)
  ) {
    throw new Error("Response is not a successful rendered SVG")
  }
}

export const checkSvgServiceHealth: HealthCheckFunction = async () => {
  try {
    const randomParam = Math.random().toString(36).substring(7)
    const pcbUrl = `https://svg.tscircuit.com/?svg_type=pcb&code=H4sIAJsBqGcAA42QsQ6CMBRFdxP%2F4aUTDEJBNikLiR%2FA5FpKkUahTanRxPjvVksb4uTWc3JfTlL%2BUFIb6HhPb1cDUQykgmi7AShbSXUHd9GZgaAMjyOCgYvzYBaqPiu703wWs5HaIYBjOjFOUH5BXvdSGqXFZM9xgfPgJzraYZMFMbPhRJ7Fy7NireX9wqnPMqooE6vuIly4wBir45%2Fx%2Bje%2B8zVfDyLkjaaMQ6%2FlSFDSZFBBosSUITDSinol3EmZfv%2FTvuPDG02y%2Bwx1AQAA&cachebust=${randomParam}`
    const schematicUrl = `https://svg.tscircuit.com/?svg_type=schematic&code=H4sIAJsBqGcAA42QsQ6CMBRFdxP%2F4aUTDEJBNikLiR%2FA5FpKkUahTanRxPjvVksb4uTWc3JfTlL%2BUFIb6HhPb1cDUQykgmi7AShbSXUHd9GZgaAMjyOCgYvzYBaqPiu703wWs5HaIYBjOjFOUH5BXvdSGqXFZM9xgfPgJzraYZMFMbPhRJ7Fy7NireX9wqnPMqooE6vuIly4wBir45%2Fx%2Bje%2B8zVfDyLkjaaMQ6%2FlSFDSZFBBosSUITDSinol3EmZfv%2FTvuPDG02y%2Bwx1AQAA&cachebust=${randomParam}`

    await Promise.all(
      [
        ["pcb", pcbUrl],
        ["schematic", schematicUrl],
      ].map(async ([view, url]) => {
        const start = Date.now()
        try {
          await checkSvgImage(url)
        } catch (error) {
          const detail = error instanceof Error ? error.message : String(error)
          throw new Error(
            `${view} render failed after ${Date.now() - start}ms: ${detail}`,
          )
        }
      }),
    )

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: `SVG Service Health Check Failed: ${err instanceof Error ? err.message : String(err)}`,
      },
    }
  }
}
