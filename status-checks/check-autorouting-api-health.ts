import type { HealthCheckFunction } from "./types"
import ky from "ky"
import exampleUnroutedCircuit from "../assets/example-unrouted-circuit.json"

export const checkFreeroutingClusterHealth: HealthCheckFunction = async () => {
  try {
    const solveRes = await ky
      .post("https://registry-api.tscircuit.com/autorouting/solve", {
        json: {
          input_circuit_json: exampleUnroutedCircuit,
        },
      })
      .json()
    console.log(solveRes)

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
