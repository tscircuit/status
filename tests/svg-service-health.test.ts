import { afterEach, expect, test } from "bun:test"
import { checkSvgImage } from "../status-checks/check-svg-service-health"

const servers: ReturnType<typeof Bun.serve>[] = []
const serve = (handler: () => Response | Promise<Response>) => {
  const server = Bun.serve({ port: 0, fetch: handler })
  servers.push(server)
  return `http://localhost:${server.port}/`
}
afterEach(() => {
  for (const server of servers.splice(0)) server.stop(true)
})
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L1 1"/></svg>'
const headers = {
  "content-type": "image/svg+xml",
  "cache-control":
    "public, max-age=300, stale-while-revalidate=604800, stale-if-error=604800",
}

test("accepts an actual rendered image without immutable caching", async () => {
  await expect(
    checkSvgImage(serve(() => new Response(svg, { headers }))),
  ).resolves.toBeUndefined()
})
test("rejects no-store error images even with public caching", async () => {
  await expect(
    checkSvgImage(
      serve(
        () =>
          new Response(svg, {
            headers: {
              ...headers,
              "cache-control": "public, no-store",
            },
          }),
      ),
    ),
  ).rejects.toThrow("not a successful rendered SVG")
})
test("rejects HTTP 200 error images", async () => {
  await expect(
    checkSvgImage(
      serve(
        () =>
          new Response(svg, {
            headers: { "content-type": "image/svg+xml" },
          }),
      ),
    ),
  ).rejects.toThrow("not a successful rendered SVG")
})
test("rejects invalid SVG bodies even with success headers", async () => {
  await expect(
    checkSvgImage(serve(() => new Response("broken", { headers }))),
  ).rejects.toThrow("not a successful rendered SVG")
})
test("still times out a stalled render", async () => {
  const url = serve(async () => {
    await Bun.sleep(100)
    return new Response(svg, { headers })
  })
  await expect(checkSvgImage(url, 10)).rejects.toThrow()
})
