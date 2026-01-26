# a7046c18:packages_plugin-sql_src___tests___integration_base-adapter-methods.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-adapter-methods.test.ts:1-150
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
import type {
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

describe("Base Adapter Methods Integration Tests", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;
  let testEntityId: UUID;

  beforeAll(async () => {
    const setup = await createIsolatedTestDatabase("base-adapter-methods");
    adapter = setup.adapter;
    cleanup = setup.cleanup;
    testAgentId = setup.testAgentId;

    // Create a test entity for memories
    testEntityId = uuidv4() as UUID;
    await adapter.createEntities([
      {
        id: testEntityId,
        agentId: testAgentId,
        names: ["Test Entity for Memories"],
        metadata: { type: "test" },
      },
    ]);
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("CRUD Operations", () => {
    it("should handle getMemories with various filters", async () => {
      const agentId = testAgentId;
      const roomId = uuidv4() as UUID;
      const roomId2 = uuidv4() as UUID; // Different room for third memory

      // Create rooms first
      await adapter.createRooms([
        {
          id: roomId,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
        {
          id: roomId2,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room 2",
        },
      ]);

      // Create test memories
      const memories: Memory[] = [
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: testEntityId,
          roomId,
          content: { text: "Test memory 1" } as Content,
          createdAt: Date.now() - 1000,
          metadata: { type: "test" },
        },
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: testEntityId,
          roomId,
          content: { text: "Test memory 2" } as Content,
          createdAt: Date.now() - 500,
          metadata: { type: "test" },
        },
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: testEntityId,
          roomId: roomId2, // Different room
          content: { text: "Test memory 3" } as Content,
          createdAt: Date.now(),
          metadata: { type: "test" },
        },
      ];

      for (const memory of memories) {
        await adapter.createMemory(memory, "memories");
      }

      // Test with room filter
      const roomMemories = await adapter.getMemories({
        roomId,
        tableName: "memories",
        count: 10,
      });
      expect(roomMemories.length).toBe(2);

      // Test with count limit
      const limitedMemories = await adapter.getMemories({
        roomId,
        tableName: "memories",
        count: 1,
      });
      expect(limitedMemories.length).toBe(1);
    });

    it("should handle getMemoriesByRoomIds", async () => {
      const agentId = testAgentId;
      const roomId1 = uuidv4() as UUID;
      const roomId2 = uuidv4() as UUID;

      // Create rooms
      await adapter.createRooms([
        {
          id: roomId1,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Room 1",
        },
        {
          id: roomId2,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Room 2",
        },
      ]);
```