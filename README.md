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
| `tscircuit_package` | ❌ tscircuit package health check failed: Command failed: npm install -g tscircuit --force
npm warn using --force Recommended protections disabled.
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/core/api.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/ar.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/@remix-run/router/dist/utils.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/polished/docs/assets/fonts/OTF/SourceCodePro-Regular.otf'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/az.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/be.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/ca.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/classic/checks.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/core/checks.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/mini/checks.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/classic/coerce.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/mini/coerce.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/classic/compat.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/core/core.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/cs.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/de.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/core/doc.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v3/locales/en.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/en.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v3/helpers/enumUtil.d.ts'
npm warn tar TAR_ENTRY_ERROR ENOENT: no such file or directory, open '/usr/local/lib/node_modules/tscircuit/node_modules/zod/v4/locales/eo.d.ts'
 |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
