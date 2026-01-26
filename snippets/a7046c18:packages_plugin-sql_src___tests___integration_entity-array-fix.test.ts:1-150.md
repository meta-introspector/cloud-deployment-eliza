# a7046c18:packages_plugin-sql_src___tests___integration_entity-array-fix.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-array-fix.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { Entity, UUID } from "@elizaos/core";
import { stringToUuid } from "@elizaos/core";
import { createTestDatabase } from "../test-helpers";

describe("Entity Array Serialization Fix Tests", () => {
  let adapter: any;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;

  beforeEach(async () => {
    testAgentId = stringToUuid(`test-agent-${Date.now()}`);
    const testDB = await createTestDatabase(testAgentId);
    adapter = testDB.adapter;
    cleanup = testDB.cleanup;
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Entity Creation with Names Array", () => {
    it("should create entity with single name in array", async () => {
      const entityId = stringToUuid(`entity-single-${Date.now()}`);
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["user-test123"],
        metadata: { web: { userName: "user-test123" } },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.length).toBe(1);
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual(["user-test123"]);
    });

    it("should create entity with multiple names in array", async () => {
      const entityId = stringToUuid(`entity-multiple-${Date.now()}`);
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["user-primary", "user-alias1", "user-alias2"],
        metadata: { web: { userName: "user-primary" } },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual([
        "user-primary",
        "user-alias1",
        "user-alias2",
      ]);
    });

    it("should handle entity with empty names array", async () => {
      const entityId = stringToUuid(`entity-empty-${Date.now()}`);
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: [],
        metadata: {},
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual([]);
    });

    it("should handle entity with Set-like names by converting to array", async () => {
      const entityId = stringToUuid(`entity-set-${Date.now()}`);

      // Simulate what might happen if names accidentally becomes a Set
      const namesSet = new Set(["user-name1", "user-name2"]);
      const entity: any = {
        id: entityId,
        agentId: testAgentId,
        names: namesSet, // This should be normalized to an array
        metadata: {},
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      // Set order is not guaranteed, so we just check the values are present
      expect(retrieved?.[0]?.names.length).toBe(2);
      expect(retrieved?.[0]?.names).toContain("user-name1");
      expect(retrieved?.[0]?.names).toContain("user-name2");
    });
  });

  describe("Entity Update with Names Array", () => {
    it("should update entity names correctly", async () => {
      const entityId = stringToUuid(`entity-update-${Date.now()}`);

      // Create initial entity
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["original-name"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Update with new names
      const updatedEntity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["original-name", "new-name", "another-name"],
        metadata: { updated: true },
      };

      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(Array.isArray(retrieved?.[0]?.names)).toBe(true);
      expect(retrieved?.[0]?.names).toEqual([
        "original-name",
        "new-name",
        "another-name",
      ]);
    });

    it("should handle Set-like names in update by converting to array", async () => {
      const entityId = stringToUuid(`entity-update-set-${Date.now()}`);

      // Create initial entity
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["original-name"],
```