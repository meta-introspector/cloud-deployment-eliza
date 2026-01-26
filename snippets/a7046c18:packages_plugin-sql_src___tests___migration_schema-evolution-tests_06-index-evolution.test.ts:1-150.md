# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_06-index-evolution.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/06-index-evolution.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { RuntimeMigrator } from "../../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../../runtime-migrator/types";
import { createIsolatedTestDatabaseForSchemaEvolutionTests } from "../../test-helpers";

/**
 * Schema Evolution Test 9 & 10: Index Evolution
 *
 * Tests adding, dropping, and recreating various types of indexes.
 * Index operations are generally safe as they don't affect data.
 */

describe("Schema Evolution Test: Index Evolution", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testSetup = await createIsolatedTestDatabaseForSchemaEvolutionTests(
      "schema_evolution_index_evolution_test",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    migrator = new RuntimeMigrator(db);
    await migrator.initialize();
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should add various types of indexes without warnings", async () => {
    // V1: Table without indexes
    const memoryTableV1 = pgTable("memories", {
      id: uuid("id").primaryKey().defaultRandom(),
      type: text("type").notNull(),
      roomId: uuid("room_id"),
      agentId: uuid("agent_id"),
      entityId: uuid("entity_id"),
      content: jsonb("content").notNull(),
      metadata: jsonb("metadata").default({}).notNull(),
      createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    });

    const schemaV1 = { memories: memoryTableV1 };

    console.log("📦 Creating table without indexes...");
    await migrator.migrate("@elizaos/index-test-v1", schemaV1);

    // Insert sample data
    await db.insert(memoryTableV1).values([
      {
        type: "conversation",
        roomId: "550e8400-e29b-41d4-a716-446655440001",
        agentId: "660e8400-e29b-41d4-a716-446655440001",
        content: { text: "Hello world" },
        metadata: { type: "fragment", documentId: "doc1", position: 1 },
      },
      {
        type: "fact",
        roomId: "550e8400-e29b-41d4-a716-446655440001",
        agentId: "660e8400-e29b-41d4-a716-446655440001",
        content: { text: "Important fact" },
        metadata: { type: "document", documentId: "doc2", position: 2 },
      },
      {
        type: "analysis",
        roomId: "550e8400-e29b-41d4-a716-446655440002",
        agentId: "660e8400-e29b-41d4-a716-446655440002",
        content: { text: "Data analysis result" },
        metadata: { type: "result", confidence: 0.95 },
      },
    ]);

    console.log("  ✅ Created test data");

    // V2: Add multiple index types
    const memoryTableV2 = pgTable(
      "memories",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        type: text("type").notNull(),
        roomId: uuid("room_id"),
        agentId: uuid("agent_id"),
        entityId: uuid("entity_id"),
        content: jsonb("content").notNull(),
        metadata: jsonb("metadata").default({}).notNull(),
        createdAt: timestamp("created_at").default(sql`now()`).notNull(),
      },
      (table) => [
        // Simple single column index
        index("idx_memories_type").on(table.type),

        // Composite index (multiple columns)
        index("idx_memories_type_room").on(table.type, table.roomId),

        // Index on nullable column
        index("idx_memories_entity").on(table.entityId),

        // Index on timestamp
        index("idx_memories_created").on(table.createdAt),

        // Expression index on JSONB field
        index("idx_memories_metadata_type").on(sql`(metadata->>'type')`),

        // Multi-column expression index for fragments
        index("idx_fragments_order").on(
          sql`(metadata->>'documentId')`,
          sql`((metadata->>'position')::int)`,
        ),

        // Partial index with WHERE clause
        index("idx_conversation_memories")
          .on(table.type, table.agentId)
          .where(sql`type = 'conversation'`),
      ],
    );

    const schemaV2 = { memories: memoryTableV2 };

    console.log("\n🔍 Checking index additions...");
    const check = await migrator.checkMigration(
      "@elizaos/index-test-v1",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(false);
      console.log("  ✅ No data loss warnings for index creation");
    }

    console.log("\n📦 Adding indexes...");
    await migrator.migrate("@elizaos/index-test-v1", schemaV2);
    console.log("  ✅ All indexes created successfully");

    // Verify indexes were created
    const indexes = await db.execute(
      sql`SELECT indexname, indexdef 
```