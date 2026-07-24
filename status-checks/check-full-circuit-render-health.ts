import ky from "ky"
import exampleUnroutedCircuit from "../assets/example-unrouted-circuit.json"
import type { HealthCheckFunction } from "./types"

/**
 * "Full Circuit Test Check" (issue #13): render a full circuit end-to-end,
 * exercising autorouting AND svg rendering of the routed result — closer to
 * what a user experiences than the individual service pings.
 */
export const checkFullCircuitRenderHealth: HealthCheckFunction = async () => {
  try {
    // 1. Route the example circuit through the autorouting API
    const createJobRes = await ky
      .post("https://registry-api.tscircuit.com/autorouting/jobs/create", {
        json: {
          input_circuit_json: exampleUnroutedCircuit,
          provider: "freerouting",
          autostart: true,
          display_name: "full_circuit_render_health_check",
        },
      })
      .json<{ autorouting_job: { autorouting_job_id: string } }>()

    const jobId = createJobRes.autorouting_job.autorouting_job_id

    const startTime = Date.now()
    const TIMEOUT = 45000

    let routedCircuitJson: unknown[] | null = null
    while (Date.now() - startTime < TIMEOUT) {
      const { autorouting_job: job } = await ky
        .post("https://registry-api.tscircuit.com/autorouting/jobs/get", {
          json: { autorouting_job_id: jobId },
        })
        .json<{
          autorouting_job: {
            is_finished: boolean
            has_error: boolean
            error?: unknown
          }
        }>()

      if (job.has_error) {
        return {
          ok: false,
          error: {
            message: `Full circuit render: autorouting failed: ${JSON.stringify(job.error)}`,
          },
        }
      }

      if (job.is_finished) {
        const outputRes = await ky
          .post(
            "https://registry-api.tscircuit.com/autorouting/jobs/get_output",
            {
              json: { autorouting_job_id: jobId },
            },
          )
          .json<{ autorouting_job_output: { output_pcb_traces: unknown[] } }>()
        const traces = outputRes.autorouting_job_output.output_pcb_traces
        if (!Array.isArray(traces) || traces.length === 0) {
          return {
            ok: false,
            error: {
              message: "Full circuit render: autorouting returned no traces",
            },
          }
        }
        routedCircuitJson = [
          ...(exampleUnroutedCircuit as unknown[]),
          ...traces,
        ]
        break
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    if (!routedCircuitJson) {
      return {
        ok: false,
        error: { message: "Full circuit render: autorouting timed out" },
      }
    }

    // 2. Render the routed circuit through the svg service
    const svg = await ky
      .post("https://svg.tscircuit.com/", {
        searchParams: { svg_type: "pcb" },
        json: { circuit_json: routedCircuitJson },
        timeout: 15000,
      })
      .text()

    if (!svg.includes("<svg")) {
      return {
        ok: false,
        error: {
          message: "Full circuit render: svg service returned no <svg output",
        },
      }
    }

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: {
        message: `Full circuit render health check failed: ${err instanceof Error ? err.message : String(err)}`,
      },
    }
  }
}
