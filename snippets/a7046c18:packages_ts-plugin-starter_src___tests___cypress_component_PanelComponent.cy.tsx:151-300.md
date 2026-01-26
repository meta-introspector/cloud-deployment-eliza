# a7046c18:packages_ts-plugin-starter_src___tests___cypress_component_PanelComponent.cy.tsx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/cypress/component/PanelComponent.cy.tsx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Check panel content
      cy.contains("Example Panel").should("be.visible");
      cy.contains("Hello test-panel-123!").should("be.visible");

      // Check time display
      cy.contains("Server Time").should("be.visible");
      cy.contains("Time: 1/1/2024, 12:00:00 PM").should("be.visible");
      cy.contains("Timezone: America/New_York").should("be.visible");
    });

    it("should handle API errors in panel", () => {
      cy.intercept("GET", "**/api/time", {
        statusCode: 500,
        body: { error: "Server error" },
      }).as("getPanelTimeError");

      cy.mount(
        <QueryClientProvider client={queryClient}>
          <EnhancedPanelComponent agentId="test-panel-error" />
        </QueryClientProvider>,
      );

      // Wait for failed API call
      cy.wait("@getPanelTimeError");

      // Check error display
      cy.contains("Error loading time").should("be.visible");
    });

    it("should show loading state in panel", () => {
      cy.intercept("GET", "**/api/time", (req) => {
        // Use simpler delay approach
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
      }).as("getPanelTimeDelayed");

      cy.mount(
        <QueryClientProvider client={queryClient}>
          <EnhancedPanelComponent agentId="test-panel-loading" />
        </QueryClientProvider>,
      );

      // Check loading state
      cy.contains("Loading time...").should("be.visible");

      // Wait for data
      cy.wait("@getPanelTimeDelayed");
      cy.contains("Loading time...").should("not.exist");
    });
  });

  describe("Panel Integration", () => {
    it("should integrate with agent UI system", () => {
      // Verify panel can be used in the agent UI
      const panel = panels[0];

      // Create a mock agent UI container
      const AgentUIContainer = ({ agentId }: { agentId: string }) => {
        const Component = panel.component;
        return (
          <div className="agent-ui-container">
            <div className="panel-header">
              <span className="panel-icon">{panel.icon}</span>
              <span className="panel-name">{panel.name}</span>
            </div>
            <div className="panel-content">
              <Component agentId={agentId} />
            </div>
          </div>
        );
      };

      cy.mount(<AgentUIContainer agentId="ui-test-agent" />);

      // Verify integration
      cy.get(".agent-ui-container").should("be.visible");
      cy.get(".panel-icon").contains("Book").should("be.visible");
      cy.get(".panel-name").contains("Example").should("be.visible");
      cy.get(".panel-content")
        .contains("Hello ui-test-agent!")
        .should("be.visible");
    });

    it("should handle panel switching", () => {
      // Simulate multiple panels
      const mockPanels = [
        ...panels,
        {
          name: "Second Panel",
          path: "second",
          component: ({ agentId }: { agentId: string }) => (
            <div>Second panel for {agentId}</div>
          ),
          icon: "Settings",
          public: false,
          shortLabel: "Second",
        },
      ];

      const _currentPanel = 0;

      const PanelSwitcher = () => {
        const [activePanel, setActivePanel] = React.useState(0);
        const ActiveComponent = mockPanels[activePanel].component;

        return (
          <div>
            <div className="panel-tabs">
              {mockPanels.map((panel, index) => (
                <button
                  key={panel.path}
                  onClick={() => setActivePanel(index)}
                  className={activePanel === index ? "active" : ""}
                  data-testid={`tab-${panel.path}`}
                >
                  {panel.name}
                </button>
              ))}
            </div>
            <div className="panel-content">
              <ActiveComponent agentId="switch-test" />
            </div>
          </div>
        );
      };

      cy.mount(<PanelSwitcher />);

      // Check initial panel
      cy.contains("Hello switch-test!").should("be.visible");

      // Switch to second panel
      cy.get('[data-testid="tab-second"]').click();
      cy.contains("Second panel for switch-test").should("be.visible");
      cy.contains("Hello switch-test!").should("not.exist");

      // Switch back
      cy.get('[data-testid="tab-example"]').click();
      cy.contains("Hello switch-test!").should("be.visible");
    });
  });
});
```