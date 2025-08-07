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
| `svg_service` | ✅ Operational |
| `png_service` | ✅ Operational |
| `browser_preview` | ✅ Operational |
| `tscircuit_package` | ❌ tscircuit package health check failed: Command failed: echo -e 'yes\n\n' | tsci init
67493 | 
67494 | // node_modules/ky/distribution/errors/TimeoutError.js
67495 | class TimeoutError extends Error {
67496 |   request;
67497 |   constructor(request) {
67498 |     super(`Request timed out: ${request.method} ${request.url}`);
            ^
TimeoutError: Request timed out: GET https://registry.npmjs.org/@tscircuit/cli/latest
 request: Request (0 KB) {
  method: "GET",
  url: "https://registry.npmjs.org/@tscircuit/cli/latest",
  headers: Headers {
    "accept": "application/json",
  }
},

      at new TimeoutError (/usr/local/lib/node_modules/tscircuit/node_modules/@tscircuit/cli/dist/main.js:67498:5)
      at <anonymous> (/usr/local/lib/node_modules/tscircuit/node_modules/@tscircuit/cli/dist/main.js:67799:14)

Bun v1.2.19 (Linux x64 baseline)
 |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
