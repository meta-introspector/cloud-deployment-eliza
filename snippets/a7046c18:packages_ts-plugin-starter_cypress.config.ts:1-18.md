# a7046c18:packages_ts-plugin-starter_cypress.config.ts:1-18

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/cypress.config.ts:1-18
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "src/__tests__/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "src/__tests__/cypress/support/component.ts",
    indexHtmlFile: "src/__tests__/cypress/support/component-index.html",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "src/__tests__/cypress/support/e2e.ts",
    specPattern: "src/__tests__/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
```