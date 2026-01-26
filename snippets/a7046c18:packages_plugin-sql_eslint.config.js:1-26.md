# a7046c18:packages_plugin-sql_eslint.config.js:1-26

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/eslint.config.js:1-26
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * ESLint config for plugin-sql
 * Standalone config without @elizaos/config dependency
 */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    rules: {
      // plugin-sql specific overrides
      "@typescript-eslint/no-unused-vars": "off",
      "no-control-regex": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
```