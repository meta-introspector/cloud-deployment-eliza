# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_07-foreign-key-evolution.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/07-foreign-key-evolution.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import { foreignKey, pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { RuntimeMigrator } from "../../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../../runtime-migrator/types";
import { createIsolatedTestDatabaseForSchemaEvolutionTests } from "../../test-helpers";

/**
 * Schema Evolution Test 11 & 12: Foreign Key Evolution
 *
 * Tests adding foreign keys to existing data and modifying CASCADE behavior.
 * These operations can fail if there are orphaned records.
 */

describe("Schema Evolution Test: Foreign Key Evolution", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testSetup = await createIsolatedTestDatabaseForSchemaEvolutionTests(
      "schema_evolution_foreign_key_evolution_test",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    migrator = new RuntimeMigrator(db);
    await migrator.initialize();

    // Enable for tests that need it
    process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS = "true";
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should handle adding foreign keys with orphaned records", async () => {
    // V1: Tables without foreign key constraints
    const agentTableV1 = pgTable("agents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const memoryTableV1 = pgTable("memories", {
      id: uuid("id").primaryKey().defaultRandom(),
      agentId: uuid("agent_id"), // No FK constraint
      content: text("content").notNull(),
    });

    const schemaV1 = {
      agents: agentTableV1,
      memories: memoryTableV1,
    };

    console.log("📦 Creating tables without foreign keys...");
    await migrator.migrate("@elizaos/fk-test-v1", schemaV1);

    // Create valid agents
    const agent1Id = "550e8400-e29b-41d4-a716-446655440001";
    const agent2Id = "550e8400-e29b-41d4-a716-446655440002";

    await db.insert(agentTableV1).values([
      { id: agent1Id, name: "Agent 1" },
      { id: agent2Id, name: "Agent 2" },
    ]);

    // Create memories - some with valid agent IDs, some orphaned
    await db.insert(memoryTableV1).values([
      { agentId: agent1Id, content: "Memory 1 - Valid" },
      { agentId: agent2Id, content: "Memory 2 - Valid" },
      {
        agentId: "999e8400-e29b-41d4-a716-446655440999",
        content: "Memory 3 - Orphaned!",
      },
      { agentId: null, content: "Memory 4 - Null agent" },
      {
        agentId: "888e8400-e29b-41d4-a716-446655440888",
        content: "Memory 5 - Orphaned!",
      },
    ]);

    console.log("  ✅ Created 2 agents and 5 memories (2 orphaned)");

    // V2: Add foreign key constraint
    const agentTableV2 = pgTable("agents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const memoryTableV2 = pgTable("memories", {
      id: uuid("id").primaryKey().defaultRandom(),
      agentId: uuid("agent_id").references(() => agentTableV2.id, {
        onDelete: "cascade",
      }),
      content: text("content").notNull(),
    });

    const schemaV2 = {
      agents: agentTableV2,
      memories: memoryTableV2,
    };

    console.log("\n🔍 Checking foreign key addition...");
    const check = await migrator.checkMigration(
      "@elizaos/fk-test-v1",
      schemaV2,
    );

    if (check) {
      console.log("  ⚠️ Foreign key analysis:");
      if (check.warnings.length > 0) {
        check.warnings.forEach((w) => console.log(`    - ${w}`));
      }
    }

    // Try to apply - should fail due to orphaned records
    console.log("\n❌ Attempting to add FK with orphaned records...");
    let migrationError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/fk-test-v1", schemaV2);
    } catch (error) {
      migrationError = error as Error;
    }

    if (migrationError) {
      console.log("  ✅ Migration failed as expected (orphaned records)");
      console.log(`  Error: ${migrationError.message.substring(0, 100)}...`);
    }

    // Find and fix orphaned records
    console.log("\n🔧 Finding orphaned records...");
    const orphaned = await db.execute(
      sql`SELECT m.* FROM memories m 
          LEFT JOIN agents a ON m.agent_id = a.id 
          WHERE m.agent_id IS NOT NULL AND a.id IS NULL`,
    );
    console.log(`  Found ${orphaned.rows.length} orphaned memories`);

    // Clean up orphaned records
    await db.execute(
      sql`DELETE FROM memories 
          WHERE agent_id NOT IN (SELECT id FROM agents) 
          AND agent_id IS NOT NULL`,
    );
    console.log("  ✅ Deleted orphaned records");

    // Now migration should succeed
```