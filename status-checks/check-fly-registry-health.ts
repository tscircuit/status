import type { HealthCheckFunction } from "./types"
import ky from "ky"

export const checkFlyRegistryHealth: HealthCheckFunction = async () => {
  try {
    const healthRes = await ky
      .get("https://fly-registry-api.fly.dev/health", {
        timeout: 5000,
      })
      .json()
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "Fly Registry API Health Ping Failed",
      },
    }
  }
}
