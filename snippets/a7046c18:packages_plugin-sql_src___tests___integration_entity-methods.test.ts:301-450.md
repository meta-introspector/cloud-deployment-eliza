# a7046c18:packages_plugin-sql_src___tests___integration_entity-methods.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-methods.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(retrieved?.length).toBe(2);

      // Both should result in empty arrays
      retrieved?.forEach((entity) => {
        expect(Array.isArray(entity.names)).toBe(true);
        expect(entity.names).toEqual([]);
      });
    });

    /**
     * Test: Non-iterable values in updates should be handled gracefully
     *
     * WHY: The normalization bug could occur during updates just as it could
     * during creation. Updates need the same safety guarantees.
     *
     * WHAT: Verify that updating an entity with a non-iterable value (number)
     * doesn't crash and produces the expected string array.
     */
    it("should handle non-iterable values in update", async () => {
      const entityId = uuidv4() as UUID;

      // Create initial entity
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["original-name"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Update with non-iterable value (number)
      const updatedEntity: any = {
        id: entityId,
        agentId: testAgentId,
        names: 999, // Number
        metadata: { updated: true },
      };

      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual(["999"]);
    });

    /**
     * Test: Maps should be converted to string arrays (not [key, value] tuples)
     *
     * WHY: Maps are iterables that yield [key, value] tuples. Without proper
     * handling, Array.from(map) would create an array of tuples like
     * [['key1', 'value1'], ['key2', 'value2']], which would then be stringified
     * to ["key1,value1", "key2,value2"] or cause database errors.
     *
     * WHAT: Verify that Map inputs are converted to proper string arrays.
     */
    it("should handle Map as names by converting entries to strings", async () => {
      const entityId = uuidv4() as UUID;

      // Create a Map (common in some APIs or data structures)
      const namesMap = new Map([
        ["key1", "value1"],
        ["key2", "value2"],
      ]);

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: namesMap, // Map (iterable that yields tuples)
        metadata: { type: "map" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);

      // Each entry should be converted to a string
      // Map entries become "key1,value1", "key2,value2" when stringified
      expect(retrieved?.[0]?.names.length).toBe(2);
      expect(retrieved?.[0]?.names).toContain("key1,value1");
      expect(retrieved?.[0]?.names).toContain("key2,value2");
    });

    /**
     * Test: Arrays with non-string elements should convert all to strings
     *
     * WHY: Arrays might contain mixed types (numbers, objects, booleans).
     * Without converting all elements to strings, these would cause database
     * errors when inserted into a string array column.
     *
     * WHAT: Verify that arrays with non-string elements are properly converted.
     */
    it("should convert all array elements to strings, even if non-string", async () => {
      const entityId = uuidv4() as UUID;

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: ["string", 123, true, { foo: "bar" }, null], // Mixed types
        metadata: { type: "mixed-array" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);

      // All elements should be strings now
      expect(retrieved?.[0]?.names.length).toBe(5);
      expect(retrieved?.[0]?.names[0]).toBe("string");
      expect(retrieved?.[0]?.names[1]).toBe("123");
      expect(retrieved?.[0]?.names[2]).toBe("true");
      expect(typeof retrieved?.[0]?.names[3]).toBe("string"); // Object stringified
      expect(retrieved?.[0]?.names[4]).toBe("null");

      // Verify all are strings
      retrieved?.[0]?.names.forEach((name) => {
        expect(typeof name).toBe("string");
      });
    });

    /**
     * Test: Sets with non-string elements should convert all to strings
     *
     * WHY: Sets might contain non-string values (numbers, objects, etc).
     * These need to be converted to strings to prevent database errors.
     *
     * WHAT: Verify that Sets with mixed types are properly converted.
     */
    it("should convert Set elements to strings, even if non-string", async () => {
      const entityId = uuidv4() as UUID;

      const namesSet = new Set([123, "test", true, 456]);

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: namesSet, // Set with mixed types
        metadata: { type: "mixed-set" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

```