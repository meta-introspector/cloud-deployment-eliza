# a7046c18:packages_plugin-sql_src___tests___integration_entity-crud.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-crud.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alexander Hamilton"],
          metadata: {},
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alexandra Smith"],
          metadata: {},
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Bob Johnson"],
          metadata: {},
        },
      ];

      for (const entity of entities) {
        await adapter.createEntities([entity]);
      }

      const results = await adapter.searchEntitiesByName({
        query: "Alex",
        agentId: testAgentId,
        limit: 10,
      });

      expect(results).toHaveLength(2);
      expect(
        results.every((e) =>
          e.names.some((name) => name.toLowerCase().includes("alex")),
        ),
      ).toBe(true);
    });

    it("should handle entity metadata operations", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Metadata Test"],
        metadata: {
          level: 1,
          tags: ["test", "metadata"],
          nested: {
            property: "value",
            array: [1, 2, 3],
          },
        },
      };

      await adapter.createEntities([entity]);

      const retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved?.[0].metadata).toEqual(entity.metadata as Metadata);
      expect(
        (retrieved?.[0].metadata?.nested as Record<string, unknown>)?.array,
      ).toEqual([1, 2, 3]);
    });

    it("should handle duplicate entity creation", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Duplicate Test"],
        metadata: {},
      };

      // First creation should succeed
      const firstResult = await adapter.createEntities([entity]);
      expect(firstResult).toBe(true);

      // Second creation should fail
      const secondResult = await adapter.createEntities([entity]);
      expect(secondResult).toBe(false);
    });

    it("should handle batch entity operations", async () => {
      const entities: Entity[] = [];
      for (let i = 0; i < 5; i++) {
        entities.push({
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: [`Batch Entity ${i}`],
          metadata: { index: i },
        });
      }

      // Create all entities
      const result = await adapter.createEntities(entities);
      expect(result).toBe(true);

      // Verify all were created
      const entityIds = entities.map((e) => e.id!);
      const retrieved = await adapter.getEntitiesByIds(entityIds);
      expect(retrieved).toHaveLength(5);

      // Delete all entities
      for (const entity of entities) {
        await adapter.deleteEntity(entity.id!);
      }

      // Verify all were deleted
      const afterDelete = await adapter.getEntitiesByIds(entityIds);
      expect(afterDelete).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty search query", async () => {
      // Create a few entities
      for (let i = 0; i < 3; i++) {
        await adapter.createEntities([
          {
            id: uuidv4() as UUID,
            agentId: testAgentId,
            names: [`Entity ${i}`],
            metadata: {},
          },
        ]);
      }

      const results = await adapter.searchEntitiesByName({
        query: "",
        agentId: testAgentId,
        limit: 10,
      });

      expect(results.length).toBeGreaterThanOrEqual(3);
    });

    it("should handle update of non-existent entity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Non-existent"],
        metadata: {},
      };

      // Should not throw - updateEntity should handle non-existent entities gracefully
      await adapter.updateEntity(entity);

      // Entity should not exist
      const retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved).toHaveLength(0);
    });

    it("should handle deletion of non-existent entity", async () => {
```