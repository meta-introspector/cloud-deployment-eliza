# a7046c18:packages_plugin-sql_src___tests___integration_entity-crud.test.ts:301-350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-crud.test.ts:301-350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const nonExistentId = uuidv4() as UUID;

      // Should not throw - deleteEntity should handle non-existent entities gracefully
      await adapter.deleteEntity(nonExistentId);
    });

    it("should handle entities with multiple names in search", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Primary Name", "Alias One", "Alias Two"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Should find by any name
      const result1 = await adapter.searchEntitiesByName({
        query: "Primary",
        agentId: testAgentId,
      });
      expect(result1).toHaveLength(1);

      const result2 = await adapter.searchEntitiesByName({
        query: "Alias",
        agentId: testAgentId,
      });
      expect(result2).toHaveLength(1);
    });

    it("should handle case-insensitive name search", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["CaseSensitive Name"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      const results = await adapter.searchEntitiesByName({
        query: "CASESENSITIVE",
        agentId: testAgentId,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(entity.id as UUID);
    });
  });
});
```