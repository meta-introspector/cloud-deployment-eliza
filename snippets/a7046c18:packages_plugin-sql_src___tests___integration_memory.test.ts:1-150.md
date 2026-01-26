# a7046c18:packages_plugin-sql_src___tests___integration_memory.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/memory.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";
import {
  ChannelType,
  type Content,
  type Entity,
  type Memory,
  type MemoryMetadata,
  MemoryType,
  type Room,
  type UUID,
  type World,
} from "@elizaos/core";
import { v4 } from "uuid";
import type { PgDatabaseAdapter } from "../../pg/adapter";
import type { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { embeddingTable, memoryTable } from "../../schema";
import { createIsolatedTestDatabase } from "../test-helpers";
import {
  documentMemoryId,
  memoryTestAgentId,
  memoryTestDocument,
  memoryTestFragments,
  memoryTestMemories,
  memoryTestMemoriesWithEmbedding,
} from "./seed";

describe("Memory Integration Tests", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;
  let testRoomId: UUID;
  let testEntityId: UUID;
  let testWorldId: UUID;

  beforeAll(async () => {
    try {
      const setup = await createIsolatedTestDatabase("memory_tests");
      adapter = setup.adapter;
      cleanup = setup.cleanup;
      testAgentId = setup.testAgentId;

      // Use random UUIDs to avoid conflicts
      testRoomId = v4() as UUID;
      testEntityId = v4() as UUID;
      testWorldId = v4() as UUID;

      await adapter.createWorld({
        id: testWorldId,
        agentId: testAgentId,
        name: "Test World",
        serverId: "test-server",
      } as World);
      await adapter.createRooms([
        {
          id: testRoomId,
          agentId: testAgentId,
          worldId: testWorldId,
          name: "Test Room",
          source: "test",
          type: ChannelType.GROUP,
        } as Room,
      ]);
      await adapter.createEntities([
        {
          id: testEntityId,
          agentId: testAgentId,
          names: ["Test Entity"],
        } as Entity,
      ]);
      await adapter.addParticipant(testEntityId, testRoomId);
    } catch (error) {
      console.error("Failed to create test database for memory tests:", error);
      throw error; // Fail the test instead of continuing
    }
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  beforeEach(async () => {
    // Clean up memories and embeddings before each test
    const db = adapter.getDatabase();
    // Delete embeddings first due to foreign key constraints
    await db.delete(embeddingTable);
    await db.delete(memoryTable);
  });

  const createTestMemory = (
    content: Record<string, any>,
    embedding?: number[],
  ): Memory & { metadata: MemoryMetadata } => ({
    id: v4() as UUID,
    agentId: testAgentId,
    roomId: testRoomId,
    entityId: testEntityId,
    content,
    embedding,
    createdAt: Date.now(),
    unique: false,
    metadata: {
      type: MemoryType.CUSTOM,
      source: "test",
    },
  });

  it("should create and retrieve a memory with an embedding", async () => {
    const memory = createTestMemory(
      { text: "test" },
      Array.from({ length: 384 }, () => Math.random()),
    );
    const memoryId = await adapter.createMemory(memory, "test");
    const retrieved = await adapter.getMemoryById(memoryId);
    expect(retrieved).toBeDefined();
    expect(retrieved?.embedding?.length).toEqual(384);
  });

  afterEach(async () => {
    // Clean up memories after each test to ensure isolation
    const db = adapter.getDatabase();
    // Delete in correct order to avoid foreign key constraint violations
    await db.delete(embeddingTable);
    await db.delete(memoryTable);
  });

  describe("Memory CRUD Operations", () => {
    it("should create a simple memory without embedding", async () => {
      const memory = createTestMemory({ text: "simple memory" });
      const memoryId = await adapter.createMemory(memory, "memories");
      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.content).toEqual({ text: "simple memory" });
    });

    it("should update an existing memory", async () => {
      const memory = createTestMemory({ text: "original" });
      const memoryId = await adapter.createMemory(memory, "memories");
      await adapter.updateMemory({
        id: memoryId,
        content: { text: "updated" },
```