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
| `tscircuit_package` | ❌ tscircuit package health check failed: Command failed: npm install -g tscircuit --force
npm warn using --force Recommended protections disabled.
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @tscircuit/cli@0.1.2397
npm warn Found: circuit-json@0.0.529
npm warn node_modules/tscircuit/node_modules/circuit-json
npm warn   circuit-json@"^0.0.529" from tscircuit@0.0.2998
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   13 more (@tscircuit/checks, @tscircuit/circuit-json-util, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer circuit-json@"^0.0.525" from @tscircuit/cli@0.1.2397
npm warn node_modules/tscircuit/node_modules/@tscircuit/cli
npm warn   @tscircuit/cli@"^0.1.2396" from tscircuit@0.0.2998
npm warn   node_modules/tscircuit
npm warn
npm warn Conflicting peer dependency: circuit-json@0.0.525
npm warn node_modules/circuit-json
npm warn   peer circuit-json@"^0.0.525" from @tscircuit/cli@0.1.2397
npm warn   node_modules/tscircuit/node_modules/@tscircuit/cli
npm warn     @tscircuit/cli@"^0.1.2396" from tscircuit@0.0.2998
npm warn     node_modules/tscircuit
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @tscircuit/cli@0.1.2397
npm warn Found: circuit-to-svg@0.0.453
npm warn node_modules/tscircuit/node_modules/circuit-to-svg
npm warn   circuit-to-svg@"^0.0.453" from tscircuit@0.0.2998
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   1 more (circuit-json-to-gltf)
npm warn
npm warn Could not resolve dependency:
npm warn peer circuit-to-svg@"^0.0.447" from @tscircuit/cli@0.1.2397
npm warn node_modules/tscircuit/node_modules/@tscircuit/cli
npm warn   @tscircuit/cli@"^0.1.2396" from tscircuit@0.0.2998
npm warn   node_modules/tscircuit
npm warn
npm warn Conflicting peer dependency: circuit-to-svg@0.0.447
npm warn node_modules/circuit-to-svg
npm warn   peer circuit-to-svg@"^0.0.447" from @tscircuit/cli@0.1.2397
npm warn   node_modules/tscircuit/node_modules/@tscircuit/cli
npm warn     @tscircuit/cli@"^0.1.2396" from tscircuit@0.0.2998
npm warn     node_modules/tscircuit
npm warn ERESOLVE overriding peer dependency
 |
| `usercode_api` | ❌ Usercode job failed: Unknown error |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
