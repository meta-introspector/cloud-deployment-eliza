# a7046c18:packages_plugin-sql_src___tests___integration_entity-crud.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/entity-crud.test.ts:1-150
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
import type { Entity, Metadata, UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import type { PgDatabaseAdapter } from "../../pg/adapter";
import type { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { createIsolatedTestDatabase } from "../test-helpers";

describe("Entity CRUD Operations", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;

  beforeAll(async () => {
    const setup = await createIsolatedTestDatabase("entity-crud");
    adapter = setup.adapter;
    cleanup = setup.cleanup;
    testAgentId = setup.testAgentId;
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Basic CRUD Operations", () => {
    beforeEach(async () => {
      // Clean up any existing entities
      const existingEntities = await adapter.searchEntitiesByName({
        query: "",
        agentId: testAgentId,
        limit: 100,
      });
      for (const entity of existingEntities) {
        if (entity.id) {
          await adapter.deleteEntity(entity.id);
        }
      }
    });

    it("should create and retrieve an entity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: { type: "test" },
      };

      const result = await adapter.createEntities([entity]);
      expect(result).toBe(true);

      const retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved).toHaveLength(1);
      expect(retrieved?.[0].id).toBe(entity.id as UUID);
    });

    it("should update an entity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Original Name"],
        metadata: { version: 1 },
      };

      await adapter.createEntities([entity]);

      const updatedEntity: Entity = {
        ...entity,
        names: ["Updated Name"],
        metadata: { version: 2 },
      };

      await adapter.updateEntity(updatedEntity);

      const retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved?.[0].names).toContain("Updated Name");
      expect(retrieved?.[0].metadata?.version).toBe(2);
    });

    it("should delete an entity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["To Delete"],
        metadata: {},
      };

      await adapter.createEntities([entity]);

      // Verify it exists
      let retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved).toHaveLength(1);

      // Delete it
      await adapter.deleteEntity(entity.id!);

      // Verify it's gone
      retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved).toHaveLength(0);
    });
  });

  describe("Advanced Entity Operations", () => {
    it("should get entities by multiple names", async () => {
      const entities = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["John Doe", "JD"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Jane Doe", "JD2"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Bob Smith"],
          metadata: { type: "person" },
        },
      ];

      for (const entity of entities) {
        await adapter.createEntities([entity]);
      }

      // Search for Doe entities
      const doeEntities = await adapter.getEntitiesByNames({
        names: ["John Doe", "Jane Doe"],
        agentId: testAgentId,
      });

      expect(doeEntities).toHaveLength(2);
      const names = doeEntities.flatMap((e) => e.names);
      expect(names).toContain("John Doe");
      expect(names).toContain("Jane Doe");
    });

    it("should search entities with partial name matching", async () => {
      const entities = [
```