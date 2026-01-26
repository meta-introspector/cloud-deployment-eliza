# a7046c18:packages_plugin-sql_src___tests___migration_initialization.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization.test.ts:1-150
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

import type { UUID } from "@elizaos/core";
import { sql } from "drizzle-orm";
import { RuntimeMigrator } from "../../runtime-migrator";
import * as originalSchema from "../../schema";
import type { DrizzleDatabase } from "../../types";
import { createIsolatedTestDatabaseForMigration } from "../test-helpers";

describe("Runtime Migrator - Initialization Tests", () => {
  let db: DrizzleDatabase;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;
  let _testAgentId: UUID;

  beforeAll(async () => {
    console.log("\n🚀 Testing Runtime Migrator Initialization...\n");

    const testSetup = await createIsolatedTestDatabaseForMigration(
      "initialization_tests",
    );
    cleanup = testSetup.cleanup;
    _testAgentId = testSetup.testAgentId;
    db = testSetup.db;

    // Create a new migrator for testing (don't initialize yet as tests will do that)
    migrator = new RuntimeMigrator(db);
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Migration Infrastructure Setup", () => {
    it("should initialize migration schema and tables", async () => {
      // Initialize the migrator - this creates the migration infrastructure
      await migrator.initialize();

      // Check migrations schema exists
      const schemaResult = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT 1 FROM information_schema.schemata 
          WHERE schema_name = 'migrations'
        )`),
      );

      expect(schemaResult.rows[0]?.exists).toBe(true);
    });

    it("should create all required migration tables", async () => {
      const expectedTables = ["_migrations", "_journal", "_snapshots"];

      for (const tableName of expectedTables) {
        const result = await db.execute(
          sql.raw(`SELECT EXISTS (
            SELECT 1 FROM pg_tables
            WHERE schemaname = 'migrations'
            AND tablename = '${tableName}'
          )`),
        );

        expect(result.rows[0]?.exists).toBe(true);
      }
    });

    it("should create migration tables with correct structure", async () => {
      // Check _migrations table structure
      const migrationsColumns = await db.execute(
        sql.raw(`SELECT column_name, data_type, is_nullable
                 FROM information_schema.columns
                 WHERE table_schema = 'migrations'
                 AND table_name = '_migrations'
                 ORDER BY ordinal_position`),
      );

      const columnNames = migrationsColumns.rows.map((r: any) => r.column_name);
      expect(columnNames).toContain("id");
      expect(columnNames).toContain("plugin_name");
      expect(columnNames).toContain("hash");
      expect(columnNames).toContain("created_at");

      // Check _journal table structure
      const journalColumns = await db.execute(
        sql.raw(`SELECT column_name, data_type
                 FROM information_schema.columns
                 WHERE table_schema = 'migrations'
                 AND table_name = '_journal'`),
      );

      const journalColumnNames = journalColumns.rows.map(
        (r: any) => r.column_name,
      );
      expect(journalColumnNames).toContain("plugin_name");
      expect(journalColumnNames).toContain("entries");

      // Check _snapshots table structure
      const snapshotColumns = await db.execute(
        sql.raw(`SELECT column_name, data_type
                 FROM information_schema.columns
                 WHERE table_schema = 'migrations'
                 AND table_name = '_snapshots'`),
      );

      const snapshotColumnNames = snapshotColumns.rows.map(
        (r: any) => r.column_name,
      );
      expect(snapshotColumnNames).toContain("plugin_name");
      expect(snapshotColumnNames).toContain("snapshot");
      expect(snapshotColumnNames).toContain("idx");
    });
  });

  describe("Basic Migration Execution", () => {
    it("should run initial schema migration successfully", async () => {
      await migrator.migrate("@elizaos/plugin-sql", originalSchema, {
        verbose: true,
      });

      // Verify tables were created
      const tablesResult = await db.execute(
        sql.raw(`SELECT tablename FROM pg_tables 
                 WHERE schemaname = 'public' 
                 ORDER BY tablename`),
      );

      const createdTables = tablesResult.rows.map((r: any) => r.tablename);

```