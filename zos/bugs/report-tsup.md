
error :
```
mdupont@mdupont-G470:~/cloud-deployment-eliza$ mdupont@mdupont-G470:~/cloud-deployment-eliza$ pnpm build

> eliza@ build /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza
> turbo run build --filter=!eliza-docs

╭──────────────────────────────────────────────────────────────────────────╮
│                                                                          │
│                     Update available v2.3.3 ≫ v2.4.2                     │
│    Changelog: https://github.com/vercel/turborepo/releases/tag/v2.4.2    │
│             Run "npx @turbo/codemod@latest update" to update             │
│                                                                          │
│          Follow @turborepo for updates: https://x.com/turborepo          │
╰──────────────────────────────────────────────────────────────────────────╯
turbo 2.3.3

• Packages in scope: @elizaos-plugins/adapter-sqlite, @elizaos/agent, @elizaos/client-direct, @elizaos/core, @elizaos/plugin-bootstrap, cli, client, dynamic-imports
• Running build in 8 packages
• Remote caching disabled
@elizaos/client-direct:build: cache miss, executing cab933ee8e20125a
@elizaos/core:build: cache miss, executing 26d35a8faa0c88cb
@elizaos/client-direct:build: 
@elizaos/core:build: 
@elizaos/client-direct:build: 
@elizaos/client-direct:build: > @elizaos/client-direct@0.25.6-alpha.1 build /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/packages/client-direct
@elizaos/client-direct:build: > tsup --format esm --dts
@elizaos/client-direct:build: 
@elizaos/core:build: 
@elizaos/core:build: > @elizaos/core@0.25.6-alpha.1 build /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/packages/core
@elizaos/core:build: > tsup --format esm --dts
@elizaos/core:build: 
@elizaos/client-direct:build: CLI Building entry: src/index.ts
@elizaos/client-direct:build: CLI Using tsconfig: tsconfig.json
@elizaos/client-direct:build: CLI tsup v8.3.5
@elizaos/client-direct:build: CLI Using tsup config: /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/packages/client-direct/tsup.config.ts
@elizaos/client-direct:build: CLI Target: esnext
@elizaos/core:build: CLI Building entry: src/index.ts
@elizaos/core:build: CLI Using tsconfig: tsconfig.json
@elizaos/client-direct:build: CLI Cleaning output folder
@elizaos/core:build: CLI tsup v8.3.5
@elizaos/core:build: CLI Using tsup config: /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/packages/core/tsup.config.ts
@elizaos/client-direct:build: ESM Build start
@elizaos/core:build: CLI Target: node18
@elizaos/core:build: CLI Cleaning output folder
@elizaos/core:build: ESM Build start
@elizaos/client-direct:build: ESM dist/index.js     155.46 KB
@elizaos/client-direct:build: ESM dist/index.js.map 325.40 KB
@elizaos/client-direct:build: ESM ⚡️ Build success in 21ms
@elizaos/core:build: ESM dist/chunk-T36IRIEP.js         79.79 KB
@elizaos/core:build: ESM dist/chunk-PR4QN5HX.js         1.87 KB
@elizaos/core:build: ESM dist/secp256k1-JCJWZXTQ.js     237.00 B
@elizaos/core:build: ESM dist/_esm-L4OBJJWB.js          130.56 KB
@elizaos/core:build: ESM dist/ccip-4UOE2BEW.js          290.00 B
@elizaos/core:build: ESM dist/chunk-SDEULMMV.js         157.60 KB
@elizaos/core:build: ESM dist/index.js                  511.09 KB
@elizaos/core:build: ESM dist/secp256k1-JCJWZXTQ.js.map 71.00 B
@elizaos/core:build: ESM dist/chunk-T36IRIEP.js.map     202.76 KB
@elizaos/core:build: ESM dist/chunk-PR4QN5HX.js.map     71.00 B
@elizaos/core:build: ESM dist/ccip-4UOE2BEW.js.map      71.00 B
@elizaos/core:build: ESM dist/_esm-L4OBJJWB.js.map      211.08 KB
@elizaos/core:build: ESM dist/chunk-SDEULMMV.js.map     410.28 KB
@elizaos/core:build: ESM dist/index.js.map              1.40 MB
@elizaos/core:build: ESM ⚡️ Build success in 96ms
@elizaos/client-direct:build: DTS Build start
@elizaos/core:build: DTS Build start
@elizaos/core:build: error TS2688: Cannot find type definition file for 'hapi__shot'.
@elizaos/core:build:   The file is in the program because:
@elizaos/core:build:     Entry point for implicit type library 'hapi__shot'
@elizaos/core:build: 
@elizaos/core:build: Error: error occurred in dts build
@elizaos/core:build:     at Worker.<anonymous> (/mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/node_modules/tsup/dist/index.js:1541:26)
@elizaos/core:build:     at Worker.emit (node:events:513:28)
@elizaos/core:build:     at MessagePort.<anonymous> (node:internal/worker:267:53)
@elizaos/core:build:     at [nodejs.internal.kHybridDispatch] (node:internal/event_target:827:20)
@elizaos/core:build:     at MessagePort.<anonymous> (node:internal/per_context/messageport:23:28)
@elizaos/core:build: DTS Build error
@elizaos/core:build:  ELIFECYCLE  Command failed with exit code 1.
@elizaos/core:build: ERROR: command finished with error: command (/mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/packages/core) /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/node_modules/.bin/pnpm run build exited (1)
@elizaos/core#build: command (/mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/packages/core) /mnt/data1/nix/time/2024/12/31/cloud-deployment-eliza/node_modules/.bin/pnpm run build exited (1)

 Tasks:    0 successful, 2 total
Cached:    0 cached, 2 total
  Time:    3.441s 
Failed:    @elizaos/core#build

 ERROR  run failed: command  exited (1)
 ELIFECYCLE  Command failed with exit code 1.
mdupont@mdupont-G470:~/cloud-deployment-eliza$ 
```
