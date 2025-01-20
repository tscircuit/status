import type { HealthCheckFunction } from "./types"
import ky from "ky"
import exampleUnroutedCircuit from "../assets/example-unrouted-circuit.json"

export const checkAutoroutingApiHealth: HealthCheckFunction = async () => {
  try {
    // Create autorouting job
    const createJobRes = await ky
      .post("https://registry-api.tscircuit.com/autorouting/jobs/create", {
        json: {
          input_circuit_json: exampleUnroutedCircuit,
          provider: "freerouting",
          autostart: true,
          display_name: "health_check",
        },
      })
      .json<{ autorouting_job: { autorouting_job_id: string } }>()

    const jobId = createJobRes.autorouting_job.autorouting_job_id

    // Poll for completion (with timeout)
    const startTime = Date.now()
    const TIMEOUT = 30000 // 30 seconds timeout

    while (Date.now() - startTime < TIMEOUT) {
      const { autorouting_job: job } = await ky
        .post("https://registry-api.tscircuit.com/autorouting/jobs/get", {
          json: {
            autorouting_job_id: jobId,
          },
        })
        .json<{ autorouting_job: { is_finished: boolean; has_error: boolean; error?: any } }>()

      if (job.has_error) {
        return {
          ok: false,
          error: {
            message: `Autorouting job failed: ${JSON.stringify(job.error)}`,
          },
        }
      }

      if (job.is_finished) {
        const outputRes = await ky
          .post("https://registry-api.tscircuit.com/autorouting/jobs/get_output", {
            json: {
              autorouting_job_id: jobId,
            },
          })
          .json<{ autorouting_job_output: { output_pcb_traces: any[] } }>()

        if (outputRes.autorouting_job_output.output_pcb_traces.length === 0) {
          return {
            ok: false,
            error: {
              message: "Autorouting API returned no traces",
            },
          }
        }

        return { ok: true }
      }

      // Wait 100ms before next poll
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return {
      ok: false,
      error: {
        message: "Autorouting job timed out",
      },
    }
  } catch (err: any) {
    return {
      ok: false,
      error: {
        message: err.toString(),
      },
    }
  }
}
