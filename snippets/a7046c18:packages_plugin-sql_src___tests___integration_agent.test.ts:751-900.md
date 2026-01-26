# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      it("should handle non-existent agent ID", async () => {
        const nonExistentId = uuidv4() as UUID;

        // Try to update non-existent agent
        const updateData: Partial<Agent> = {
          bio: "This should not be saved",
        };

        const result = await adapter.updateAgent(nonExistentId, updateData);

        // Should still return true as the operation didn't fail
        expect(result).toBe(true);

        // Verify the agent doesn't exist
        const agent = await adapter.getAgent(nonExistentId);
        expect(agent).toBeNull();
      });
    });

    describe("deleteAgent", () => {
      it("should delete an agent and return true", async () => {
        // Create an agent first
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Delete",
        };

        await adapter.createAgent(newAgent);

        // Delete the agent
        const result = await adapter.deleteAgent(newAgent.id);

        expect(result).toBe(true);

        // Verify the agent was deleted
        const deletedAgent = await adapter.getAgent(newAgent.id);
        expect(deletedAgent).toBeNull();
      });

      it("should cascade delete all related data when deleting an agent", async () => {
        // Create a separate test instance for cascade delete test
        const setup = await createIsolatedTestDatabase("agent-cascade-delete");
        const cascadeAdapter = setup.adapter;
        const agentId = setup.testAgentId;

        try {
          // The agent was already created by the test helper

          // Create a world
          const worldId = uuidv4() as UUID;
          await cascadeAdapter.createWorld({
            id: worldId,
            name: "Test World",
            agentId: agentId,
            serverId: uuidv4() as UUID,
          });

          // Create rooms
          const roomId1 = uuidv4() as UUID;
          const roomId2 = uuidv4() as UUID;
          await cascadeAdapter.createRooms([
            {
              id: roomId1,
              name: "Test Room 1",
              agentId: agentId,
              serverId: uuidv4() as UUID,
              worldId: worldId,
              channelId: uuidv4() as UUID,
              type: "PUBLIC" as any,
              source: "test",
            },
            {
              id: roomId2,
              name: "Test Room 2",
              agentId: agentId,
              serverId: uuidv4() as UUID,
              worldId: worldId,
              channelId: uuidv4() as UUID,
              type: "PRIVATE" as any,
              source: "test",
            },
          ]);

          // Create entities
          const entityId1 = uuidv4() as UUID;
          const entityId2 = uuidv4() as UUID;
          await cascadeAdapter.createEntities([
            {
              id: entityId1,
              agentId: agentId,
              names: ["Entity 1"],
              metadata: { type: "test" },
            },
            {
              id: entityId2,
              agentId: agentId,
              names: ["Entity 2"],
              metadata: { type: "test" },
            },
          ]);

          // Create memories
          const memoryId1 = await cascadeAdapter.createMemory(
            {
              id: uuidv4() as UUID,
              agentId: agentId,
              entityId: entityId1,
              roomId: roomId1,
              content: { text: "Test memory 1" },
              createdAt: Date.now(),
              embedding: new Array(384).fill(0.1), // Create a test embedding
            },
            "test_memories",
          );

          const memoryId2 = await cascadeAdapter.createMemory(
            {
              id: uuidv4() as UUID,
              agentId: agentId,
              entityId: entityId2,
              roomId: roomId2,
              content: { text: "Test memory 2" },
              createdAt: Date.now(),
              embedding: new Array(384).fill(0.2), // Create a test embedding
            },
            "test_memories",
          );

          // Create components
          await cascadeAdapter.createComponent({
            id: uuidv4() as UUID,
            entityId: entityId1,
            type: "test_component",
            data: { value: "test" },
            agentId: agentId,
            roomId: roomId1,
            worldId: worldId,
            sourceEntityId: entityId2,
            createdAt: Date.now(),
          });

          // Create participants
          await cascadeAdapter.addParticipant(entityId1, roomId1);
          await cascadeAdapter.addParticipant(entityId2, roomId2);

          // Create relationships
          await cascadeAdapter.createRelationship({
            sourceEntityId: entityId1,
```