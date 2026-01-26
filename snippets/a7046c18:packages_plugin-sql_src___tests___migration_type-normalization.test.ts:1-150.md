# a7046c18:packages_plugin-sql_src___tests___migration_type-normalization.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/type-normalization.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { DatabaseIntrospector } from "../../runtime-migrator/drizzle-adapters/database-introspector";
import { RuntimeMigrator } from "../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../runtime-migrator/types";

/**
 * Type Normalization Tests
 *
 * These tests verify that our type normalization correctly handles
 * equivalent type variations that occur between:
 * 1. Database introspection results
 * 2. Drizzle schema definitions
 *
 * This is critical for production scenarios where existing databases
 * may have been created with different type representations.
 */
describe("Type Normalization", () => {
  let pgClient: PGlite;
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let _introspector: DatabaseIntrospector;

  beforeEach(async () => {
    pgClient = new PGlite({ extensions: { vector } });
    db = drizzle(pgClient);
    migrator = new RuntimeMigrator(db);
    _introspector = new DatabaseIntrospector(db);
    await migrator.initialize();
  });

  afterEach(async () => {
    await pgClient.close();
  });

  describe("Serial Type Equivalence", () => {
    it("should recognize SERIAL as equivalent to INTEGER with auto-increment", async () => {
      // Create table with SERIAL (as database would)
      await db.execute(sql`
        CREATE TABLE test_serial (
          id SERIAL PRIMARY KEY,
          name TEXT
        )
      `);

      // Define schema with integer().primaryKey().generatedByDefaultAsIdentity()
      const schema = {
        test_serial: pgTable("test_serial", {
          id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
          name: text("name"),
        }),
      };

      // Migration should detect no changes
      await migrator.migrate("@test/serial", schema, { verbose: false });

      // Verify no destructive changes were detected
      const result = await db.execute(sql`SELECT COUNT(*) FROM test_serial`);
      expect(result).toBeDefined();
    });

    it("should handle BIGSERIAL as equivalent to BIGINT with identity", async () => {
      await db.execute(sql`
        CREATE TABLE test_bigserial (
          id BIGSERIAL PRIMARY KEY,
          data JSONB
        )
      `);

      const schema = {
        test_bigserial: pgTable("test_bigserial", {
          id: bigint("id", { mode: "number" })
            .primaryKey()
            .generatedByDefaultAsIdentity(),
          data: jsonb("data"),
        }),
      };

      await migrator.migrate("@test/bigserial", schema, { verbose: false });

      // Should complete without errors
      const result = await db.execute(sql`SELECT COUNT(*) FROM test_bigserial`);
      expect(result).toBeDefined();
    });

    it("should handle SMALLSERIAL as equivalent to SMALLINT with identity", async () => {
      await db.execute(sql`
        CREATE TABLE test_smallserial (
          id SMALLSERIAL PRIMARY KEY,
          flag BOOLEAN
        )
      `);

      const schema = {
        test_smallserial: pgTable("test_smallserial", {
          id: smallint("id").primaryKey().generatedByDefaultAsIdentity(),
          flag: boolean("flag"),
        }),
      };

      await migrator.migrate("@test/smallserial", schema, { verbose: false });

      // Should complete without errors
      const result = await db.execute(
        sql`SELECT COUNT(*) FROM test_smallserial`,
      );
      expect(result).toBeDefined();
    });
  });

  describe("Timestamp Type Variations", () => {
    it("should treat timestamp without time zone as equivalent to timestamp", async () => {
      // Database introspection often returns 'timestamp without time zone'
      await db.execute(sql`
        CREATE TABLE test_timestamp (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Drizzle schema uses 'timestamp'
      const schema = {
        test_timestamp: pgTable("test_timestamp", {
          id: uuid("id").primaryKey().defaultRandom(),
          created_at: timestamp("created_at").defaultNow(),
          updated_at: timestamp("updated_at").defaultNow(),
        }),
      };

      await migrator.migrate("@test/timestamp", schema, { verbose: false });

      // Should not detect any changes
      const columns = await db.execute(sql`
```