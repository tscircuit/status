import type { HealthCheckFunction } from "./types"
import ky from "ky"

export const checkFreeroutingClusterHealth: HealthCheckFunction = async () => {
  try {
    const healthRes = await ky
      .get("https://internal-freerouting.fly.dev/health", {
        timeout: 10000,
      })
      .json()
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "Freerouting Cluster API Health Ping Failed",
      },
    }
  }
}
