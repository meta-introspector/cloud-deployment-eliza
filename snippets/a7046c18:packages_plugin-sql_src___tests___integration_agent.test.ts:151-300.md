# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        expect(retrievedAgent2?.name).toBe(sharedName);
        expect(retrievedAgent1?.id).not.toBe(retrievedAgent2?.id);
        expect(retrievedAgent1?.bio).toContain("First agent with this name");
        expect(retrievedAgent2?.bio).toContain("Second agent with this name");
      });

      it("should return false when creating an agent with a duplicate ID", async () => {
        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Duplicate ID Test 1",
        };
        const created = await adapter.createAgent(agent1);
        expect(created).toBe(true);

        const agent2 = {
          ...testAgent,
          id: agent1.id, // Same ID
          name: "Duplicate ID Test 2",
        };

        const result = await adapter.createAgent(agent2);
        expect(result).toBe(false);
      });

      it("should create agent with complex settings structure", async () => {
        // Create an agent with complex settings
        const complexSettings = {
          apiSettings: {
            endpoints: {
              primary: "https://api.example.com",
              secondary: "https://backup.example.com",
            },
            auth: {
              type: "oauth",
              tokens: {
                access: "access-token",
                refresh: "refresh-token",
              },
            },
          },
          preferences: {
            theme: "dark",
            notifications: true,
            languages: ["en", "fr", "es"],
          },
          features: [
            { id: "feature1", enabled: true, config: { timeout: 1000 } },
            { id: "feature2", enabled: false },
          ],
        };

        const newAgent: Agent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Complex Settings",
          settings: complexSettings as Record<string, unknown>,
        };

        const result = await adapter.createAgent(newAgent);
        expect(result).toBe(true);

        // Verify the complex settings were stored correctly
        const createdAgent = await adapter.getAgent(newAgent.id);
        const settings = createdAgent?.settings as
          | Record<string, unknown>
          | undefined;
        const apiSettings = settings?.apiSettings as
          | Record<string, unknown>
          | undefined;
        const endpoints = apiSettings?.endpoints as
          | Record<string, unknown>
          | undefined;
        const auth = apiSettings?.auth as Record<string, unknown> | undefined;
        const tokens = auth?.tokens as Record<string, unknown> | undefined;
        expect(endpoints?.primary).toBe("https://api.example.com");
        expect(tokens?.refresh).toBe("refresh-token");
        expect(createdAgent?.settings?.preferences?.languages).toEqual([
          "en",
          "fr",
          "es",
        ]);
        expect(createdAgent?.settings?.features?.[0]?.id).toBe("feature1");
        expect(createdAgent?.settings?.features?.[1]?.enabled).toBe(false);
      });

      it("should handle creating agent with missing optional fields", async () => {
        // Create an agent with minimal required fields
        const minimalAgent = {
          id: uuidv4() as UUID,
          name: "Minimal Agent",
          bio: "Just the required fields",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const result = await adapter.createAgent(minimalAgent);
        expect(result).toBe(true);

        // Verify the agent was created with default values for missing fields
        const createdAgent = await adapter.getAgent(minimalAgent.id);
        expect(createdAgent).not.toBeNull();
        expect(createdAgent?.name).toBe(minimalAgent.name);
        expect(createdAgent?.enabled).toBe(true); // Should use the default value
        expect(createdAgent?.settings).toEqual({}); // Should have empty settings object
      });
    });

    describe("getAgent and getAgents", () => {
      it("should retrieve an agent by ID", async () => {
        // Create an agent first
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Get Agent",
        };

        await adapter.createAgent(newAgent);

        // Retrieve the agent
        const result = await adapter.getAgent(newAgent.id);

        expect(result).not.toBeNull();
        expect(result?.id).toBe(newAgent.id);
        expect(result?.name).toBe(newAgent.name);
      });

      it("should return null for non-existent agent ID", async () => {
        const nonExistentId = uuidv4() as UUID;

        const result = await adapter.getAgent(nonExistentId);

        expect(result).toBeNull();
      });

      it("should retrieve all agents", async () => {
        // Create multiple agents
        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Agent 1",
        };

        const agent2 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Agent 2",
        };

        await adapter.createAgent(agent1);
```