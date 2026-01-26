# a7046c18:packages_plugin-sql_src___tests___integration_entity.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";
import type { AgentRuntime, Entity, UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import type { PgDatabaseAdapter } from "../../pg/adapter";
import type { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { entityTable } from "../../schema";
import { createIsolatedTestDatabase } from "../test-helpers";

describe("Entity Integration Tests", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let _runtime: AgentRuntime;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;

  beforeAll(async () => {
    const setup = await createIsolatedTestDatabase("entity-tests");
    adapter = setup.adapter;
    _runtime = setup.runtime;
    cleanup = setup.cleanup;
    testAgentId = setup.testAgentId;
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Entity Tests", () => {
    beforeEach(async () => {
      // Clear entities before each test to ensure a clean slate
      const db = adapter.getDatabase();
      await db.delete(entityTable);
    });

    it("should create and retrieve a basic entity", async () => {
      const entityId = uuidv4() as UUID;
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: { type: "test" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.[0]?.id).toBe(entityId);
    });

    it("should return empty array when retrieving non-existent entities", async () => {
      const nonExistentId = uuidv4() as UUID;
      const retrieved = await adapter.getEntitiesByIds([nonExistentId]);
      expect(retrieved).toEqual([]);
    });

    it("should update an existing entity", async () => {
      const entityId = uuidv4() as UUID;
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["Original Name"],
        metadata: { original: "data" },
      };

      const createResult = await adapter.createEntities([entity]);
      expect(createResult).toBe(true);

      const updatedEntity = {
        ...entity,
        names: ["Updated Name"],
        metadata: { updated: "data" },
      };
      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.[0]?.names).toEqual(["Updated Name"]);
      expect(retrieved?.[0]?.metadata).toEqual({ updated: "data" });
    });

    it("should handle multiple entities creation", async () => {
      const entity1Id = uuidv4() as UUID;
      const entity2Id = uuidv4() as UUID;
      const entities: Entity[] = [
        {
          id: entity1Id,
          agentId: testAgentId,
          names: ["Entity One"],
          metadata: { type: "type1" },
        },
        {
          id: entity2Id,
          agentId: testAgentId,
          names: ["Entity Two"],
          metadata: { type: "type2" },
        },
      ];

      const result = await adapter.createEntities(entities);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entity1Id, entity2Id]);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.length).toBe(2);
    });

    it("should handle entities with multiple names", async () => {
      const entityId = uuidv4() as UUID;
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["Primary Name", "Alias 1", "Alias 2"],
        metadata: { hasAliases: true },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.[0]?.names).toEqual([
        "Primary Name",
        "Alias 1",
        "Alias 2",
      ]);
    });

    it("should handle entities with no metadata", async () => {
      const entityId = uuidv4() as UUID;
      const entity: Entity = {
        id: entityId,
        agentId: testAgentId,
        names: ["Simple Entity"],
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entityId]);
      expect(retrieved).not.toBeNull();
```