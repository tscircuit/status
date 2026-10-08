# tscircuit status

<!-- START_STATUS_TABLE -->

| Service               | Current Status |
| --------------------- | -------------- |
| `registry-api` | ✅ Operational |
| `autorouting-api` | ✅ Operational |
| `freerouting-cluster` | ✅ Operational |
| `jlcsearch-api` | ✅ Operational |
| `registry_bundling` | ✅ Operational |
| `fly_registry_api` | ✅ Operational |
| `compile_api` | ✅ Operational |
| `svg_service` | ❌ SVG Service Health Check Failed: schematic render failed after 15000ms: Request timed out: GET https://svg.tscircuit.com/?svg_type=schematic&code=H4sIAJsBqGcAA42QsQ6CMBRFdxP%2F4aUTDEJBNikLiR%2FA5FpKkUahTanRxPjvVksb4uTWc3JfTlL%2BUFIb6HhPb1cDUQykgmi7AShbSXUHd9GZgaAMjyOCgYvzYBaqPiu703wWs5HaIYBjOjFOUH5BXvdSGqXFZM9xgfPgJzraYZMFMbPhRJ7Fy7NireX9wqnPMqooE6vuIly4wBir45%2Fx%2Bje%2B8zVfDyLkjaaMQ6%2FlSFDSZFBBosSUITDSinol3EmZfv%2FTvuPDG02y%2Bwx1AQAA&cachebust=ags1z5 |
| `browser_preview` | ✅ Operational |
| `tscircuit_package` | ✅ Operational |
| `usercode_api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
