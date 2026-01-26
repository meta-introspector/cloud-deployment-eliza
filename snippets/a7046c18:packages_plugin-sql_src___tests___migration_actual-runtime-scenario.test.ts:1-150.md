# a7046c18:packages_plugin-sql_src___tests___migration_actual-runtime-scenario.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/actual-runtime-scenario.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

// Helper types for database query result rows
interface MigrationRow {
  plugin_name: string;
  hash: string;
  created_at: string | Date;
  [key: string]: unknown;
}

interface SnapshotRow {
  plugin_name: string;
  count: string | number;
  [key: string]: unknown;
}

interface SchemaRow {
  schema_name: string;
  [key: string]: unknown;
}

interface TablesPerSchemaRow {
  schemaname: string;
  table_count: string | number;
  [key: string]: unknown;
}

interface TableRow {
  tablename: string;
  [key: string]: unknown;
}

interface SchemaExistsRow {
  public_exists: boolean;
  polymarket_exists: boolean;
  [key: string]: unknown;
}

import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../runtime-migrator";
import * as coreSchema from "../../schema";
import type { DrizzleDatabase } from "../../types";
import { testPolymarketSchema } from "../fixtures/test-plugin-schema";
import { createIsolatedTestDatabaseForMigration } from "../test-helpers";

describe("Actual Runtime Scenario - Plugin Loading Simulation", () => {
  let db: DrizzleDatabase;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    console.log("\n🚀 Simulating actual runtime plugin loading scenario...\n");

    const testSetup =
      await createIsolatedTestDatabaseForMigration("actual_runtime");
    cleanup = testSetup.cleanup;
    db = testSetup.db;
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should handle plugin migrations as they would be loaded at runtime", async () => {
    console.log("=".repeat(80));
    console.log("SCENARIO: Application Startup");
    console.log("=".repeat(80));

    // Step 1: Application starts and initializes the database adapter (plugin-sql)
    console.log("\n📦 Step 1: Loading plugin-sql (database adapter)...");

    // This is what happens in plugin-sql's initialization
    const sqlPluginMigrator = new RuntimeMigrator(db);
    await sqlPluginMigrator.initialize();

    // Plugin-sql migrates its own schema
    await sqlPluginMigrator.migrate("@elizaos/plugin-sql", coreSchema, {
      verbose: false,
    });

    console.log("✅ plugin-sql loaded and migrated");

    // Check migration state after plugin-sql
    const afterSqlPlugin = await db.execute(sql`
      SELECT plugin_name, hash, created_at 
      FROM migrations._migrations 
      ORDER BY created_at ASC
    `);
    console.log(
      `\n📊 Migrations after plugin-sql: ${afterSqlPlugin.rows.length}`,
    );
    for (const m of afterSqlPlugin.rows as MigrationRow[]) {
      console.log(`  - ${m.plugin_name}`);
    }

    // Step 2: Application loads other plugins (polymarket)
    console.log("\n📦 Step 2: Loading polymarket plugin...");

    // This is what would happen in polymarket plugin's initialization
    // IMPORTANT: In real runtime, would polymarket create its own migrator instance?
    // Or would it use a shared one? Let's test both scenarios.

    console.log(
      "\n--- Testing Scenario A: Polymarket creates its own migrator ---",
    );
    const polymarketMigrator = new RuntimeMigrator(db);
    // Note: initialize() is idempotent, so it should detect existing migration tables
    await polymarketMigrator.initialize();

    await polymarketMigrator.migrate("polymarket", testPolymarketSchema, {
      verbose: false,
    });

    console.log("✅ polymarket loaded and migrated (own migrator)");

    // Check migration state after polymarket
    const afterPolymarket = await db.execute(sql`
      SELECT plugin_name, hash, created_at 
      FROM migrations._migrations 
      ORDER BY created_at ASC
    `);
    console.log(
      `\n📊 Migrations after polymarket: ${afterPolymarket.rows.length}`,
    );
    for (const m of afterPolymarket.rows as MigrationRow[]) {
      console.log(`  - ${m.plugin_name}`);
    }

    expect(afterPolymarket.rows.length).toBe(2);

    // Step 3: Simulate app restart - what happens?
    console.log(`\n${"=".repeat(80)}`);
    console.log("SCENARIO: Application Restart");
    console.log("=".repeat(80));

    console.log("\n🔄 Simulating application restart...");

    // Create new migrator instances (as would happen on restart)
    const sqlPluginMigrator2 = new RuntimeMigrator(db);
    await sqlPluginMigrator2.initialize();

    // Plugin-sql tries to migrate again
    await sqlPluginMigrator2.migrate("@elizaos/plugin-sql", coreSchema, {
      verbose: false,
    });

    const polymarketMigrator2 = new RuntimeMigrator(db);
    await polymarketMigrator2.initialize();

```