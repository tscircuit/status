import type { HealthCheckFunction } from "./types"
import ky from "ky"

export const checkJLCSearchHealth: HealthCheckFunction = async () => {
  try {
    const randomParam = Math.random().toString(36).substring(7)
    const url = `https://jlcsearch.tscircuit.com/resistors/list?package=&resistance=1k&json=1&cachebust=${randomParam}`

    const response = await ky
      .get(url, {
        timeout: 10_000,
      })
      .json()

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "JLC Search API Health Check Failed",
      },
    }
  }
}
