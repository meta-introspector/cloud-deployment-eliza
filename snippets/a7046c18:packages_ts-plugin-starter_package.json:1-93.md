# a7046c18:packages_ts-plugin-starter_package.json:1-93

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/package.json:1-93
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "name": "@elizaos/plugin-starter",
  "description": "${PLUGINDESCRIPTION}",
  "version": "2.0.0-alpha.0",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "packageType": "plugin",
  "platform": "node",
  "license": "UNLICENSED",
  "author": "${GITHUB_USERNAME}",
  "keywords": [
    "plugin",
    "elizaos"
  ],
  "repository": {
    "type": "git",
    "url": "${REPO_URL}"
  },
  "homepage": "https://elizaos.ai",
  "bugs": {
    "url": "https://github.com/${GITHUB_USERNAME}/${PLUGINNAME}/issues"
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
    ".gitignore",
    "package.json"
  ],
  "dependencies": {
    "@elizaos/core": "workspace:*",
    "@tanstack/react-query": "^5.90.16",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1",
    "tailwindcss": "^4.1.18",
    "vite": "^7.3.1",
    "zod": "^4.3.5"
  },
  "devDependencies": {
    "@elizaos/cli": "workspace:*",
    "@tailwindcss/vite": "^4.1.18",
    "@vitejs/plugin-react-swc": "^4.2.2",
    "dotenv": "^17.2.3",
    "prettier": "^3.7.4",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.9.3"
  },
  "scripts": {
    "start": "elizaos start",
    "dev": "elizaos dev",
    "build": "bun run build.ts",
    "lint": "prettier --write ./src",
    "lint:check": "prettier --check ./src",
    "typecheck": "tsc --noEmit",
    "postinstall": "node -e \"const fs=require('fs');const path=require('path');const zodPath=path.join('node_modules','zod');if(fs.existsSync(zodPath)){fs.writeFileSync(path.join(zodPath,'v3.js'),'module.exports=require(\\\"./lib/index.js\\\");');fs.writeFileSync(path.join(zodPath,'v3.d.ts'),'export * from \\\"./lib/index\\\";');}\" || true",
    "test:component": "bun run test:install && bun test",
    "test:e2e": "bun run test:install && bun test",
    "test:e2e:manual": "bun run test:install && node scripts/test-e2e-manual.js",
    "test:cypress": "bun run test:install && cypress run --component",
    "test": "bun run test:install && bun run test:component && bun run test:e2e",
    "test:install": "node scripts/install-test-deps.js",
    "format": "prettier --write ./src",
    "format:check": "prettier --check ./src",
    "build:watch": "bun run build.ts --watch"
  },
  "publishConfig": {
    "access": "public"
  },
  "resolutions": {
    "zod": "4.3.5"
  },
  "agentConfig": {
    "pluginType": "elizaos:plugin:1.0.0",
    "pluginParameters": {
      "API_KEY": {
        "type": "string",
        "description": "API key for the service"
      }
    }
  },
  "gitHead": "d5bd5c43bfebeb7ac02f9e029f924cb6cd5c2ec7"
}
```