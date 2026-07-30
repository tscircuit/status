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
| `browser_preview` | ✅ Operational |
| `tscircuit_package` | ❌ tscircuit package health check failed: Command failed: npm install -g tscircuit --force
npm warn using --force Recommended protections disabled.
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @tscircuit/cli@0.1.1777
npm warn Found: circuit-json@0.0.455
npm warn node_modules/tscircuit/node_modules/circuit-json
npm warn   circuit-json@"^0.0.455" from tscircuit@0.0.2180
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   11 more (@tscircuit/checks, @tscircuit/circuit-json-util, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer circuit-json@"^0.0.446" from @tscircuit/cli@0.1.1777
npm warn node_modules/tscircuit/node_modules/@tscircuit/cli
npm warn   @tscircuit/cli@"^0.1.1777" from tscircuit@0.0.2180
npm warn   node_modules/tscircuit
npm warn
npm warn Conflicting peer dependency: circuit-json@0.0.446
npm warn node_modules/circuit-json
npm warn   peer circuit-json@"^0.0.446" from @tscircuit/cli@0.1.1777
npm warn   node_modules/tscircuit/node_modules/@tscircuit/cli
npm warn     @tscircuit/cli@"^0.1.1777" from tscircuit@0.0.2180
npm warn     node_modules/tscircuit
npm warn ERESOLVE overriding peer dependency
 |
| `usercode_api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
