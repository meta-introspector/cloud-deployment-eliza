# a7046c18:packages_ts-plugin-starter_src___tests___cypress_support_component.ts:1-33

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/support/component.ts:1-33
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
// ***********************************************************
// This file is processed and loaded automatically before your test files.
// You can change the location of this file or turn off processing using the
// 'supportFile' config option.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Import Testing Library Cypress commands
import "@testing-library/cypress/add-commands";

// Import styles
import "../../../frontend/index.css";

// Add custom TypeScript types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to mount React components
       * @example cy.mount(<Component />)
       */
      mount(component: React.ReactElement): Chainable<any>;
    }
  }
}

// Import React mount function
import { mount } from "@cypress/react";

// Make mount available globally
Cypress.Commands.add("mount", mount);
```