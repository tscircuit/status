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
npm warn deprecated prebuild-install@7.1.3: No longer maintained. Please contact the author of the relevant native addon; alternatives are available.
npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm error code E403
npm error 403 403 Forbidden - GET https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz
npm error 403 In most cases, you or one of your dependencies are requesting
npm error 403 a package version that is forbidden by your security policy, or
npm error 403 on a server you do not have access to.
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-02-25T18_34_51_972Z-debug-0.log
 |
| `usercode_api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
