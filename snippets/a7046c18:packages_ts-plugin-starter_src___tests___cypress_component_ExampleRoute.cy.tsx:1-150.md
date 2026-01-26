# a7046c18:packages_ts-plugin-starter_src___tests___cypress_component_ExampleRoute.cy.tsx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/component/ExampleRoute.cy.tsx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/// <reference types="cypress" />
/// <reference types="@cypress/react" />
/// <reference types="@testing-library/cypress" />

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import React from "react";
import "../../../frontend/index.css";

// Define the interface for time response
interface TimeResponse {
  timestamp: string;
  unix: number;
  formatted: string;
  timezone: string;
}

// Define ELIZA config interface
interface ElizaConfig {
  agentId: string;
  apiBase?: string; // Make optional to fix type error
}

declare global {
  interface Window {
    ELIZA_CONFIG: ElizaConfig | undefined;
  }
}

describe("ExampleRoute Component Tests", () => {
  // Component definitions inside describe block to have access to cy
  const TimeDisplay = ({ apiBase }: { apiBase: string }) => {
    const { data, isLoading, error, refetch } = useQuery<TimeResponse>({
      queryKey: ["currentTime"],
      queryFn: async () => {
        const response = await fetch(`${apiBase}/api/time`);
        if (!response.ok) {
          throw new Error("Failed to fetch time");
        }
        return response.json();
      },
      refetchInterval: 1000, // Refresh every second
    });

    if (isLoading) {
      return <div className="text-gray-600">Loading time...</div>;
    }

    if (error) {
      return (
        <div className="text-red-600">
          Error fetching time:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      );
    }

    return (
      <div className="space-y-2" data-testid="time-display">
        <h2 className="text-lg font-semibold">Current Time</h2>
        <div className="space-y-1 text-sm">
          <div>
            <span className="font-medium">Formatted:</span> {data?.formatted}
          </div>
          <div>
            <span className="font-medium">Timezone:</span> {data?.timezone}
          </div>
          <div>
            <span className="font-medium">Unix:</span> {data?.unix}
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90"
          data-testid="refresh-button"
        >
          Refresh
        </button>
      </div>
    );
  };

  const ExampleRoute = () => {
    const [config] = React.useState(window.ELIZA_CONFIG);
    const apiBase = config?.apiBase || "http://localhost:3000";

    React.useEffect(() => {
      document.documentElement.classList.add("dark");
    }, []);

    if (!config?.agentId) {
      return (
        <div className="p-4 text-center">
          <div className="text-red-600 font-medium">
            Error: Agent ID not found
          </div>
          <div className="text-sm text-gray-600 mt-2">
            The server should inject the agent ID configuration.
          </div>
        </div>
      );
    }

    return (
      <QueryClientProvider client={new QueryClient()}>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Plugin Starter Example</h1>
            <div className="text-sm text-muted-foreground">
              Agent ID: {config.agentId}
            </div>
          </div>
          <TimeDisplay apiBase={apiBase} />
        </div>
      </QueryClientProvider>
    );
  };

  describe("Component Rendering", () => {
    it("should apply dark mode on mount", () => {
      cy.mount(<ExampleRoute />);
      cy.shouldBeDarkMode();
    });

    it("should show error when agent ID is missing", () => {
      // Clear the config before mounting
      cy.window().then((win) => {
        win.ELIZA_CONFIG = undefined;
      });

      cy.mount(<ExampleRoute />);

      // Check error message is displayed
      cy.contains("Error: Agent ID not found").should("be.visible");
      cy.contains(
        "The server should inject the agent ID configuration.",
      ).should("be.visible");
    });

    it("should render correctly with agent ID", () => {
      const testAgentId = "12345678-1234-1234-1234-123456789abc";

      // Set config before mounting
      cy.window().then((win) => {
        win.ELIZA_CONFIG = {
          agentId: testAgentId,
          apiBase: "http://localhost:3000",
```