# a6548d3b:packages_service-interfaces_package.json:1-74

**Commit:** a6548d3bbaa9a31f89d4afe6a36ef8222ef82dce
**Author:** github-actions[bot]
**Date:** Mon Jan 5 13:46:16 2026 +0000
**File:** packages/service-interfaces/package.json:1-74
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/service-interfaces",
  "version": "1.7.1-alpha.8",
  "description": "Service interface definitions for ElizaOS plugins",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "browser": "dist/browser/index.browser.js",
  "sideEffects": false,
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "types": "./dist/index.d.ts",
      "browser": {
        "types": "./dist/browser/index.d.ts",
        "import": "./dist/browser/index.browser.js",
        "default": "./dist/browser/index.browser.js"
      },
      "node": {
        "types": "./dist/node/index.d.ts",
        "import": "./dist/node/index.node.js",
        "default": "./dist/node/index.node.js"
      },
      "bun": {
        "types": "./dist/node/index.d.ts",
        "default": "./dist/node/index.node.js"
      },
      "default": "./dist/node/index.node.js"
    },
    "./node": {
      "types": "./dist/node/index.d.ts",
      "import": "./dist/node/index.node.js",
      "default": "./dist/node/index.node.js"
    },
    "./browser": {
      "types": "./dist/browser/index.d.ts",
      "import": "./dist/browser/index.browser.js",
      "default": "./dist/browser/index.browser.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "bun run build.ts",
    "dev": "bun run build.ts --watch",
    "clean": "rm -rf dist .turbo node_modules .turbo-tsconfig.json *.tsbuildinfo",
    "test": "echo 'Skipping tests for types-only package' && exit 0",
    "test:coverage": "echo 'Skipping tests for types-only package' && exit 0",
    "test:watch": "echo 'Skipping tests for types-only package' && exit 0",
    "format": "prettier --write ./src",
    "format:check": "prettier --check ./src",
    "lint": "eslint src/ && prettier --write ./src",
    "lint:check": "eslint src/"
  },
  "author": "ElizaOS",
  "license": "MIT",
  "devDependencies": {
    "@elizaos/config": "workspace:*",
    "@types/bun": "^1.3.3",
    "prettier": "^3.7.4",
    "typescript": "^5.9.3"
  },
  "dependencies": {
    "@elizaos/core": "workspace:*"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```