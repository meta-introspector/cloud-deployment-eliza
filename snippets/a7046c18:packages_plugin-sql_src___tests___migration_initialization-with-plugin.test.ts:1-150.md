# a7046c18:packages_plugin-sql_src___tests___migration_initialization-with-plugin.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization-with-plugin.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

// Helper type for database query result rows
interface MigrationRow {
  plugin_name: string;
  hash: string;
  [key: string]: unknown;
}

import type { UUID } from "@elizaos/core";
import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../runtime-migrator";
import * as coreSchema from "../../schema";
import type { DrizzleDatabase } from "../../types";
import { testPolymarketSchema } from "../fixtures/test-plugin-schema";
import { createIsolatedTestDatabaseForMigration } from "../test-helpers";

describe("Runtime Migrator - Core + Plugin Schema Tests", () => {
  let db: DrizzleDatabase;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;

  beforeAll(async () => {
    console.log(
      "\n🚀 Testing Runtime Migrator with Core + Plugin Schemas...\n",
    );

    const testSetup = await createIsolatedTestDatabaseForMigration(
      "plugin_schema_tests",
    );
    cleanup = testSetup.cleanup;
    testAgentId = testSetup.testAgentId;
    db = testSetup.db;

    // Create a new migrator for testing
    migrator = new RuntimeMigrator(db);

    // Initialize migration infrastructure
    await migrator.initialize();
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Core Schema Migration", () => {
    it("should migrate core schema to public schema", async () => {
      console.log("\n📦 Migrating core schema (@elizaos/plugin-sql)...\n");

      await migrator.migrate("@elizaos/plugin-sql", coreSchema, {
        verbose: true,
      });

      // Verify core tables were created in public schema
      const tablesResult = await db.execute(
        sql.raw(`SELECT tablename FROM pg_tables 
                 WHERE schemaname = 'public' 
                 ORDER BY tablename`),
      );

      const createdTables = tablesResult.rows.map((r: any) => r.tablename);
      console.log("Core tables created in public schema:", createdTables);

      const expectedCoreTables = [
        "agents",
        "cache",
        "memories",
        "participants",
        "relationships",
        "rooms",
        "tasks",
      ];

      for (const table of expectedCoreTables) {
        expect(createdTables).toContain(table);
      }
    });

    it("should track core migration in _migrations table", async () => {
      const result = await db.execute(
        sql.raw(`SELECT * FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/plugin-sql'
                 ORDER BY created_at DESC
                 LIMIT 1`),
      );

      expect(result.rows.length).toBeGreaterThan(0);
      const migration = result.rows[0] as MigrationRow;
      expect(migration.plugin_name).toBe("@elizaos/plugin-sql");
      expect(migration.hash).toBeDefined();
    });
  });

  describe("Plugin Schema Migration", () => {
    it("should migrate plugin schema to polymarket schema namespace", async () => {
      console.log("\n🔌 Migrating polymarket plugin schema...\n");

      await migrator.migrate("polymarket", testPolymarketSchema, {
        verbose: true,
      });

      // Check if polymarket schema was created
      const schemaResult = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT 1 FROM information_schema.schemata 
          WHERE schema_name = 'polymarket'
        )`),
      );

      expect(schemaResult.rows[0]?.exists).toBe(true);
      console.log("✅ Polymarket schema created");
    });

    it("should create plugin tables in polymarket schema", async () => {
      // Verify plugin tables were created in polymarket schema
      const tablesResult = await db.execute(
        sql.raw(`SELECT tablename FROM pg_tables 
                 WHERE schemaname = 'polymarket' 
                 ORDER BY tablename`),
      );

      const createdTables = tablesResult.rows.map((r: any) => r.tablename);
      console.log("Plugin tables created in polymarket schema:", createdTables);

      const expectedPluginTables = [
        "markets",
        "tokens",
        "rewards",
        "prices",
        "sync_status",
      ];

      for (const table of expectedPluginTables) {
        expect(createdTables).toContain(table);
      }
    });

    it("should verify no plugin tables in public schema", async () => {
      // Ensure plugin tables are NOT in public schema
      const publicTablesResult = await db.execute(
        sql.raw(`SELECT tablename FROM pg_tables 
                 WHERE schemaname = 'public' 
                 AND tablename LIKE 'polymarket_%'`),
      );

      expect(publicTablesResult.rows.length).toBe(0);
      console.log("✅ No polymarket tables in public schema");
```