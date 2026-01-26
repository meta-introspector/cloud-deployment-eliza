# a7046c18:packages_plugin-sql_src___tests___integration_pglite-e2e.test.ts:451-587

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/pglite-e2e.test.ts:451-587
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        data: { updated: true },
      });

      const retrieved = await adapter.getComponent(
        entityId,
        "update-test",
        worldId,
        sourceEntityId,
      );
      expect(retrieved?.data).toEqual({ updated: true });
    });

    it("should delete a component", async () => {
      const component: Component = {
        id: uuidv4() as UUID,
        entityId,
        agentId,
        roomId,
        worldId,
        sourceEntityId,
        type: "delete-test",
        data: {},
        createdAt: Date.now(),
      };

      await adapter.createComponent(component);
      await adapter.deleteComponent(component.id);

      const retrieved = await adapter.getComponent(
        entityId,
        "delete-test",
        worldId,
        sourceEntityId,
      );
      expect(retrieved).toBeNull();
    });
  });

  describe("Transaction and Concurrency", () => {
    it("should handle concurrent operations", async () => {
      const { adapter, agentId } = await createTestAdapter();

      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
      } as Agent);

      const operations = Array(5)
        .fill(null)
        .map((_, i) => {
          const entity: Entity = {
            id: uuidv4() as UUID,
            agentId,
            names: [`Concurrent Entity ${i}`],
            metadata: { custom: "data" },
          };
          return adapter.createEntities([entity]);
        });

      const results = await Promise.all(operations);
      expect(results.every((r) => r === true)).toBe(true);

      await adapter.close();
    });

    it("should handle large batch operations", async () => {
      const { adapter, agentId } = await createTestAdapter();

      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
      } as Agent);

      const entities: Entity[] = Array(100)
        .fill(null)
        .map((_, i) => ({
          id: uuidv4() as UUID,
          agentId,
          names: [`Batch Entity ${i}`],
          metadata: { custom: "data" },
        }));

      const created = await adapter.createEntities(entities);
      expect(created).toBe(true);

      const entityIds = entities
        .map((e) => e.id)
        .filter((id): id is UUID => id !== undefined);
      const retrieved = await adapter.getEntitiesByIds(entityIds);
      expect(retrieved).toHaveLength(100);

      await adapter.close();
    });
  });

  describe("Error Handling", () => {
    it("should handle duplicate agent creation", async () => {
      const { adapter, agentId } = await createTestAdapter();

      const agent: Partial<Agent> = {
        id: agentId,
        name: "Duplicate Test",
      };

      await adapter.createAgent(agent as Agent);
      const secondCreate = await adapter.createAgent(agent as Agent);
      expect(secondCreate).toBe(false);

      await adapter.close();
    });

    it("should handle non-existent entity retrieval", async () => {
      const { adapter } = await createTestAdapter();

      const nonExistentId = uuidv4() as UUID;
      const result = await adapter.getEntitiesByIds([nonExistentId]);
      expect(result).toHaveLength(0);

      await adapter.close();
    });

    it("should handle invalid memory search", async () => {
      const { adapter } = await createTestAdapter();

      const results = await adapter.searchMemories({
        tableName: "memories",
        embedding: Array(384).fill(0),
        count: 0, // Invalid count
      });
      expect(results).toHaveLength(0);

      await adapter.close();
    });
  });
});
```