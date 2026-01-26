# a7046c18:packages_plugin-sql_src___tests___migration_runtime-simulation.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-simulation.test.ts:1-150
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

interface JournalRow {
  entries: unknown[];
  [key: string]: unknown;
}

interface SnapshotRow {
  snapshot: {
    tables: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface MigrationOrderRow {
  migration_order: number;
  plugin_name: string;
  created_at: string | Date;
  [key: string]: unknown;
}

import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../runtime-migrator";
import * as coreSchema from "../../schema";
import type { DrizzleDatabase } from "../../types";
import { testPolymarketSchema } from "../fixtures/test-plugin-schema";
import { createIsolatedTestDatabaseForMigration } from "../test-helpers";

describe("Runtime Simulation - Full Migration Flow", () => {
  let db: DrizzleDatabase;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    console.log("\n🚀 Simulating full runtime migration flow...\n");

    const testSetup =
      await createIsolatedTestDatabaseForMigration("runtime_simulation");
    cleanup = testSetup.cleanup;
    db = testSetup.db;
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should perform complete migration flow as in runtime", async () => {
    console.log("=".repeat(80));
    console.log("STEP 1: Initialize Migration System");
    console.log("=".repeat(80));

    // Create a fresh migrator instance (simulating runtime startup)
    migrator = new RuntimeMigrator(db);
    await migrator.initialize();

    // Verify migration infrastructure was created
    const schemasResult = await db.execute(sql`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = 'migrations'
    `);
    expect(schemasResult.rows.length).toBe(1);
    console.log("✅ Migration schema created");

    // Check migration tables
    const tablesResult = await db.execute(sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'migrations'
      ORDER BY tablename
    `);
    const migrationTables = tablesResult.rows.map((r: any) => r.tablename);
    console.log("Migration tables:", migrationTables);
    expect(migrationTables).toContain("_migrations");
    expect(migrationTables).toContain("_snapshots");
    expect(migrationTables).toContain("_journal");

    console.log(`\n${"=".repeat(80)}`);
    console.log("STEP 2: Migrate Core Schema (@elizaos/plugin-sql)");
    console.log("=".repeat(80));

    // Migrate core schema (this is what plugin-sql does on initialization)
    await migrator.migrate("@elizaos/plugin-sql", coreSchema, {
      verbose: true,
    });

    // Verify core migration was recorded
    const coreMigrationCheck = await db.execute(sql`
      SELECT * FROM migrations._migrations 
      WHERE plugin_name = '@elizaos/plugin-sql'
      ORDER BY created_at DESC
    `);

    console.log(
      `\n📋 Core migration records: ${coreMigrationCheck.rows.length}`,
    );
    expect(coreMigrationCheck.rows.length).toBe(1);

    const coreMigration = coreMigrationCheck.rows[0] as MigrationRow;
    console.log("Core migration details:");
    console.log("  - Plugin:", coreMigration.plugin_name);
    console.log("  - Hash:", coreMigration.hash);
    console.log("  - Created:", coreMigration.created_at);

    // Check snapshots for core
    const coreSnapshots = await db.execute(sql`
      SELECT * FROM migrations._snapshots 
      WHERE plugin_name = '@elizaos/plugin-sql'
      ORDER BY id DESC
    `);
    console.log(`\n📸 Core snapshots: ${coreSnapshots.rows.length}`);

    // Verify core tables in public schema
    const publicTables = await db.execute(sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    const coreTableNames = publicTables.rows.map((r: any) => r.tablename);
    console.log(`\n📦 Core tables in public schema: ${coreTableNames.length}`);
    console.log("Tables:", coreTableNames.join(", "));

    console.log(`\n${"=".repeat(80)}`);
    console.log("STEP 3: Migrate Plugin Schema (polymarket)");
    console.log("=".repeat(80));

    // Now migrate the polymarket plugin schema (simulating plugin initialization)
    await migrator.migrate("polymarket", testPolymarketSchema, {
      verbose: true,
    });

    // Verify polymarket migration was recorded
    const polymarketMigrationCheck = await db.execute(sql`
      SELECT * FROM migrations._migrations 
      WHERE plugin_name = 'polymarket'
      ORDER BY created_at DESC
    `);

    console.log(
```