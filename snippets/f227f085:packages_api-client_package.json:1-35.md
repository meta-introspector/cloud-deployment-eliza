# f227f085:packages_api-client_package.json:1-35

**Commit:** f227f085a3c61f2d164ff47931ea8aa01afc2a37
**Author:** github-actions[bot]
**Date:** Fri Dec 19 21:54:51 2025 +0000
**File:** packages/api-client/package.json:1-35
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/api-client",
  "version": "1.6.6-alpha.8",
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