import type { HealthCheckFunction } from "./types"
import ky from "ky"

export const checkRegistryHealth: HealthCheckFunction = async () => {
  try {
    const healthRes = await ky
      .get("https://registry-api.tscircuit.com/health", {
        timeout: 5000,
      })
      .json()
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "Registry API Health Ping Failed",
      },
    }
  }
}
