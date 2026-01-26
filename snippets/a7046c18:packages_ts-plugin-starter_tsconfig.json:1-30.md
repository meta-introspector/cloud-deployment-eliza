# a7046c18:packages_ts-plugin-starter_tsconfig.json:1-30

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/tsconfig.json:1-30
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
{
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["ESNext", "dom"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleResolution": "Bundler",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "incremental": true,
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "forceConsistentCasingInFileNames": false,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "noImplicitAny": false,
    "allowJs": true,
    "checkJs": false,
    "noEmitOnError": false,
    "moduleDetection": "force",
    "allowArbitraryExtensions": true,
    "jsx": "react",
    "isolatedModules": false,
    "noEmit": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/__tests__/**/*", "e2e/**/*", "**/*.test.ts", "**/*.spec.ts"]
}
```