import type { HealthCheckFunction } from "./types"
import { readFile, readdir, mkdtemp, rm } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { tmpdir } from "node:os"
import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

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
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ZIP_FILE = join(
  __dirname,
  "../assets/seveibar-rp2040-zero-0.0.18-pr5-74798a90-files.zip",
)

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

async function* getAllFiles(
  dir: string,
  baseDir = dir,
): AsyncGenerator<{ relativePath: string; fullPath: string }> {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      // Skip dist and other build directories
      if (entry.name === "dist" || entry.name === "node_modules") {
        continue
      }
      yield* getAllFiles(fullPath, baseDir)
    } else if (entry.isFile()) {
      const relativePath = fullPath.slice(baseDir.length + 1)
      // Skip hidden files and non-code files
      if (
        !entry.name.startsWith(".") &&
        !entry.name.endsWith(".lock") &&
        (entry.name.endsWith(".tsx") ||
          entry.name.endsWith(".ts") ||
          entry.name.endsWith(".json"))
      ) {
        yield { relativePath, fullPath }
      }
    }
  }
}

export const checkUsercodeHealth: HealthCheckFunction = async () => {
  let tempDir: string | null = null

  try {
    // Create temporary directory for extraction
    tempDir = await mkdtemp(join(tmpdir(), "usercode-health-check-"))

    // Extract zip file to temp directory
    await execAsync(`unzip -q "${ZIP_FILE}" -d "${tempDir}"`)

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

    // Collect all files from extracted directory
    const filesToUpload: Array<{ path: string; content: string }> = []

    for await (const { relativePath, fullPath } of getAllFiles(tempDir)) {
      const content = await readFile(fullPath, "utf8")
      filesToUpload.push({ path: relativePath, content })
    }

    // Upload all files
    for (const { path, content } of filesToUpload) {
      const result = await postJson<{ ok: boolean }>(
        `${BASE_URL}/user_code_jobs/add_file?user_code_job_id=${jobId}`,
        {
          filename: path,
          text_content: content,
        },
        `add file ${path}`,
      )

      if (!result.ok) {
        return {
          ok: false,
          error: {
            message: `Failed to upload file ${path}`,
          },
        }
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
    const TIMEOUT = 120_000 // 2 minutes timeout for health check
    const POLL_INTERVAL = 1_000 // 1 second
    const startTime = Date.now()

    while (Date.now() - startTime < TIMEOUT) {
      const getResult = await getJson<JobResponse>(
        `${BASE_URL}/user_code_jobs/get?user_code_job_id=${jobId}`,
        "get job",
      )

      console.log("getResult", getResult)
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
  } finally {
    // Clean up temporary directory
    if (tempDir) {
      try {
        await rm(tempDir, { recursive: true, force: true })
      } catch (cleanupErr) {
        console.error("Failed to cleanup temp directory:", cleanupErr)
      }
    }
  }
}
