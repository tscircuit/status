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
npm warn ERESOLVE overriding peer dependency
npm error code 1
npm error path /usr/local/lib/node_modules/tscircuit/node_modules/sharp
npm error command failed
npm error command sh -c (node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)
npm error sharp: Using cached /home/runner/.npm/_libvips/libvips-8.14.5-linux-x64.tar.br
npm error sharp: Integrity check passed for linux-x64
npm error
npm error make: Entering directory '/usr/local/lib/node_modules/tscircuit/node_modules/sharp/build'
npm error   CC(target) Release/obj.target/nothing/../node-addon-api/nothing.o
npm error rm -f Release/obj.target/../node-addon-api/nothing.a Release/obj.target/../node-addon-api/nothing.a.ar-file-list; mkdir -p `dirname Release/obj.target/../node-addon-api/nothing.a`
npm error ar crs Release/obj.target/../node-addon-api/nothing.a @Release/obj.target/../node-addon-api/nothing.a.ar-file-list
npm error   COPY Release/nothing.a
npm error   TOUCH Release/obj.target/libvips-cpp.stamp
npm error   CXX(target) Release/obj.target/sharp-linux-x64/src/common.o
npm error make: Leaving directory '/usr/local/lib/node_modules/tscircuit/node_modules/sharp/build'
npm error prebuild-install warn install No prebuilt binaries found (target=7 runtime=napi arch=x64 libc= platform=linux)
npm error gyp info it worked if it ends with ok
npm error gyp info using node-gyp@10.1.0
npm error gyp info using node@20.19.6 | linux | x64
npm error gyp info find Python using Python version 3.12.3 found at "/usr/bin/python3"
npm error gyp info spawn /usr/bin/python3
npm error gyp info spawn args [
npm error gyp info spawn args '/usr/local/lib/node_modules/npm/node_modules/node-gyp/gyp/gyp_main.py',
npm error gyp info spawn args 'binding.gyp',
npm error gyp info spawn args '-f',
npm error gyp info spawn args 'make',
npm error gyp info spawn args '-I',
npm error gyp info spawn args '/usr/local/lib/node_modules/tscircuit/node_modules/sharp/build/config.gypi',
npm error gyp info spawn args '-I',
npm error gyp info spawn args '/usr/local/lib/node_modules/npm/node_modules/node-gyp/addon.gypi',
npm error gyp info spawn args '-I',
npm error gyp info spawn args '/home/runner/.cache/node-gyp/20.19.6/include/node/common.gypi',
npm error gyp info spawn args '-Dlibrary=shared_library',
npm error gyp info spawn args '-Dvisibility=default',
npm error gyp info spawn args '-Dnode_root_dir=/home/runner/.cache/node-gyp/20.19.6',
npm error gyp info spawn args '-Dnode_gyp_dir=/usr/local/lib/node_modules/npm/node_modules/node-gyp',
npm error gyp info spawn args '-Dnode_lib_file=/home/runner/.cache/node-gyp/20.19.6/<(target_arch)/node.lib',
npm error gyp info spawn args '-Dmodule_root_dir=/usr/local/lib/node_modules/tscircuit/node_modules/sharp',
npm error gyp info spawn args '-Dnode_engine=v8',
npm error gyp info spawn args '--depth=.',
npm error gyp info spawn args '--no-parallel',
npm error gyp info spawn args '--generator-output',
npm error gyp info spawn args 'build',
npm error gyp info spawn args '-Goutput_dir=.'
npm error gyp info spawn args ]
npm error <string>:108: SyntaxWarning: invalid escape sequence '\/'
npm error gyp info spawn make
npm error gyp info spawn args [ 'BUILDTYPE=Release', '-C', 'build' ]
npm error ../src/common.cc:13:10: fatal error: vips/vips8: No such file or directory
npm error    13 | #include <vips/vips8>
npm error       |          ^~~~~~~~~~~~
npm error compilation terminated.
npm error make: *** [sharp-linux-x64.target.mk:138: Release/obj.target/sharp-linux-x64/src/common.o] Error 1
npm error gyp ERR! build error 
npm error gyp ERR! stack Error: `make` failed with exit code: 2
npm error gyp ERR! stack at ChildProcess.<anonymous> (/usr/local/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:209:23)
npm error gyp ERR! System Linux 6.11.0-1018-azure
npm error gyp ERR! command "/usr/local/bin/node" "/usr/local/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
npm error gyp ERR! cwd /usr/local/lib/node_modules/tscircuit/node_modules/sharp
npm error gyp ERR! node -v v20.19.6
npm error gyp ERR! node-gyp -v v10.1.0
npm error gyp ERR! not ok
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2025-12-13T21_53_04_510Z-debug-0.log
 |
| `usercode_api` | ✅ Operational |

<!-- END_STATUS_TABLE -->

Status checks for tscircuit internal services.

Runs every 10 minutes using github workflows.

Every time it runs it appends the status check results to `statuses.jsonl` (limiting to
2 weeks of logs)

Each service has a specific method to check it, see [./service-checks](./service-checks)

You may need particular auth environment variables to run the checks.
