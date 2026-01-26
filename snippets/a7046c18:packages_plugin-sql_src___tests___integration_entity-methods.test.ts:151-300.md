# a7046c18:packages_plugin-sql_src___tests___integration_entity-methods.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-methods.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      ];

      const result = await adapter.createEntities(entities);
      expect(result).toBe(true);

      const entityIds = entities.map((e) => e.id);
      const retrieved = await adapter.getEntitiesByIds(entityIds);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.length).toBe(3);

      // Find each entity by metadata type
      const setEntity = retrieved?.find((e) => e.metadata?.type === "set");
      const stringEntity = retrieved?.find(
        (e) => e.metadata?.type === "string",
      );
      const arrayEntity = retrieved?.find((e) => e.metadata?.type === "array");

      // Set should be converted to array
      expect(Array.isArray(setEntity?.names)).toBe(true);
      expect(setEntity?.names.length).toBe(2);
      expect(setEntity?.names).toContain("name1");
      expect(setEntity?.names).toContain("name2");

      // String should be wrapped in array, NOT split into characters
      expect(Array.isArray(stringEntity?.names)).toBe(true);
      expect(stringEntity?.names).toEqual(["singlename"]);
      expect(stringEntity?.names.length).toBe(1);

      // Array should remain unchanged
      expect(Array.isArray(arrayEntity?.names)).toBe(true);
      expect(arrayEntity?.names).toEqual(["proper", "array"]);
    });

    /**
     * Test: Numbers should be converted to string arrays
     *
     * WHY: Without proper handling, passing a number would cause Array.from(42)
     * to throw "TypeError: 42 is not iterable", crashing the application.
     *
     * WHAT: Verify that numbers are safely converted to string format ["42"].
     */
    it("should handle number as names by converting to string array", async () => {
      const entityId = uuidv4() as UUID;

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: 42, // Number (non-iterable)
        metadata: { type: "number" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual(["42"]);
    });

    /**
     * Test: Booleans should be converted to string arrays
     *
     * WHY: Similar to numbers, booleans are non-iterable and would cause
     * Array.from(true) to throw a runtime error.
     *
     * WHAT: Verify that booleans are safely converted to string format ["true"].
     */
    it("should handle boolean as names by converting to string array", async () => {
      const entityId = uuidv4() as UUID;

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: true, // Boolean (non-iterable)
        metadata: { type: "boolean" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual(["true"]);
    });

    /**
     * Test: Plain objects should be converted to string arrays
     *
     * WHY: Plain objects like {foo: 'bar'} are not iterable and would cause
     * Array.from() to throw. They need to be stringified.
     *
     * WHAT: Verify that plain objects are safely converted to their string
     * representation and wrapped in an array.
     */
    it("should handle plain object as names by converting to string array", async () => {
      const entityId = uuidv4() as UUID;

      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: { foo: "bar" }, // Plain object (non-iterable)
        metadata: { type: "object" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      // Should convert object to string representation
      expect(retrieved?.[0]?.names.length).toBe(1);
      expect(typeof retrieved?.[0]?.names[0]).toBe("string");
    });

    /**
     * Test: Null and undefined should result in empty arrays
     *
     * WHY: Null and undefined are common in JavaScript and need special handling.
     * They should not cause errors or produce invalid data.
     *
     * WHAT: Verify that both null and undefined values are safely converted
     * to empty arrays [].
     */
    it("should handle null and undefined names gracefully", async () => {
      const entities: any[] = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: null,
          metadata: { type: "null" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: undefined,
          metadata: { type: "undefined" },
        },
      ];

      const result = await adapter.createEntities(entities);
      expect(result).toBe(true);

      const entityIds = entities.map((e) => e.id);
      const retrieved = await adapter.getEntitiesByIds(entityIds);

      expect(retrieved).not.toBeNull();
```