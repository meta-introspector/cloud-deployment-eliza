# a6548d3b:packages_config_package.json:1-55

**Commit:** a6548d3bbaa9a31f89d4afe6a36ef8222ef82dce
**Author:** github-actions[bot]
**Date:** Mon Jan 5 13:46:16 2026 +0000
**File:** packages/config/package.json:1-55
**Novelty Score:** 20.18
**Concepts:** plugin-system, testing

```
{
  "name": "@elizaos/config",
  "description": "Shared configuration for ElizaOS projects and plugins",
  "version": "1.7.1-alpha.8",
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
    "url": "https://github.com/elizaos/eliza.git",
    "directory": "packages/config"
  },
  "homepage": "https://eliza.how",
  "bugs": {
    "url": "https://github.com/elizaos/eliza/issues"
  },
  "exports": {
    "./eslint/eslint.config.plugin.js": "./src/eslint/eslint.config.plugin.js",
    "./eslint/eslint.config.base.js": "./src/eslint/eslint.config.base.js",
    "./eslint/eslint.config.frontend.js": "./src/eslint/eslint.config.frontend.js",
    "./prettier/prettier.config.js": "./src/prettier/prettier.config.js",
    "./typescript/tsconfig.base.json": "./src/typescript/tsconfig.base.json",
    "./typescript/tsconfig.plugin.json": "./src/typescript/tsconfig.plugin.json",
    "./typescript/tsconfig.frontend.json": "./src/typescript/tsconfig.frontend.json",
    "./typescript/tsconfig.test.json": "./src/typescript/tsconfig.test.json"
  },
  "files": [
    "dist",
    "src"
  ],
  "devDependencies": {
    "prettier": "^3.7.4",
    "typescript": "^5.9.3"
  },
  "scripts": {
    "build": "bun run build.ts",
    "dev": "bun run build.ts --watch",
    "lint": "prettier --write ./src",
    "format": "prettier --write ./src",
    "format:check": "prettier --check ./src"
  },
  "publishConfig": {
    "access": "public"
  },
  "gitHead": "255e37c0e4a76da0b776219db5ebb9dadf20e89f"
}
```