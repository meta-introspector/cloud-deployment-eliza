# a7046c18:packages_plugin-sql_src___tests___integration_entity-methods.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-methods.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Bob Smith"],
        metadata: { type: "person" },
      };

      // Create entities
      await adapter.createEntities([entity1, entity2, entity3]);

      // Search for entities with Doe names
      const doeEntities = await adapter.getEntitiesByNames({
        names: ["John Doe", "Jane Doe"],
        agentId: testAgentId,
      });

      expect(doeEntities).toHaveLength(2);
      expect(doeEntities.map((e) => e.id)).toContain(entity1.id);
      expect(doeEntities.map((e) => e.id)).toContain(entity2.id);
    });

    it("should return empty array when no entities match", async () => {
      const result = await adapter.getEntitiesByNames({
        names: ["Non Existent Name"],
        agentId: testAgentId,
      });

      expect(result).toEqual([]);
    });
  });

  describe("searchEntitiesByName", () => {
    it("should search entities by partial name match", async () => {
      const entities: Entity[] = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alice Smith", "Alicia"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Bob Johnson"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alice Cooper", "Al Cooper"],
          metadata: { type: "person" },
        },
      ];

      // Create entities
      for (const entity of entities) {
        await adapter.createEntities([entity]);
      }

      // Search for entities with 'Alice' in name
      const searchResults = await adapter.searchEntitiesByName({
        query: "Alice",
        agentId: testAgentId,
        limit: 10,
      });

      expect(searchResults).toHaveLength(2);
      expect(
        searchResults.every((e) =>
          e.names.some((name) => name.toLowerCase().includes("alice")),
        ),
      ).toBe(true);
    });

    it("should respect the limit parameter", async () => {
      const entities: Entity[] = [];
      for (let i = 0; i < 5; i++) {
        entities.push({
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: [`Test Entity ${i}`],
          metadata: { index: i },
        });
      }

      // Create entities
      await adapter.createEntities(entities);

      // Search with limit
      const results = await adapter.searchEntitiesByName({
        query: "Test",
        agentId: testAgentId,
        limit: 2,
      });

      expect(results).toHaveLength(2);
    });

    it("should return all entities when query is empty", async () => {
      const entities: Entity[] = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Entity 1"],
          metadata: {},
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Entity 2"],
          metadata: {},
        },
      ];

      await adapter.createEntities(entities);

      const results = await adapter.searchEntitiesByName({
        query: "",
        agentId: testAgentId,
        limit: 10,
      });

      expect(results.length).toBeGreaterThanOrEqual(2);
    });

    it("should perform case-insensitive search", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["UPPERCASE NAME", "MixedCase Name"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Search with lowercase
      let results = await adapter.searchEntitiesByName({
        query: "uppercase",
        agentId: testAgentId,
      });
      expect(results).toHaveLength(1);

      // Search with different case
      results = await adapter.searchEntitiesByName({
        query: "MIXEDCASE",
        agentId: testAgentId,
      });
      expect(results).toHaveLength(1);
    });
  });
});
```