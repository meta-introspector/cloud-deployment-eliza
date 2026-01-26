# 3c099c27:packages_plugin-bootstrap_package.json:1-59

**Commit:** 3c099c27c0573951b61b6c96f54d9d132aea388f
**Author:** github-actions[bot]
**Date:** Sat Dec 20 05:18:41 2025 +0000
**File:** packages/plugin-bootstrap/package.json:1-59
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/plugin-bootstrap",
  "version": "1.7.1-alpha.0",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "repository": {
    "type": "git",
    "url": "https://github.com/elizaos-plugins/plugin-bootstrap"
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
    "scripts",
    "package.json",
    "LICENSE"
  ],
  "dependencies": {
    "@elizaos/core": "workspace:*",
    "@elizaos/plugin-sql": "workspace:*",
    "bun": "^1.3.4"
  },
  "devDependencies": {
    "@elizaos/config": "workspace:*",
    "@types/bun": "^1.3.3",
    "@types/node": "^24.10.1",
    "prettier": "^3.7.4",
    "typescript": "^5.9.3",
    "zod": "^4.1.13"
  },
  "scripts": {
    "build": "bun run build.ts",
    "dev": "bun run build.ts --watch",
    "lint": "eslint src/ && prettier --write ./src",
    "lint:check": "eslint src/",
    "clean": "rm -rf dist .turbo node_modules .turbo-tsconfig.json tsconfig.tsbuildinfo",
    "format": "prettier --write ./src",
    "format:check": "prettier --check ./src",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage"
  },
  "peerDependencies": {
    "whatwg-url": "7.1.0"
  },
  "publishConfig": {
    "access": "public"
  },
  "gitHead": "255e37c0e4a76da0b776219db5ebb9dadf20e89f"
}
```