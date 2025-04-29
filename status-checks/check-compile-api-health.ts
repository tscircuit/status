import type { HealthCheckFunction } from "./types"
import ky from "ky"

export const checkCompileApiHealth: HealthCheckFunction = async () => {
  try {
    const healthRes = await ky
      .get("https://compile.tscircuit.com/api/health", {
        timeout: 5000,
      })
      .json()
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "Compile API Health Ping Failed",
      },
    }
  }
}
