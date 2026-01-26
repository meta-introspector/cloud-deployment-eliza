# a7046c18:packages_ts-plugin-starter_tsconfig.build.json:1-18

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/tsconfig.build.json:1-18
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true,
    "inlineSources": true,
    "declaration": true,
    "noEmit": false
  },
  "include": ["src/**/*.ts"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts",
    "src/__tests__/**/*"
  ]
}
```