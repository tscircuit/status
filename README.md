# tscircuit status

<!-- START_STATUS_TABLE -->

| Service               | Current Status |
| --------------------- | -------------- |
| `registry-api` | ❌ Registry API Health Ping Failed |
| `autorouting-api` | ❌ TimeoutError: Request timed out: POST https://registry-api.tscircuit.com/autorouting/solve |
| `freerouting-cluster` | ✅ Operational |
| `jlcsearch-api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
