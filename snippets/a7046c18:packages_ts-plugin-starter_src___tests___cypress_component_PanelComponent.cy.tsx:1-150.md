# a7046c18:packages_ts-plugin-starter_src___tests___cypress_component_PanelComponent.cy.tsx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/component/PanelComponent.cy.tsx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import React from "react";
import { panels } from "../../../frontend/index";

// Time response interface
interface TimeResponse {
  timestamp: string;
  unix: number;
  formatted: string;
  timezone: string;
}

// Enhanced Panel Component with time display
const EnhancedPanelComponent: React.FC<{ agentId: string }> = ({ agentId }) => {
  const apiBase = window.ELIZA_CONFIG?.apiBase || "http://localhost:3000";

  const {
    data: timeData,
    isLoading,
    error,
  } = useQuery<TimeResponse>({
    queryKey: ["panelTime", agentId],
    queryFn: async () => {
      const response = await fetch(`${apiBase}/api/time`);
      if (!response.ok) {
        throw new Error("Failed to fetch time");
      }
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Example Panel</h2>
        <div>Hello {agentId}!</div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-md font-medium mb-2">Server Time</h3>
        {isLoading && <div className="text-gray-600">Loading time...</div>}
        {error && <div className="text-red-600">Error loading time</div>}
        {timeData && (
          <div className="text-sm space-y-1">
            <div>Time: {timeData.formatted}</div>
            <div className="text-gray-600">Timezone: {timeData.timezone}</div>
          </div>
        )}
      </div>
    </div>
  );
};

describe("PanelComponent Tests", () => {
  // Get the Panel component from the exported panels
  const PanelComponent = panels[0]?.component;

  describe("Panel Registration", () => {
    it("should export panels array with correct structure", () => {
      expect(panels).to.be.an("array");
      expect(panels).to.have.length.greaterThan(0);

      const panel = panels[0];
      expect(panel).to.have.property("name", "Example");
      expect(panel).to.have.property("path", "example");
      expect(panel).to.have.property("component");
      expect(panel).to.have.property("icon", "Book");
      expect(panel).to.have.property("public", false);
      expect(panel).to.have.property("shortLabel", "Example");
    });
  });

  describe("Component Rendering", () => {
    it("should render with agent ID", () => {
      const testAgentId = "test-agent-12345";

      if (!PanelComponent) {
        throw new Error("PanelComponent not found in panels export");
      }

      cy.mount(<PanelComponent agentId={testAgentId} />);

      // Updated to match the corrected text in the component
      cy.contains(`Hello ${testAgentId}!`).should("be.visible");
    });

    it("should handle different agent IDs", () => {
      const agentIds = [
        "agent-1",
        "agent-2",
        "12345678-1234-1234-1234-123456789abc",
        "test-agent",
      ];

      agentIds.forEach((agentId) => {
        cy.mount(<PanelComponent agentId={agentId} />);
        cy.contains(`Hello ${agentId}!`).should("be.visible");
      });
    });

    it("should render without crashing with empty agent ID", () => {
      cy.mount(<PanelComponent agentId="" />);
      cy.contains("Hello !").should("be.visible");
    });
  });

  describe("Enhanced Panel with Time Display", () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    beforeEach(() => {
      // Set up ELIZA_CONFIG for API testing
      cy.window().then((win) => {
        win.ELIZA_CONFIG = {
          agentId: "test-agent",
          apiBase: "http://localhost:3000",
        };
      });
    });

    it("should fetch and display time in panel", () => {
      cy.intercept("GET", "**/api/time", {
        statusCode: 200,
        body: {
          timestamp: "2024-01-01T12:00:00.000Z",
          unix: 1704110400,
          formatted: "1/1/2024, 12:00:00 PM",
          timezone: "America/New_York",
        },
      }).as("getPanelTime");

      cy.mount(
        <QueryClientProvider client={queryClient}>
          <EnhancedPanelComponent agentId="test-panel-123" />
        </QueryClientProvider>,
      );

      // Wait for API call
      cy.wait("@getPanelTime");

```