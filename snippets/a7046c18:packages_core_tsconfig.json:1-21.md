# a7046c18:packages_core_tsconfig.json:1-21

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/tsconfig.json:1-21
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./",
    "types": ["node", "bun"],
    "noEmit": true,
    "skipLibCheck": true,
    "paths": {
      "@elizaos/plugin-sql": ["../plugin-sql/src/index.ts"]
    }
  },
  "include": ["typescript/src/**/*.ts"],
  "exclude": [
    "typescript/src/**/*.test.ts",
    "typescript/src/**/*.spec.ts",
    "typescript/src/__tests__/**/*",
    "node_modules",
    "dist"
  ]
}
```