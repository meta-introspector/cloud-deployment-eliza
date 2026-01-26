# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        await adapter.createAgent(agent2);

        // Retrieve all agents
        const agents = await adapter.getAgents();

        // Verify at least our test agents are included
        const testAgents = agents.filter(
          (a) => a.name === agent1.name || a.name === agent2.name,
        );

        expect(testAgents.length).toBeGreaterThanOrEqual(2);
        expect(testAgents.some((a) => a.id === agent1.id)).toBe(true);
        expect(testAgents.some((a) => a.id === agent2.id)).toBe(true);
      });
    });

    describe("updateAgent", () => {
      it("should update an existing agent", async () => {
        // Create an agent first
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Update",
        };

        await adapter.createAgent(newAgent);

        // Update the agent
        const updateData: Partial<Agent> = {
          bio: "Updated bio",
          settings: {
            updatedSetting: "new value",
          },
        };

        const result = await adapter.updateAgent(newAgent.id, updateData);

        expect(result).toBe(true);

        // Verify the agent was updated
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.bio).toBe(updateData.bio as string);
        expect(updatedAgent?.settings).toHaveProperty(
          "updatedSetting",
          "new value",
        );
      });

      it("should merge settings when updating", async () => {
        // Create an agent with initial settings
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Settings Merge",
          settings: {
            initialSetting: "initial value",
            toBeKept: "keep this value",
          },
        };

        await adapter.createAgent(newAgent);

        // Update with new settings
        const updateData: Partial<Agent> = {
          settings: {
            initialSetting: "updated value", // Update existing setting
            newSetting: "new value", // Add new setting
            // toBeKept is not mentioned, should be kept
          },
        };

        await adapter.updateAgent(newAgent.id, updateData);

        // Verify the settings were properly merged
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.settings).toHaveProperty(
          "initialSetting",
          "updated value",
        );
        expect(updatedAgent?.settings).toHaveProperty(
          "newSetting",
          "new value",
        );
        expect(updatedAgent?.settings).toHaveProperty(
          "toBeKept",
          "keep this value",
        );
      });

      it("should remove settings when set to null", async () => {
        // Create an agent with initial settings
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Settings Remove",
          settings: {
            initialSetting: "initial value",
            toBeRemoved: "remove this value",
            toBeKept: "keep this value",
            secrets: {
              password: "secret123",
              token: "token123",
            },
          },
        };

        await adapter.createAgent(newAgent);

        // Update with null settings to remove
        const updateData: Partial<Agent> = {
          settings: {
            toBeRemoved: null, // This should be removed
            secrets: {
              password: null, // This should be removed
              token: "newToken", // This should be updated
            },
          } as any,
        };

        await adapter.updateAgent(newAgent.id, updateData as any);

        // Verify the settings were properly updated
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.settings).toHaveProperty(
          "initialSetting",
          "initial value",
        );
        expect(updatedAgent?.settings).toHaveProperty(
          "toBeKept",
          "keep this value",
        );
        expect(updatedAgent?.settings).not.toHaveProperty("toBeRemoved");
        // Check secrets only if they exist
        if (updatedAgent?.settings?.secrets) {
          expect(updatedAgent.settings.secrets).not.toHaveProperty("password");
          expect(updatedAgent.settings.secrets).toHaveProperty(
            "token",
            "newToken",
          );
        }
      });

      it("should update only non-settings fields", async () => {
        // Create an agent first
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Update Non-Settings",
          settings: {
            initialSetting: "should remain unchanged",
```