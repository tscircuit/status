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
npm warn While resolving: react-reconciler@0.34.0
npm warn Found: react@19.1.0
npm warn node_modules/tscircuit/node_modules/react
npm warn   react@"^19.1.0" from tscircuit@0.0.3042
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   12 more (@tscircuit/props, jscad-fiber, react-dom, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer react@"^19.3.0" from react-reconciler@0.34.0
npm warn node_modules/tscircuit/node_modules/react-reconciler
npm warn   peer react-reconciler@"*" from jscad-fiber@0.0.92
npm warn   node_modules/tscircuit/node_modules/jscad-fiber
npm warn   1 more (jscad-fiber)
npm warn
npm warn Conflicting peer dependency: react@19.3.1
npm warn node_modules/react
npm warn   peer react@"^19.3.0" from react-reconciler@0.34.0
npm warn   node_modules/tscircuit/node_modules/react-reconciler
npm warn     peer react-reconciler@"*" from jscad-fiber@0.0.92
npm warn     node_modules/tscircuit/node_modules/jscad-fiber
npm warn     1 more (jscad-fiber)
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: jscad-electronics@0.0.210
npm warn Found: @tscircuit/alphabet@0.0.25
npm warn node_modules/tscircuit/node_modules/@tscircuit/alphabet
npm warn   @tscircuit/alphabet@"0.0.25" from tscircuit@0.0.3042
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   5 more (graphics-debug, circuit-json-to-gltf, circuit-to-svg, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer @tscircuit/alphabet@"^0.0.24" from jscad-electronics@0.0.210
npm warn node_modules/tscircuit/node_modules/circuit-json-to-gltf/node_modules/jscad-electronics
npm warn   jscad-electronics@"^0.0.210" from circuit-json-to-gltf@0.0.160
npm warn   node_modules/tscircuit/node_modules/circuit-json-to-gltf
npm warn
npm warn Conflicting peer dependency: @tscircuit/alphabet@0.0.24
npm warn node_modules/@tscircuit/alphabet
npm warn   peer @tscircuit/alphabet@"^0.0.24" from jscad-electronics@0.0.210
npm warn   node_modules/tscircuit/node_modules/circuit-json-to-gltf/node_modules/jscad-electronics
npm warn     jscad-electronics@"^0.0.210" from circuit-json-to-gltf@0.0.160
npm warn     node_modules/tscircuit/node_modules/circuit-json-to-gltf
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: jscad-electronics@0.0.210
npm warn Found: circuit-json@0.0.539
npm warn node_modules/tscircuit/node_modules/circuit-json
npm warn   circuit-json@"^0.0.539" from tscircuit@0.0.3042
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   15 more (@tscircuit/checks, @tscircuit/circuit-json-util, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer circuit-json@"^0.0.426" from jscad-electronics@0.0.210
npm warn node_modules/tscircuit/node_modules/circuit-json-to-gltf/node_modules/jscad-electronics
npm warn   jscad-electronics@"^0.0.210" from circuit-json-to-gltf@0.0.160
npm warn   node_modules/tscircuit/node_modules/circuit-json-to-gltf
npm warn
npm warn Conflicting peer dependency: circuit-json@0.0.426
npm warn node_modules/circuit-json
npm warn   peer circuit-json@"^0.0.426" from jscad-electronics@0.0.210
npm warn   node_modules/tscircuit/node_modules/circuit-json-to-gltf/node_modules/jscad-electronics
npm warn     jscad-electronics@"^0.0.210" from circuit-json-to-gltf@0.0.160
npm warn     node_modules/tscircuit/node_modules/circuit-json-to-gltf
npm warn deprecated prebuild-install@7.1.3: No longer maintained. Please contact the author of the relevant native addon; alternatives are available.
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/@tscircuit/cli/-/cli-0.1.2425.tgz - Not found
npm error 404
npm error 404  '@tscircuit/cli@https://registry.npmjs.org/@tscircuit/cli/-/cli-0.1.2425.tgz' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-10-30T19_43_23_967Z-debug-0.log
 |
| `usercode_api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
