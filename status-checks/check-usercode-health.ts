import type { HealthCheckFunction } from "./types"

interface UserCodeJob {
  user_code_job_id: string
  status: "created" | "running" | "completed" | "failed"
  created_at: number
  started_at: number | null
  completed_at: number | null
  exit_code: number | null
  stdout: string | null
  stderr: string | null
  input_fs_map: Record<string, string>
  output_file_paths: string[]
  log_stream_url: string
  logs: UserCodeLogEntry[]
}

interface JobResponse {
  ok: boolean
  user_code_job: UserCodeJob
}

interface UserCodeLogEntry {
  timestamp?: string
  msg?: string
  action?: string
  level?: string
  [key: string]: unknown
}

const BASE_URL = "https://usercode.tscircuit.com"

const TEST_CODE = `export default () => (
  <board>
    <resistor name="R1" resistance="1k" footprint="0402" />
  </board>
)`

async function parseJsonResponse<T>(
  response: Response,
  context: string,
): Promise<T> {
  const text = await response.text()
  let parsed: unknown
  try {
    parsed = text ? JSON.parse(text) : {}
  } catch (error) {
    throw new Error(
      `Failed to parse JSON from ${context}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  if (!response.ok) {
    throw new Error(`${context} failed with status ${response.status}: ${text}`)
  }

  return parsed as T
}

async function postJson<T>(
  url: string,
  body: unknown,
  context: string,
): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  return parseJsonResponse<T>(response, context)
}

async function getJson<T>(url: string, context: string): Promise<T> {
  const response = await fetch(url)
  return parseJsonResponse<T>(response, context)
}

export const checkUsercodeHealth: HealthCheckFunction = async () => {
  try {
    // Create a new job
    const command = "bunx tscircuit build --preview-images"
    const createResult = await postJson<JobResponse>(
      `${BASE_URL}/user_code_jobs/create`,
      {
        container: "bun_tscircuit",
        script: command,
        autostart: false,
      },
      "create job",
    )

    if (!createResult.ok) {
      return {
        ok: false,
        error: {
          message: "Failed to create usercode job",
        },
      }
    }

    const jobId = createResult.user_code_job.user_code_job_id

    // Upload test file
    const result = await postJson<{ ok: boolean }>(
      `${BASE_URL}/user_code_jobs/add_file?user_code_job_id=${jobId}`,
      {
        filename: "index.tsx",
        text_content: TEST_CODE,
      },
      "add file index.tsx",
    )

    if (!result.ok) {
      return {
        ok: false,
        error: {
          message: "Failed to upload test file",
        },
      }
    }

    // Start the job
    const startResult = await postJson<JobResponse>(
      `${BASE_URL}/user_code_jobs/start?user_code_job_id=${jobId}`,
      {},
      "start job",
    )

    if (!startResult.ok) {
      return {
        ok: false,
        error: {
          message: "Failed to start usercode job",
        },
      }
    }

    // Poll for completion
    const TIMEOUT = 300_000 // 3 minutes timeout for health check
    const POLL_INTERVAL = 1_000 // 1 second
    const startTime = Date.now()

    while (Date.now() - startTime < TIMEOUT) {
      const getResult = await getJson<JobResponse>(
        `${BASE_URL}/user_code_jobs/get?user_code_job_id=${jobId}`,
        "get job",
      )

      if (!getResult.ok) {
        return {
          ok: false,
          error: {
            message: "Failed to get usercode job status",
          },
        }
      }

      const job = getResult.user_code_job

      if (job.status === "completed") {
        return { ok: true }
      }

      if (job.status === "failed") {
        return {
          ok: false,
          error: {
            message: `Usercode job failed: ${job.stderr || "Unknown error"}`,
          },
        }
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    return {
      ok: false,
      error: {
        message: "Usercode job timed out",
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
