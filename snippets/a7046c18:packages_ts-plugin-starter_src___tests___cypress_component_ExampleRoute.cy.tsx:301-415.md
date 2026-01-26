# a7046c18:packages_ts-plugin-starter_src___tests___cypress_component_ExampleRoute.cy.tsx:301-415

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/component/ExampleRoute.cy.tsx:301-415
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          formatted: "Custom API Response",
          timezone: "UTC",
        },
      }).as("getTimeCustom");

      cy.mount(<ExampleRoute />);

      cy.wait("@getTimeCustom");
      cy.contains("Custom API Response").should("be.visible");
    });

    it("should use default API base when not provided", () => {
      cy.window().then((win) => {
        win.ELIZA_CONFIG = {
          agentId: "test-agent",
          // No apiBase provided - this is now valid with optional apiBase
        };
      });

      // Intercept with default base URL
      cy.intercept("GET", "http://localhost:3000/api/time", {
        statusCode: 200,
        body: {
          timestamp: new Date().toISOString(),
          unix: Math.floor(Date.now() / 1000),
          formatted: "Default API Response",
          timezone: "UTC",
        },
      }).as("getTimeDefault");

      cy.mount(<ExampleRoute />);

      cy.wait("@getTimeDefault");
      cy.contains("Default API Response").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.ELIZA_CONFIG = {
          agentId: "test-agent",
          apiBase: "http://localhost:3000",
        };
      });

      cy.intercept("GET", "**/api/time", {
        statusCode: 200,
        body: {
          timestamp: new Date().toISOString(),
          unix: Math.floor(Date.now() / 1000),
          formatted: new Date().toLocaleString(),
          timezone: "UTC",
        },
      }).as("getTime");
    });

    it("should have proper heading hierarchy", () => {
      cy.mount(<ExampleRoute />);
      cy.wait("@getTime");

      // Check h1 exists
      cy.get("h1").contains("Plugin Starter Example").should("be.visible");

      // Check h2 exists
      cy.get("h2").contains("Current Time").should("be.visible");
    });

    it("should have accessible button", () => {
      cy.mount(<ExampleRoute />);
      cy.wait("@getTime");

      // Button should be focusable and clickable
      cy.get('[data-testid="refresh-button"]')
        .should("be.visible")
        .should("not.be.disabled")
        .focus()
        .should("have.focus");
    });
  });
});

/**
 * TESTING PATTERNS FOR FRONTEND COMPONENTS IN ELIZAOS
 *
 * 1. COMPONENT ISOLATION
 *    - Test components in isolation using cy.mount()
 *    - Mock external dependencies (like API calls)
 *    - Use data-testid attributes for reliable element selection
 *
 * 2. CONFIGURATION TESTING
 *    - Always test with and without ELIZA_CONFIG
 *    - Test with invalid/malformed configurations
 *    - Verify error states and fallbacks
 *
 * 3. DARK MODE SUPPORT
 *    - Ensure components work in both light and dark modes
 *    - Use the custom shouldBeDarkMode() command
 *
 * 4. QUERY CLIENT TESTING
 *    - Mock API responses for react-query
 *    - Test loading, error, and success states
 *    - Verify cache behavior
 *
 * 5. ACCESSIBILITY
 *    - Use Testing Library queries (findByRole, findByText)
 *    - Test keyboard navigation
 *    - Verify ARIA attributes
 *
 * 6. API INTEGRATION TESTING
 *    - Mock all external API calls
 *    - Test error handling
 *    - Verify retry logic
 *    - Test different response scenarios
 */
```