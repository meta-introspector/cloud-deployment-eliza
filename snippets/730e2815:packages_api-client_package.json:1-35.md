# 730e2815:packages_api-client_package.json:1-35

**Commit:** 730e2815062351dd2e4bd56394ecbfd0a84a7c8f
**Author:** github-actions[bot]
**Date:** Mon Jan 5 08:21:10 2026 +0000
**File:** packages/api-client/package.json:1-35
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/api-client",
  "version": "1.7.1-alpha.5",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "module": "dist/index.js",
  "description": "Type-safe API client for ElizaOS server",
  "type": "module",
  "scripts": {
    "build": "bun run build.ts",
    "dev": "bun run build.ts --watch",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "lint": "eslint src/ && prettier --write ./src",
    "lint:check": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@elizaos/core": "workspace:*"
  },
  "devDependencies": {
    "@elizaos/config": "workspace:*",
    "@types/bun": "^1.3.3",
    "@types/node": "^24.10.1",
    "eslint": "^9.36.0",
    "typescript": "^5.9.3"
  },
  "files": [
    "dist"
  ],
  "publishConfig": {
    "access": "public"
  },
  "gitHead": "255e37c0e4a76da0b776219db5ebb9dadf20e89f"
}
```