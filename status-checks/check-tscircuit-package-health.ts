import type { HealthCheckFunction } from "./types"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import { mkdtemp, writeFile, rm } from "node:fs/promises"
import { join } from "node:path"
import { tmpdir } from "node:os"

const execAsync = promisify(exec)

const installTscircuit = async () => {
  console.log("Installing tscircuit globally...")
  await execAsync("npm install -g tscircuit --force", {
    timeout: 60000, // 60 second timeout for installation
  })
}

const initializeProject = async (tempDir: string) => {
  console.log("Initializing project...")
  await execAsync("echo -e 'yes\\n\\n' | tsci init", {
    cwd: tempDir,
    timeout: 30000, // 30 second timeout
    shell: "/bin/bash", // Need shell to handle piping
  })
}

const createCircuitFile = async (tempDir: string) => {
  console.log("Creating circuit file...")
  const basicCircuit = `
export default () => (
  <board width="10mm" height="10mm">
    <resistor
      resistance="1k"
      footprint="0402"
      name="R1"
      schX={3}
      pcbX={3}
    />
    <capacitor
      capacitance="1000pF"
      footprint="0402"
      name="C1"
      schX={-3}
      pcbX={-3}
    />
    <trace from=".R1 > .pin1" to=".C1 > .pin1" />
  </board>
)
`
  await writeFile(join(tempDir, "index.tsx"), basicCircuit)
}

const buildCircuit = async (tempDir: string) => {
  console.log("Building circuit...")
  await execAsync("tsci build ./index.tsx", {
    cwd: tempDir,
    timeout: 30000, // 30 second timeout
  })
}

const cleanupTempDir = async (tempDir: string | null) => {
  if (!tempDir) return

  console.log("Cleaning up temporary directory...")
  try {
    await rm(tempDir, { recursive: true, force: true })
  } catch (cleanupErr) {
    console.error("Failed to cleanup temp directory:", cleanupErr)
  }
}

export const checkTscircuitPackageHealth: HealthCheckFunction = async () => {
  console.log("Checking tscircuit package health...")
  let tempDir: string | null = null

  try {
    console.log("Creating temporary directory...")
    tempDir = await mkdtemp(join(tmpdir(), "tscircuit-health-check-"))

    await installTscircuit()
    await initializeProject(tempDir)
    await createCircuitFile(tempDir)
    await buildCircuit(tempDir)

    console.log("Circuit built successfully")
    return { ok: true }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred"
    console.error(`tscircuit package health check failed: ${errorMessage}`)
    return {
      ok: false,
      error: {
        message: `tscircuit package health check failed: ${errorMessage}`,
        error_code: "tscircuit_package_health_check_failed",
      },
    }
  } finally {
    await cleanupTempDir(tempDir)
  }
}
