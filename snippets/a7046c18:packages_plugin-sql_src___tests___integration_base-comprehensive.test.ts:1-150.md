# a7046c18:packages_plugin-sql_src___tests___integration_base-comprehensive.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-comprehensive.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import type {
  AgentRuntime,
  ChannelType,
  Component,
  Content,
  Entity,
  Memory,
  Room,
  UUID,
} from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import type { PgDatabaseAdapter } from "../../pg/adapter";
import type { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { createIsolatedTestDatabase } from "../test-helpers";

describe("Base Adapter Comprehensive Tests", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let _runtime: AgentRuntime;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;
  let testEntityId: UUID;
  let testRoomId: UUID;
  let testWorldId: UUID;

  beforeAll(async () => {
    const setup = await createIsolatedTestDatabase("base-comprehensive");
    adapter = setup.adapter;
    _runtime = setup.runtime;
    cleanup = setup.cleanup;
    testAgentId = setup.testAgentId;

    // Create base entities for foreign key constraints
    testEntityId = uuidv4() as UUID;
    testRoomId = uuidv4() as UUID;
    testWorldId = uuidv4() as UUID;

    // Create world first
    await adapter.createWorld({
      id: testWorldId,
      agentId: testAgentId,
      serverId: uuidv4() as UUID,
      name: "Test World",
    });

    // Create room
    await adapter.createRooms([
      {
        id: testRoomId,
        agentId: testAgentId,
        source: "test",
        type: "GROUP" as ChannelType,
        name: "Test Room",
      },
    ]);

    // Create entity
    await adapter.createEntities([
      {
        id: testEntityId,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: { type: "test" },
      },
    ]);
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Entity Methods", () => {
    it("should handle getEntitiesByNames with exact match", async () => {
      // Create multiple entities with different names
      const entities = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alice", "Alice Smith"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Bob", "Bob Jones"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Charlie"],
          metadata: { type: "person" },
        },
      ];

      for (const entity of entities) {
        await adapter.createEntities([entity]);
      }

      // Search for specific names
      const results = await adapter.getEntitiesByNames({
        names: ["Alice", "Bob"],
        agentId: testAgentId,
      });

      expect(results).toHaveLength(2);
      const foundNames = results.flatMap((e) => e.names);
      expect(foundNames).toContain("Alice");
      expect(foundNames).toContain("Bob");
      expect(foundNames).not.toContain("Charlie");
    });

    it("should handle searchEntitiesByName with limit", async () => {
      // Create many entities
      const entities: Entity[] = [];
      for (let i = 0; i < 10; i++) {
        entities.push({
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: [`Search Test ${i}`],
          metadata: { index: i },
        });
      }

      for (const entity of entities) {
        await adapter.createEntities([entity]);
      }

      // Search with limit
      const results = await adapter.searchEntitiesByName({
        query: "Search Test",
        agentId: testAgentId,
        limit: 5,
      });

      expect(results).toHaveLength(5);
    });

    it("should handle deleteEntity with cascade", async () => {
      const entityId = uuidv4() as UUID;

      // Create entity
      await adapter.createEntities([
        {
          id: entityId,
          agentId: testAgentId,
          names: ["Delete Test"],
          metadata: {},
```