import type { HealthCheckFunction } from "./types"
import ky from "ky"

export const checkPngServiceHealth: HealthCheckFunction = async () => {
  try {
    const randomParam = Math.random().toString(36).substring(7)
    const url = `https://png.tscircuit.com/?view=3d&code=H4sIAJsBqGcAA42QsQ6CMBRFdxP%2F4aUTDEJBNikLiR%2FA5FpKkUahTanRxPjvVksb4uTWc3JfTlL%2BUFIb6HhPb1cDUQykgmi7AShbSXUHd9GZgaAMjyOCgYvzYBaqPiu703wWs5HaIYBjOjFOUH5BXvdSGqXFZM9xgfPgJzraYZMFMbPhRJ7Fy7NireX9wqnPMqooE6vuIly4wBir45%2Fx%2Bje%2B8zVfDyLkjaaMQ6%2FlSFDSZFBBosSUITDSinol3EmZfv%2FTvuPDG02y%2Bwx1AQAA&cachebust=${randomParam}`
    
    await ky.get(url, {
      timeout: 5000,
    })
    
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: "PNG Service Health Check Failed",
      },
    }
  }
}