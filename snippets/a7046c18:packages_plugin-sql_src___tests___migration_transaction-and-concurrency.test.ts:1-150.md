# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:1-150
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
import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { RuntimeMigrator } from "../../runtime-migrator";
import type { DrizzleDatabase } from "../../types";
import { createIsolatedTestDatabaseForMigration } from "../test-helpers";

describe("Runtime Migrator - Transaction Support & Concurrency Tests", () => {
  let db: DrizzleDatabase;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeAll(async () => {
    console.log(
      "\n🔒 Testing Transaction Support and Concurrent Migration Handling...\n",
    );

    const testSetup = await createIsolatedTestDatabaseForMigration(
      "transaction_concurrency_tests",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    migrator = new RuntimeMigrator(db);
    await migrator.initialize();
  });

  beforeEach(async () => {
    // Clean up test tables before each test
    const testTables = [
      "test_transaction_success",
      "test_transaction_fail_1",
      "test_transaction_fail_2",
      "test_partial_migration",
      "test_should_rollback",
      "test_rollback_scenario",
      "test_concurrent_1",
      "test_concurrent_2",
      "test_concurrent_3",
      "test_concurrent_4",
      "test_lock_table",
      "test_race_condition",
      "test_deadlock_a",
      "test_deadlock_b",
      "test_parallel_1",
      "test_parallel_2",
    ];

    for (const table of testTables) {
      try {
        await db.execute(sql.raw(`DROP TABLE IF EXISTS ${table} CASCADE`));
      } catch {
        // Ignore errors
      }
    }

    // Clean up test migration records
    try {
      await db.execute(
        sql.raw(`
        DELETE FROM migrations._migrations 
        WHERE plugin_name LIKE '%transaction-test%' 
           OR plugin_name LIKE '%concurrent-test%'
      `),
      );
      await db.execute(
        sql.raw(`
        DELETE FROM migrations._journal 
        WHERE plugin_name LIKE '%transaction-test%'
           OR plugin_name LIKE '%concurrent-test%'
      `),
      );
      await db.execute(
        sql.raw(`
        DELETE FROM migrations._snapshots 
        WHERE plugin_name LIKE '%transaction-test%'
           OR plugin_name LIKE '%concurrent-test%'
      `),
      );
    } catch {
      // Ignore errors
    }
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Transaction Atomicity", () => {
    it("should commit all changes when migration succeeds", async () => {
      const validSchema = {
        testTable: pgTable("test_transaction_success", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
          created_at: timestamp("created_at").defaultNow(),
        }),
      };

      await migrator.migrate("@elizaos/transaction-test-success", validSchema);

      // Verify table was created
      const tableExists = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'test_transaction_success'
        )`),
      );

      expect(tableExists.rows[0]?.exists).toBe(true);

      // Verify migration was recorded
      const migrationRecorded = await db.execute(
        sql.raw(`SELECT COUNT(*) as count
                 FROM migrations._migrations
                 WHERE plugin_name = '@elizaos/transaction-test-success'`),
      );

      expect(
        parseInt(String((migrationRecorded.rows[0] as CountRow).count), 10),
      ).toBe(1);

      // Verify journal was recorded
      const journalRecorded = await db.execute(
        sql.raw(`SELECT COUNT(*) as count
                 FROM migrations._journal
                 WHERE plugin_name = '@elizaos/transaction-test-success'`),
      );

      expect(
        parseInt(String((journalRecorded.rows[0] as CountRow).count), 10),
      ).toBe(1);
    });

    it("should rollback all changes when migration fails", async () => {
      // Mock a failure by providing an invalid schema that will cause SQL errors
      const failingSchema = {
        testTable1: pgTable("test_partial_migration", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
        }),
```