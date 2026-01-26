# a7046c18:turbo.json:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** turbo.json:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "$schema": "https://turborepo.org/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**"]
    },
    "@elizaos/core#build": {
      "dependsOn": [],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**"],
      "inputs": ["typescript/src/**", "build.ts", "tsconfig.declarations.json"]
    },
    "@elizaos/core#build:all": {
      "dependsOn": [],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**", "rust/pkg/**"],
      "inputs": [
        "typescript/src/**",
        "rust/src/**",
        "build.ts",
        "tsconfig.declarations.json"
      ]
    },
    "@elizaos/core#build:ts": {
      "dependsOn": [],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**"],
      "inputs": ["typescript/src/**", "build.ts", "tsconfig.declarations.json"]
    },
    "@elizaos/core#build:rust": {
      "dependsOn": [],
      "outputs": ["rust/pkg/**", "rust/target/release/**"],
      "inputs": ["rust/src/**", "rust/Cargo.toml", "rust/build.sh"]
    },
    "@elizaos/core#build:python": {
      "dependsOn": [],
      "outputs": ["python/elizaos.egg-info/**"],
      "inputs": ["python/elizaos/**", "python/pyproject.toml"],
      "cache": false
    },
    "@elizaos/client#build": {
      "dependsOn": ["^build"],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**"]
    },
    "@elizaos/cli#build": {
      "dependsOn": ["^build"],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**"]
    },
    "@elizaos/server#build": {
      "dependsOn": ["@elizaos/client#build", "^build"],
      "env": ["LOG_LEVEL"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "outputs": [".eslintcache"]
    },
    "lint:check": {
      "outputs": [".eslintcache"]
    },
    "lint:ts": {
      "outputs": [".eslintcache"]
    },
    "lint:ts:check": {
      "outputs": [".eslintcache"]
    },
    "typecheck": {
      "outputs": []
    },
    "typecheck:ts": {
      "outputs": []
    },
    "lint:rust": {
      "outputs": []
    },
    "typecheck:rust": {
      "outputs": []
    },
    "lint:python": {
      "outputs": []
    },
    "typecheck:python": {
      "outputs": []
    },
    "format": {
      "outputs": []
    },
    "format:check": {
      "outputs": []
    },
    "format:ts": {
      "outputs": []
    },
    "format:ts:check": {
      "outputs": []
    },
    "format:python": {
      "outputs": []
    },
    "format:python:check": {
      "outputs": []
    },
    "start": {
      "dependsOn": ["@elizaos/core#build"],
      "env": ["LOG_LEVEL"],
      "persistent": true
    },
    "dev": {
      "dependsOn": ["@elizaos/core#build"],
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": [
        "typescript/src/**/*.ts",
        "typescript/src/**/*.js",
        "__tests__/**/*",
        "*.test.*"
      ]
    },
    "test:ts": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": ["typescript/src/**/*.ts", "typescript/src/**/*.js"]
    },
    "test:rust": {
      "outputs": [],
      "inputs": ["rust/src/**", "rust/tests/**"]
    },
    "test:python": {
      "outputs": [],
      "inputs": ["python/elizaos/**", "python/tests/**"]
    },
    "migrate": {
      "dependsOn": ["@elizaos/core#build"],
      "cache": false
    },
    "migrate:generate": {
      "dependsOn": ["@elizaos/core#build"],
      "cache": false
    },
    "clean": {
      "cache": false
    }
  }
}
```