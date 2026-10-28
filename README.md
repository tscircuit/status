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
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: react-reconciler@0.34.0
npm warn Found: react@19.1.0
npm warn node_modules/tscircuit/node_modules/react
npm warn   react@"^19.1.0" from tscircuit@0.0.3035
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
npm warn   @tscircuit/alphabet@"0.0.25" from tscircuit@0.0.3035
npm warn   node_modules/tscircuit
npm warn     tscircuit@"*" from the root project
npm warn     2 more (@tscircuit/cli, @tscircuit/krt-wasm)
npm warn   5 more (graphics-debug, circuit-json-to-gltf, circuit-to-svg, ...)
npm warn
npm warn Could not resolve dependency:
npm warn peer @tscircuit/alphabet@"^0.0.24" from jscad-electronics@0.0.210
npm warn node_modules/tscircuit/node_modules/circuit-json-to-gltf/node_modules/jscad-electronics
npm warn   jscad-electronics@"^0.0.210" from circuit-json-to-gltf@0.0.151
npm warn   node_modules/tscircuit/node_modules/circuit-json-to-gltf
npm warn
npm warn Conflicting peer dependency: @tscircuit/alphabet@0.0.24
npm warn node_modules/@tscircuit/alphabet
npm warn   peer @tscircuit/alphabet@"^0.0.24" from jscad-electronics@0.0.210
npm warn   node_modules/tscircuit/node_modules/circuit-json-to-gltf/node_modules/jscad-electronics
npm warn     jscad-electronics@"^0.0.210" from circuit-json-to-gltf@0.0.151
npm warn     node_modules/tscircuit/node_modules/circuit-json-to-gltf
npm warn deprecated prebuild-install@7.1.3: No longer maintained. Please contact the author of the relevant native addon; alternatives are available.
npm error code 1
npm error path /usr/local/lib/node_modules/tscircuit/node_modules/sharp
npm error command failed
npm error command sh -c (node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)
npm error node:internal/modules/cjs/loader:1433
npm error   throw err;
npm error   ^
npm error
npm error Error: Cannot find module '/usr/local/lib/node_modules/tscircuit/node_modules/sharp/install/libvips'
npm error     at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
npm error     at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
npm error     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
npm error     at Function._load (node:internal/modules/cjs/loader:1216:25)
npm error     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
npm error     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
npm error     at node:internal/main/run_main_module:36:49 {
npm error   code: 'MODULE_NOT_FOUND',
npm error   requireStack: []
npm error }
npm error
npm error Node.js v22.23.3
npm error node:internal/modules/cjs/loader:1433
npm error   throw err;
npm error   ^
npm error
npm error Error: Cannot find module '/usr/local/lib/node_modules/tscircuit/node_modules/sharp/install/can-compile'
npm error     at Function._resolveFilename (node:internal/modules/cjs/loader:1430:15)
npm error     at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
npm error     at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1045:22)
npm error     at Function._load (node:internal/modules/cjs/loader:1216:25)
npm error     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
npm error     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
npm error     at node:internal/main/run_main_module:36:49 {
npm error   code: 'MODULE_NOT_FOUND',
npm error   requireStack: []
npm error }
npm error
npm error Node.js v22.23.3
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-10-28T15_55_01_488Z-debug-0.log
 |
| `usercode_api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
