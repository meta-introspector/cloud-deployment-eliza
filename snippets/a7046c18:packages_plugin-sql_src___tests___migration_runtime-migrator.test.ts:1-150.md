# a7046c18:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

// Helper types for database query result rows
interface ExistsRow {
  exists: boolean;
}

interface CountRow {
  count: string | number;
}

interface MigrationRow {
  plugin_name: string;
  idx: number;
  hash: string;
  [key: string]: unknown;
}

interface JournalRow {
  plugin_name: string;
  entries: unknown;
  [key: string]: unknown;
}

interface SnapshotRow {
  plugin_name: string;
  idx: number;
  snapshot: unknown;
  [key: string]: unknown;
}

interface ColumnRow {
  data_type: string;
  [key: string]: unknown;
}

import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../runtime-migrator";
import type { DrizzleDB } from "../../runtime-migrator/types";
import * as schema from "../../schema";
import { createIsolatedTestDatabaseForMigration } from "../test-helpers";

describe("Runtime Migrator - PostgreSQL Integration Tests", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;
  const testResults: { passed: string[]; failed: string[] } = {
    passed: [],
    failed: [],
  };

  beforeAll(async () => {
    console.log("\n🚀 Starting Runtime Migrator Tests...\n");

    const testSetup = await createIsolatedTestDatabaseForMigration(
      "runtime_migrator_tests",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    // Initialize the runtime migrator
    migrator = new RuntimeMigrator(db);

    // We're already in an isolated schema, so no cleanup needed
    console.log("🗑️  Test environment ready...");

    try {
      // Drop migrations schema if exists (in case of previous test failure)
      await db.execute(sql`DROP SCHEMA IF EXISTS migrations CASCADE`);

      console.log("✅ Test environment cleaned\n");
    } catch (error) {
      console.log("⚠️  Cleanup warning:", error);
    }
  });

  afterAll(async () => {
    // Print test summary
    console.log(`\n${"=".repeat(80)}`);
    console.log("📊 RUNTIME MIGRATOR TEST SUMMARY");
    console.log(`${"=".repeat(80)}\n`);

    console.log(`✅ PASSED (${testResults.passed.length} tests):`);
    testResults.passed.forEach((test, i) => {
      console.log(`   ${i + 1}. ${test}`);
    });

    if (testResults.failed.length > 0) {
      console.log(`\n❌ FAILED (${testResults.failed.length} tests):`);
      testResults.failed.forEach((test, i) => {
        console.log(`   ${i + 1}. ${test}`);
      });
    }

    console.log(`\n${"=".repeat(80)}\n`);

    if (cleanup) {
      await cleanup();
    }
  });

  describe("Migration System Initialization", () => {
    it("should initialize migration tables", async () => {
      await migrator.initialize();

      // Check migrations schema exists
      const schemaResult = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM information_schema.schemata 
          WHERE schema_name = 'migrations'
        ) as exists`,
      );

      const schemaExists = (schemaResult.rows[0] as ExistsRow).exists;
      expect(schemaExists).toBe(true);

      if (schemaExists) {
        testResults.passed.push("Migration schema created");
      } else {
        testResults.failed.push("Migration schema not created");
      }

      // Check all migration tables exist
      const tables = ["_migrations", "_journal", "_snapshots"];

      for (const tableName of tables) {
        const result = await db.execute(
          sql`SELECT EXISTS (
            SELECT 1 FROM pg_tables
            WHERE schemaname = 'migrations'
            AND tablename = ${tableName}
          ) as exists`,
        );

        const exists = (result.rows[0] as ExistsRow).exists;
        expect(exists).toBe(true);

        if (exists) {
          testResults.passed.push(
            `Migration table created: migrations.${tableName}`,
          );
        } else {
          testResults.failed.push(
            `Migration table missing: migrations.${tableName}`,
          );
        }
      }
    });
  });

```