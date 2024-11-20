import type { HealthCheckFunction } from "./types"
import ky from "ky"
import exampleUnroutedCircuit from "../assets/example-unrouted-circuit.json"

export const checkAutoroutingApiHealth: HealthCheckFunction = async () => {
  try {
    const solveRes = await ky
      .post<{
        autorouting_result: {
          output_pcb_traces: any[]
        }
      }>("https://registry-api.tscircuit.com/autorouting/solve", {
        json: {
          input_circuit_json: exampleUnroutedCircuit,
        },
      })
      .json()

    if (solveRes?.autorouting_result?.output_pcb_traces?.length === 0) {
      return {
        ok: false,
        error: {
          message: "Autorouting API returned no traces",
        },
      }
    }

    return { ok: true }
  } catch (err: any) {
    return {
      ok: false,
      error: {
        message: err.toString(),
      },
    }
  }
}
