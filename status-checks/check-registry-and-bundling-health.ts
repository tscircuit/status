import type { HealthCheckFunction } from "./types"
import ky from "ky"

const EXAMPLE_PACKAGE = "seveibar/usb-c-flashlight"
const ENDPOINTS = [
  `https://esm.tscircuit.com/${EXAMPLE_PACKAGE}`,
  `https://cjs.tscircuit.com/${EXAMPLE_PACKAGE}`,
  `https://npm.tscircuit.com/${encodeURIComponent(EXAMPLE_PACKAGE)}`,
]

export const checkRegistryAndBundlingHealth: HealthCheckFunction = async () => {
  try {
    const randomParam = Math.random().toString(36).substring(7)

    await Promise.all(
      ENDPOINTS.map((url) =>
        ky.get(`${url}?cachebust=${randomParam}`, {
          timeout: 5000,
        }),
      ),
    )

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "registry_bundling Health Check Failed",
      },
    }
  }
}
