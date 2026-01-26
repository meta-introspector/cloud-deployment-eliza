# a7046c18:packages_core_typescript_tsconfig.json:1-11

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/tsconfig.json:1-11
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../dist",
    "rootDir": "./src",
    "types": ["node", "bun"],
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts", "src/__tests__/**/*"]
}
```