# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            targetEntityId: entityId2,
            tags: ["test_relationship"],
            metadata: { strength: 0.8 },
          });

          // Create tasks
          const taskId = await cascadeAdapter.createTask({
            id: uuidv4() as UUID,
            name: "Test Task",
            description: "A test task",
            roomId: roomId1,
            worldId: worldId,
            tags: ["test"],
            metadata: { priority: "high" },
          });

          // Create cache entries
          await cascadeAdapter.setCache("test_cache_key", {
            value: "cached data",
          });

          // Create logs
          await cascadeAdapter.log({
            body: { action: "test_log" },
            entityId: entityId1,
            roomId: roomId1,
            type: "test",
          });

          // Verify all data was created
          expect(await cascadeAdapter.getWorld(worldId)).not.toBeNull();
          expect(
            (await cascadeAdapter.getRoomsByIds([roomId1, roomId2]))?.length,
          ).toBe(2);
          expect(
            (await cascadeAdapter.getEntitiesByIds([entityId1, entityId2]))
              ?.length,
          ).toBe(2);
          expect(await cascadeAdapter.getMemoryById(memoryId1)).not.toBeNull();
          expect(await cascadeAdapter.getMemoryById(memoryId2)).not.toBeNull();
          expect(await cascadeAdapter.getTask(taskId)).not.toBeNull();
          expect(await cascadeAdapter.getCache("test_cache_key")).toBeDefined();

          // Now delete the agent - this should cascade delete everything
          const deleteResult = await cascadeAdapter.deleteAgent(agentId);
          expect(deleteResult).toBe(true);

          // Verify the agent is deleted
          expect(await cascadeAdapter.getAgent(agentId)).toBeNull();

          // Verify all related data is deleted via cascade
          // Worlds should be deleted
          expect(await cascadeAdapter.getWorld(worldId)).toBeNull();

          // Rooms should be deleted
          const rooms = await cascadeAdapter.getRoomsByIds([roomId1, roomId2]);
          expect(rooms).toEqual([]);

          // Entities should be deleted
          const entities = await cascadeAdapter.getEntitiesByIds([
            entityId1,
            entityId2,
          ]);
          expect(entities).toEqual([]);

          // Memories should be deleted
          expect(await cascadeAdapter.getMemoryById(memoryId1)).toBeNull();
          expect(await cascadeAdapter.getMemoryById(memoryId2)).toBeNull();

          // Tasks should be deleted
          expect(await cascadeAdapter.getTask(taskId)).toBeNull();

          // Cache should be deleted
          expect(
            await cascadeAdapter.getCache("test_cache_key"),
          ).toBeUndefined();

          // Components, participants, relationships, and logs should also be deleted
          // but we don't have direct methods to verify these in the adapter
          // They would be verified through database queries if needed
        } finally {
          await setup.cleanup();
        }
      });

      it("should return false when deleting non-existent agent", async () => {
        const nonExistentId = uuidv4() as UUID;

        const result = await adapter.deleteAgent(nonExistentId);

        // Should return false for non-existent agents with the new implementation
        expect(result).toBe(false);
      });

      it("should delete agent with complex data structure", async () => {
        // Create an agent with complex settings and other fields
        const complexAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Delete Complex",
          settings: {
            nestedObject: {
              deeplyNested: {
                value: "test",
                array: [1, 2, 3],
              },
            },
            simpleValue: "hello",
          },
          messageExamples: [
            [
              {
                name: "user",
                content: {
                  text: "Hello there",
                },
              },
              {
                name: "assistant",
                content: {
                  text: "Hi, how can I help you?",
                },
              },
            ],
          ],
          postExamples: ["Example post"],
          topics: ["topic1", "topic2"],
          adjectives: ["smart", "helpful"],
        };

        await adapter.createAgent(complexAgent);

        // Delete the agent
        const result = await adapter.deleteAgent(complexAgent.id);
        expect(result).toBe(true);

        // Verify the agent was deleted
        const deletedAgent = await adapter.getAgent(complexAgent.id);
        expect(deletedAgent).toBeNull();
      });
    });

    describe("countAgents", () => {
      it("should return the correct count of agents", async () => {
        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Count Test Agent 1",
        };
        const agent2 = {
```