# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Count Test Agent 2",
        };
        await adapter.createAgent(agent1);
        await adapter.createAgent(agent2);
        const count = await adapter.countAgents();
        // Use toBeGreaterThanOrEqual since other tests might have created agents
        expect(count).toBeGreaterThanOrEqual(2);
      });
    });

    // Add tests for cleanupAgents if this method is implemented
    describe("cleanupAgents", () => {
      it("should clean up agents properly", async () => {
        // This test is a placeholder and should be implemented
        // if the cleanupAgents method is actually used

        // Create some test agents that would be cleaned up
        const tempAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Cleanup",
        };

        await adapter.createAgent(tempAgent);

        // Call the cleanup method - implementation would depend on what
        // cleanupAgents is actually supposed to do
        await adapter.cleanupAgents();

        // Add appropriate verification based on what the method should do
      });
    });

    describe("UUID-Based Agent Identification", () => {
      it("should allow multiple agents with identical names in real database", async () => {
        const sharedName = "TestAgent-Duplicate";

        // Create 3 agents with the same name
        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "user1",
          bio: ["First agent instance"],
        };

        const agent2 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "user2",
          bio: ["Second agent instance"],
        };

        const agent3 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "user3",
          bio: ["Third agent instance"],
        };

        // All should succeed
        expect(await adapter.createAgent(agent1)).toBe(true);
        expect(await adapter.createAgent(agent2)).toBe(true);
        expect(await adapter.createAgent(agent3)).toBe(true);

        // Verify all three exist and can be retrieved by their unique IDs
        const retrieved1 = await adapter.getAgent(agent1.id);
        const retrieved2 = await adapter.getAgent(agent2.id);
        const retrieved3 = await adapter.getAgent(agent3.id);

        expect(retrieved1).not.toBeNull();
        expect(retrieved2).not.toBeNull();
        expect(retrieved3).not.toBeNull();

        // All have the same name
        expect(retrieved1?.name).toBe(sharedName);
        expect(retrieved2?.name).toBe(sharedName);
        expect(retrieved3?.name).toBe(sharedName);

        // But different IDs
        expect(retrieved1?.id).toBe(agent1.id);
        expect(retrieved2?.id).toBe(agent2.id);
        expect(retrieved3?.id).toBe(agent3.id);

        // And different bios (to prove they're distinct)
        expect(retrieved1?.bio).toContain("First agent instance");
        expect(retrieved2?.bio).toContain("Second agent instance");
        expect(retrieved3?.bio).toContain("Third agent instance");
      });

      it("should get all agents including those with duplicate names", async () => {
        const sharedName = "ListTest-Duplicate";

        // Create agents with duplicate names
        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "list_user1",
        };

        const agent2 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "list_user2",
        };

        await adapter.createAgent(agent1);
        await adapter.createAgent(agent2);

        // Get all agents
        const allAgents = await adapter.getAgents();

        // Find our test agents
        const testAgents = allAgents.filter((a) => a.name === sharedName);

        expect(testAgents.length).toBeGreaterThanOrEqual(2);
        expect(testAgents.some((a) => a.id === agent1.id)).toBe(true);
        expect(testAgents.some((a) => a.id === agent2.id)).toBe(true);
      });

      it("should update only the targeted agent when multiple have the same name", async () => {
        const sharedName = "UpdateTest-Duplicate";

        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "update_user1",
          bio: ["Original bio 1"],
        };

        const agent2 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "update_user2",
          bio: ["Original bio 2"],
        };

        await adapter.createAgent(agent1);
        await adapter.createAgent(agent2);

        // Update only agent1
        await adapter.updateAgent(agent1.id, {
```