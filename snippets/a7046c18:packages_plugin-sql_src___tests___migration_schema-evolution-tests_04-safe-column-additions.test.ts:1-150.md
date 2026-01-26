# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_04-safe-column-additions.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/04-safe-column-additions.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
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
 * Schema Evolution Test 4 & 5: Safe Column Additions
 *
 * This test verifies that adding nullable columns and columns with defaults
 * works correctly without data loss warnings.
 */

describe("Schema Evolution Test: Safe Column Additions", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testSetup = await createIsolatedTestDatabaseForSchemaEvolutionTests(
      "schema_evolution_safe_column_additions_test",
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

  it("should add nullable columns without warnings", async () => {
    // V1: Basic agent table
    const agentTableV1 = pgTable("agents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      enabled: boolean("enabled").default(true).notNull(),
    });

    const schemaV1 = { agents: agentTableV1 };

    // Apply V1 and add data
    console.log("📦 Creating initial schema...");
    await migrator.migrate("@elizaos/safe-additions-v1", schemaV1);

    // Insert test data
    await db.insert(agentTableV1).values([
      { name: "Agent Alpha", enabled: true },
      { name: "Agent Beta", enabled: false },
    ]);

    const beforeData = await db.select().from(agentTableV1);
    console.log(`  ✅ Created ${beforeData.length} agents`);

    // V2: Add nullable columns
    const agentTableV2 = pgTable("agents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      enabled: boolean("enabled").default(true).notNull(),
      // New nullable columns - safe additions
      description: text("description"),
      avatar: text("avatar"),
      tags: text("tags").array(),
      metadata: jsonb("metadata"),
    });

    const schemaV2 = { agents: agentTableV2 };

    // Check migration - should have no warnings
    console.log("\n🔍 Checking for data loss warnings...");
    const check = await migrator.checkMigration(
      "@elizaos/safe-additions-v1",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(false);
      expect(check.warnings.length).toBe(0);
      console.log(
        "  ✅ No data loss warnings (as expected for nullable columns)",
      );
    } else {
      console.log("  ✅ No changes detected that would cause data loss");
    }

    // Apply migration - should succeed without any environment variable
    console.log("\n📦 Applying safe migration...");
    await migrator.migrate("@elizaos/safe-additions-v1", schemaV2);
    console.log("  ✅ Migration completed successfully");

    // Verify data is preserved and new columns are null
    const afterData = await db.execute(sql`SELECT * FROM agents ORDER BY name`);

    expect(afterData.rows.length).toBe(2);
    const firstAgent = afterData.rows[0] as AgentRow;
    expect(firstAgent.name).toBe("Agent Alpha");
    expect(firstAgent.description).toBeNull();
    expect(firstAgent.avatar).toBeNull();
    expect(firstAgent.tags).toBeNull();
    expect(firstAgent.metadata).toBeNull();

    console.log("\n✅ Nullable columns added successfully:");
    console.log("  - All existing data preserved");
    console.log("  - New columns are NULL for existing rows");
  });

  it("should add NOT NULL columns with defaults without warnings", async () => {
    // V1: Basic entity table
    const entityTableV1 = pgTable("entities", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const schemaV1 = { entities: entityTableV1 };

    console.log("📦 Creating initial schema...");
    await migrator.migrate("@elizaos/defaults-test-v1", schemaV1);

    // Insert test data
    await db
      .insert(entityTableV1)
      .values([
        { name: "Entity One" },
        { name: "Entity Two" },
        { name: "Entity Three" },
      ]);

    console.log("  ✅ Created 3 entities");

    // V2: Add NOT NULL columns with defaults
    const entityTableV2 = pgTable("entities", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      // New NOT NULL columns with defaults - safe because of defaults
      enabled: boolean("enabled").default(true).notNull(),
      createdAt: timestamp("created_at", { withTimezone: true })
        .default(sql`now()`)
```