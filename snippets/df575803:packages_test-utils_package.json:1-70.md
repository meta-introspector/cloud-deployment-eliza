# df575803:packages_test-utils_package.json:1-70

**Commit:** df5758034ab9843e913b1cc7b327f4dad8bb2e0f
**Author:** github-actions[bot]
**Date:** Mon Dec 15 13:29:15 2025 +0000
**File:** packages/test-utils/package.json:1-70
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/test-utils",
  "description": "Utilities and objects for unit testing",
  "version": "1.6.6-alpha.5",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "packageType": "plugin",
  "platform": "node",
  "license": "MIT",
  "author": "elizaOS",
  "keywords": [
    "plugin",
    "elizaos"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/elizaos/elizaos"
  },
  "homepage": "https://elizaos.ai",
  "bugs": {
    "url": "https://github.com/elizaos/elizaos/issues"
  },
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "files": [
    "dist",
    "README.md",
    ".npmignore",
    "package.json"
  ],
  "dependencies": {
    "@elizaos/core": "workspace:*",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@elizaos/config": "workspace:*",
    "dotenv": "^17.2.3",
    "prettier": "^3.7.4",
    "typescript": "^5.9.3"
  },
  "scripts": {
    "build": "bun run build.ts",
    "dev": "bun run build.ts --watch",
    "lint": "eslint src/ && prettier --write ./src",
    "lint:check": "eslint src/",
    "test": "bun test",
    "format": "prettier --write ./src",
    "format:check": "prettier --check ./src"
  },
  "publishConfig": {
    "access": "public"
  },
  "resolutions": {
    "zod": "4.1.13"
  },
  "agentConfig": {
    "pluginType": "elizaos:plugin:1.0.0",
    "pluginParameters": {}
  },
  "gitHead": "255e37c0e4a76da0b776219db5ebb9dadf20e89f"
}
```