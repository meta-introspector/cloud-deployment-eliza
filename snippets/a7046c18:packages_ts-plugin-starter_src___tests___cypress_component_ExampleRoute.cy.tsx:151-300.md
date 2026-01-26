# a7046c18:packages_ts-plugin-starter_src___tests___cypress_component_ExampleRoute.cy.tsx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/component/ExampleRoute.cy.tsx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        };
      });

      cy.mount(<ExampleRoute />);

      // Check that the agent ID is displayed
      cy.contains("Plugin Starter Example").should("be.visible");
      cy.contains(`Agent ID: ${testAgentId}`).should("be.visible");
    });
  });

  describe("API Communication", () => {
    beforeEach(() => {
      // Set up ELIZA_CONFIG
      cy.window().then((win) => {
        win.ELIZA_CONFIG = {
          agentId: "test-agent-123",
          apiBase: "http://localhost:3000",
        };
      });
    });

    it("should fetch and display time from backend", () => {
      // Mock the API response
      cy.intercept("GET", "**/api/time", {
        statusCode: 200,
        body: {
          timestamp: "2024-01-01T12:00:00.000Z",
          unix: 1704110400,
          formatted: "1/1/2024, 12:00:00 PM",
          timezone: "UTC",
        },
      }).as("getTime");

      cy.mount(<ExampleRoute />);

      // Wait for the API call
      cy.wait("@getTime");

      // Check that time data is displayed
      cy.get('[data-testid="time-display"]').should("be.visible");
      cy.contains("Current Time").should("be.visible");
      cy.contains("Formatted: 1/1/2024, 12:00:00 PM").should("be.visible");
      cy.contains("Timezone: UTC").should("be.visible");
      cy.contains("Unix: 1704110400").should("be.visible");
    });

    it("should refresh time when refresh button is clicked", () => {
      let callCount = 0;

      // Mock multiple API responses
      cy.intercept("GET", "**/api/time", (req) => {
        callCount++;
        req.reply({
          statusCode: 200,
          body: {
            timestamp: new Date().toISOString(),
            unix: Math.floor(Date.now() / 1000) + callCount,
            formatted: `Call ${callCount}: ${new Date().toLocaleString()}`,
            timezone: "UTC",
          },
        });
      }).as("getTime");

      cy.mount(<ExampleRoute />);

      // Wait for initial load
      cy.wait("@getTime");
      cy.contains("Call 1:").should("be.visible");

      // Click refresh button
      cy.get('[data-testid="refresh-button"]').click();

      // Wait for refresh
      cy.wait("@getTime");
      cy.contains("Call 2:").should("be.visible");
    });

    it("should verify auto-refresh behavior", () => {
      let callCount = 0;

      cy.intercept("GET", "**/api/time", (req) => {
        callCount++;
        req.reply({
          statusCode: 200,
          body: {
            timestamp: new Date().toISOString(),
            unix: Math.floor(Date.now() / 1000),
            formatted: `Update ${callCount}`,
            timezone: "UTC",
          },
        });
      }).as("getTime");

      cy.mount(<ExampleRoute />);

      // Wait for initial load
      cy.wait("@getTime");
      cy.contains("Update 1").should("be.visible");

      // Verify multiple API calls happen due to auto-refresh
      cy.wait("@getTime", { timeout: 2000 });
      cy.get("@getTime.all").should("have.length.greaterThan", 1);
    });

    it("should show loading state", () => {
      // Add delay to see loading state
      cy.intercept("GET", "**/api/time", (req) => {
        // Instead of req.reply with a callback, use a simpler approach
        req.reply({
          statusCode: 200,
          body: {
            timestamp: new Date().toISOString(),
            unix: Math.floor(Date.now() / 1000),
            formatted: new Date().toLocaleString(),
            timezone: "UTC",
          },
          delay: 1000, // Add delay directly
        });
      }).as("getTimeDelayed");

      cy.mount(<ExampleRoute />);

      // Check loading state
      cy.contains("Loading time...").should("be.visible");

      // Wait for data to load
      cy.wait("@getTimeDelayed");
      cy.contains("Loading time...").should("not.exist");
      cy.get('[data-testid="time-display"]').should("be.visible");
    });
  });

  describe("Configuration Handling", () => {
    it("should handle different API base URLs", () => {
      const customApiBase = "https://api.example.com";

      cy.window().then((win) => {
        win.ELIZA_CONFIG = {
          agentId: "test-agent",
          apiBase: customApiBase,
        };
      });

      // Intercept with custom base URL
      cy.intercept("GET", `${customApiBase}/api/time`, {
        statusCode: 200,
        body: {
          timestamp: new Date().toISOString(),
          unix: Math.floor(Date.now() / 1000),
```