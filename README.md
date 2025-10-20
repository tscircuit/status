# tscircuit status

<!-- START_STATUS_TABLE -->

| Service               | Current Status |
| --------------------- | -------------- |
| `registry-api` | ✅ Operational |
| `autorouting-api` | ❌ HTTPError: Request failed with status code 502 Bad Gateway: POST https://registry-api.tscircuit.com/autorouting/jobs/create |
| `freerouting-cluster` | ✅ Operational |
| `jlcsearch-api` | ✅ Operational |
| `registry_bundling` | ❌ registry_bundling Health Check Failed |
| `fly_registry_api` | ✅ Operational |
| `compile_api` | ❌ Compile API Health Ping Failed |
| `svg_service` | ❌ SVG Service Health Check Failed |
| `png_service` | ✅ Operational |
| `browser_preview` | ❌ Browser Preview Health Check Failed |
| `tscircuit_package` | ❌ tscircuit package health check failed: Command failed: echo -e 'yes\n\n' | tsci init
71877 |   return new Promise((resolve, reject) => {
71878 |     const timeoutId = setTimeout(() => {
71879 |       if (abortController) {
71880 |         abortController.abort();
71881 |       }
71882 |       reject(new TimeoutError(request));
                     ^
TimeoutError: Request timed out: GET https://registry.npmjs.org/@tscircuit/cli/latest
 request: Request (0 KB) {
  method: "GET",
  url: "https://registry.npmjs.org/@tscircuit/cli/latest",
  headers: Headers {
    "accept": "application/json",
  }
},

      at <anonymous> (/usr/local/lib/node_modules/tscircuit/node_modules/@tscircuit/cli/dist/main.js:71882:14)

Bun v1.3.0 (Linux x64 baseline)
 |
| `usercode_api` | ❌ Usercode job failed: Unknown error |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
