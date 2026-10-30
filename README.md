# tscircuit status

<!-- START_STATUS_TABLE -->

| Service               | Current Status |
| --------------------- | -------------- |
| `registry-api` | ✅ Operational |
| `freerouting-cluster` | ✅ Operational |
| `jlcsearch-api` | ✅ Operational |
| `registry_bundling` | ✅ Operational |
| `fly_registry_api` | ✅ Operational |
| `compile_api` | ✅ Operational |
| `svg_service` | ✅ Operational |
| `browser_preview` | ✅ Operational |
| `tscircuit_package` | ❌ tscircuit package health check failed: Command failed: tscircuit init -y
121 | 
122 | 		if (error instanceof Error && error.code === 'ERR_DLOPEN_FAILED') {
123 | 			throw error;
124 | 		}
125 | 
126 | 		throw new Error(
                  ^
error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
      at requireWithFriendlyError (/usr/local/lib/node_modules/tscircuit/node_modules/rollup/dist/native.js:126:13)
      at <anonymous> (/usr/local/lib/node_modules/tscircuit/node_modules/rollup/dist/native.js:135:22)

::error file=../../../../../usr/local/lib/node_modules/tscircuit/node_modules/rollup/dist/native.js,line=126,col=13,title=error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https%3A//github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.::%0A      at requireWithFriendlyError (/usr/local/lib/node_modules/tscircuit/node_modules/rollup/dist/native.js:126:13)%0A      at <anonymous> (/usr/local/lib/node_modules/tscircuit/node_modules/rollup/dist/native.js:135:22)

Bun v1.4.4 (Linux x64)
 |
| `usercode_api` | ❌ Error: Failed to parse JSON from add file seveibar-rp2040-zero-0.0.18-pr5-74798a90-files/lib/XiaoBoardBreakout.tsx: JSON Parse error: Unrecognized token '<' |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
