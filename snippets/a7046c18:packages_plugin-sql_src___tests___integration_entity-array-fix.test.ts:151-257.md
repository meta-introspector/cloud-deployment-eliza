# a7046c18:packages_plugin-sql_src___tests___integration_entity-array-fix.test.ts:151-257

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-array-fix.test.ts:151-257
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Update with Set-like names
      const namesSet = new Set(["updated-name1", "updated-name2"]);
      const updatedEntity: any = {
        id: entityId,
        agentId: testAgentId,
        names: namesSet, // This should be normalized to an array
        metadata: { updated: true },
      };

      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names.length).toBe(2);
      expect(retrieved?.[0]?.names).toContain("updated-name1");
      expect(retrieved?.[0]?.names).toContain("updated-name2");
    });
  });

  describe("Batch Entity Creation", () => {
    it("should create multiple entities with proper name arrays", async () => {
      const timestamp = Date.now();
      const entities: Entity[] = Array.from({ length: 5 }, (_, i) => ({
        id: stringToUuid(`batch-entity-${timestamp}-${i}`),
        agentId: testAgentId,
        names: [`user-${i}`, `alias-${i}`],
        metadata: { index: i },
      }));

      const result = await adapter.createEntities(entities);
      expect(result).toBe(true);

      const entityIds = entities.map((e) => e.id);
      const retrieved = await adapter.getEntitiesByIds(entityIds);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.length).toBe(5);

      // Verify each entity has proper array format without relying on order
      retrieved?.forEach((entity) => {
        expect(Array.isArray(entity.names)).toBe(true);
        expect(entity.names.length).toBe(2);
        expect(entity.names[0]).toMatch(/^user-\d+$/);
        expect(entity.names[1]).toMatch(/^alias-\d+$/);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle entity with special characters in names", async () => {
      const entityId = stringToUuid(`entity-special-${Date.now()}`);
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: [
          "user@test.com",
          "user-with-dash",
          "user_with_underscore",
          "user{with}braces",
        ],
        metadata: {},
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual([
        "user@test.com",
        "user-with-dash",
        "user_with_underscore",
        "user{with}braces",
      ]);
    });

    it("should handle entity with unicode characters in names", async () => {
      const entityId = stringToUuid(`entity-unicode-${Date.now()}`);
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["用户名", "ユーザー", "пользователь", "👤user"],
        metadata: {},
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual([
        "用户名",
        "ユーザー",
        "пользователь",
        "👤user",
      ]);
    });
  });
});
```