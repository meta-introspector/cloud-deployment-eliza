# a7046c18:packages_plugin-sql_src___tests___integration_entity-methods.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-methods.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type { Entity, UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import type { PgDatabaseAdapter } from "../../pg/adapter";
import type { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { createIsolatedTestDatabase } from "../test-helpers";

describe("Entity Methods Integration Tests", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;

  beforeAll(async () => {
    const setup = await createIsolatedTestDatabase("entity-methods");
    adapter = setup.adapter;
    cleanup = setup.cleanup;
    testAgentId = setup.testAgentId;
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  /**
   * Entity Names Normalization Tests
   *
   * These tests verify that the entity names field is properly normalized to an array
   * regardless of the input type. This is critical because:
   *
   * 1. **String Handling Bug**: Without proper normalization, passing a string like "username"
   *    would be treated as an iterable and split into individual characters ["u","s","e","r"...]
   *    which corrupts the data.
   *
   * 2. **Non-Iterable Values**: When non-array values (numbers, booleans, objects) are passed,
   *    calling Array.from() would throw a runtime error, crashing the application.
   *
   * 3. **Data Integrity**: Entity names must always be stored as a proper string array to
   *    maintain consistency across the database and prevent query failures.
   *
   * The normalizeEntityNames method handles:
   * - Arrays: Pass through unchanged
   * - Strings: Wrap in array (not split into characters)
   * - Sets: Convert to array using Array.from()
   * - Iterables: Check for Symbol.iterator before calling Array.from()
   * - Non-iterables: Convert to string and wrap in array
   * - null/undefined: Return empty array
   */
  describe("Entity Names Normalization", () => {
    /**
     * Test: String values should NOT be split into individual characters
     *
     * WHY: A common bug was that passing a string like "username" would result in
     * the string being treated as an iterable, producing ["u","s","e","r","n","a","m","e"]
     * instead of ["username"].
     *
     * WHAT: Verify that a single string is wrapped in an array, not character-split.
     */
    it("should NOT split a string name into individual characters", async () => {
      const entityId = uuidv4() as UUID;

      // Simulate a case where names might accidentally be a string
      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: "username123", // String instead of array
        metadata: { web: { userName: "username123" } },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);

      // Should be ["username123"], NOT ["u","s","e","r","n","a","m","e","1","2","3"]
      expect(retrieved?.[0]?.names).toEqual(["username123"]);
      expect(retrieved?.[0]?.names.length).toBe(1);
    });

    /**
     * Test: String values in updates should also NOT be split into characters
     *
     * WHY: The bug could also occur during entity updates, not just creation.
     *
     * WHAT: Verify that updating an entity with a string name doesn't split it.
     */
    it("should handle string name in update without splitting into characters", async () => {
      const entityId = uuidv4() as UUID;

      // Create initial entity with proper array
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["original-name"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Update with string instead of array (simulating the bug scenario)
      const updatedEntity: any = {
        id: entityId,
        agentId: testAgentId,
        names: "updated-username", // String instead of array
        metadata: { updated: true },
      };

      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);

      // Should be ["updated-username"], NOT character array
      expect(retrieved?.[0]?.names).toEqual(["updated-username"]);
      expect(retrieved?.[0]?.names.length).toBe(1);
    });

    /**
     * Test: Multiple input types should all normalize correctly
     *
     * WHY: Entities can come from various sources (APIs, user input, other systems)
     * and we need to handle all possible input types gracefully.
     *
     * WHAT: Test Set, string, and array inputs all in one batch to ensure
     * consistent behavior across different input types.
     */
    it("should properly handle Set, string, and array types in batch", async () => {
      const entities: any[] = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: new Set(["name1", "name2"]), // Set should convert to array
          metadata: { type: "set" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: "singlename", // String should wrap in array
          metadata: { type: "string" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["proper", "array"], // Array should stay as is
          metadata: { type: "array" },
        },
```