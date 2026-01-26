# a7046c18:packages_plugin-sql_src___tests___integration_entity-methods.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-methods.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);

      // All elements should be strings now
      expect(retrieved?.[0]?.names.length).toBe(4);
      expect(retrieved?.[0]?.names).toContain("123");
      expect(retrieved?.[0]?.names).toContain("test");
      expect(retrieved?.[0]?.names).toContain("true");
      expect(retrieved?.[0]?.names).toContain("456");

      // Verify all are strings
      retrieved?.[0]?.names.forEach((name) => {
        expect(typeof name).toBe("string");
      });
    });

    /**
     * Test: Custom iterables should be handled correctly
     *
     * WHY: Some objects might implement Symbol.iterator and yield non-string
     * values. These need to be properly converted.
     *
     * WHAT: Verify that custom iterables are converted to string arrays.
     */
    it("should handle custom iterable with non-string values", async () => {
      const entityId = uuidv4() as UUID;

      // Create a custom iterable
      const customIterable = {
        *[Symbol.iterator]() {
          yield 1;
          yield 2;
          yield 3;
        },
      };

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: customIterable, // Custom iterable yielding numbers
        metadata: { type: "custom-iterable" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);

      // All elements should be converted to strings
      expect(retrieved?.[0]?.names).toEqual(["1", "2", "3"]);
      retrieved?.[0]?.names.forEach((name) => {
        expect(typeof name).toBe("string");
      });
    });

    /**
     * Test: Map in update should also be handled correctly
     *
     * WHY: The Map bug could occur during updates, not just creation.
     *
     * WHAT: Verify that updating an entity with a Map doesn't cause issues.
     */
    it("should handle Map in update by converting entries to strings", async () => {
      const entityId = uuidv4() as UUID;

      // Create initial entity
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["original-name"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Update with Map
      const namesMap = new Map([
        ["updated", "name1"],
        ["another", "name2"],
      ]);

      const updatedEntity: any = {
        id: entityId,
        agentId: testAgentId,
        names: namesMap,
        metadata: { updated: true },
      };

      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names.length).toBe(2);
      expect(retrieved?.[0]?.names).toContain("updated,name1");
      expect(retrieved?.[0]?.names).toContain("another,name2");
    });
  });

  describe("deleteEntity", () => {
    it("should delete an entity by ID", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Entity to Delete"],
        metadata: { type: "test" },
      };

      // Create entity
      await adapter.createEntities([entity]);

      // Verify it exists
      let retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved).toHaveLength(1);

      // Delete entity
      await adapter.deleteEntity(entity.id!);

      // Verify it's deleted
      retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved).toHaveLength(0);
    });

    it("should not throw when deleting non-existent entity", async () => {
      const nonExistentId = uuidv4() as UUID;
      // Should not throw - deleteEntity should handle non-existent entities gracefully
      await adapter.deleteEntity(nonExistentId);
    });
  });

  describe("getEntitiesByNames", () => {
    it("should retrieve entities by names", async () => {
      const entity1: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["John Doe", "Johnny"],
        metadata: { type: "person" },
      };

      const entity2: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Jane Doe", "Janet"],
        metadata: { type: "person" },
      };

      const entity3: Entity = {
```