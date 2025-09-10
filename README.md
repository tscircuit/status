# tscircuit status

<!-- START_STATUS_TABLE -->

| Service               | Current Status |
| --------------------- | -------------- |
| `registry-api` | ❌ Registry API Health Ping Failed |
| `autorouting-api` | ❌ Autorouting job failed: {"message":"TimeoutError: Request timed out: GET https://internal-freerouting.fly.dev/v1/jobs/cf26aeab-d643-46d5-8b43-9764d1fed3d9","error_code":"unknown_autorouting_error"} |
| `freerouting-cluster` | ✅ Operational |
| `jlcsearch-api` | ✅ Operational |
| `registry_bundling` | ✅ Operational |
| `fly_registry_api` | ✅ Operational |
| `compile_api` | ✅ Operational |
| `svg_service` | ✅ Operational |
| `png_service` | ✅ Operational |
| `browser_preview` | ✅ Operational |
| `tscircuit_package` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
