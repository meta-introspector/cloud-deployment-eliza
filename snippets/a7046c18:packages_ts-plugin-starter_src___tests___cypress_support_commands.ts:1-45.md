# a7046c18:packages_ts-plugin-starter_src___tests___cypress_support_commands.ts:1-45

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/support/commands.ts:1-45
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/// <reference types="cypress" />
/// <reference types="@cypress/react" />

// ***********************************************
// This file is where you can create custom Cypress commands
// and overwrite existing commands.
//
// For comprehensive examples, visit:
// https://on.cypress.io/custom-commands
// ***********************************************

// Example custom command
// Cypress.Commands.add('login', (email, password) => { ... })

// Custom command to check if element is in dark mode
Cypress.Commands.add("shouldBeDarkMode", () => {
  cy.get("html").should("have.class", "dark");
});

// Custom command to set ELIZA_CONFIG
Cypress.Commands.add("setElizaConfig", (config) => {
  cy.window().then((win) => {
    // Extend Window interface for test configuration
    interface WindowWithElizaConfig extends Window {
      ELIZA_CONFIG?: { agentId: string; apiBase?: string };
    }
    (win as WindowWithElizaConfig).ELIZA_CONFIG = config;
  });
});

// TypeScript definitions
declare global {
  namespace Cypress {
    interface Chainable {
      shouldBeDarkMode(): Chainable<JQuery<HTMLElement>>;
      setElizaConfig(config: {
        agentId: string;
        apiBase?: string;
      }): Chainable<Window>;
      mount(component: React.ReactElement): Chainable<any>;
    }
  }
}

export {};
```