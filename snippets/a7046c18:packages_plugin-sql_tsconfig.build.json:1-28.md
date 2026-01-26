# a7046c18:packages_plugin-sql_tsconfig.build.json:1-28

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/tsconfig.build.json:1-28
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist/browser",
    "declaration": true,
    "declarationMap": false,
    "emitDeclarationOnly": true
  },
  "include": [
    "src/index.browser.ts",
    "src/pglite/**/*.ts",
    "src/schema/**/*.ts",
    "src/base.ts",
    "src/types.ts",
    "src/utils.browser.ts",
    "src/migration-service.ts",
    "src/migrations.ts",
    "src/rls.ts",
    "src/runtime-migrator/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "src/**/__tests__/**",
    "src/**/*.test.ts",
    "src/**/*.spec.ts"
  ]
}
```