# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_05-constraint-modifications.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/05-constraint-modifications.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  pgTable,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { RuntimeMigrator } from "../../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../../runtime-migrator/types";
import { createIsolatedTestDatabaseForSchemaEvolutionTests } from "../../test-helpers";

/**
 * Schema Evolution Test 6, 7, 8: Constraint Modifications
 *
 * Tests adding NOT NULL, UNIQUE, and CHECK constraints to existing data.
 * These operations can fail if existing data violates the new constraints.
 */

describe("Schema Evolution Test: Constraint Modifications", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testSetup = await createIsolatedTestDatabaseForSchemaEvolutionTests(
      "schema_evolution_constraint_modifications_test",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    migrator = new RuntimeMigrator(db);
    await migrator.initialize();

    // Enable destructive migrations for constraint tests
    process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS = "true";
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should handle adding NOT NULL to columns with NULL values", async () => {
    // V1: Table with nullable email
    const userTableV1 = pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      email: text("email"), // Nullable
    });

    const schemaV1 = { users: userTableV1 };

    console.log("📦 Creating schema with nullable email...");
    await migrator.migrate("@elizaos/not-null-test-v1", schemaV1);

    // Insert data with some NULL emails
    await db.insert(userTableV1).values([
      { name: "User 1", email: "user1@example.com" },
      { name: "User 2", email: null }, // NULL email
      { name: "User 3", email: "user3@example.com" },
      { name: "User 4", email: null }, // NULL email
    ]);

    console.log("  ✅ Created 4 users (2 with NULL emails)");

    // V2: Make email NOT NULL
    const userTableV2 = pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      email: text("email").notNull(), // Now required!
    });

    const schemaV2 = { users: userTableV2 };

    console.log("\n🔍 Checking NOT NULL constraint addition...");
    const check = await migrator.checkMigration(
      "@elizaos/not-null-test-v1",
      schemaV2,
    );

    // This should warn about potential issues
    if (check) {
      expect(check.warnings.length).toBeGreaterThan(0);
      console.log("  ⚠️ Warnings detected:");
      check.warnings.forEach((w) => console.log(`    - ${w}`));
    }

    // Try to apply migration - should fail due to NULL values
    console.log("\n❌ Attempting migration with NULL values...");
    let migrationError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/not-null-test-v1", schemaV2);
    } catch (error) {
      migrationError = error as Error;
    }

    if (migrationError) {
      console.log(
        "  ✅ Migration failed as expected (NULL values violate NOT NULL)",
      );
      console.log(`  Error: ${migrationError.message.substring(0, 100)}...`);
    }

    // Fix the data first
    console.log("\n🔧 Fixing NULL values...");
    await db.execute(
      sql`UPDATE users SET email = 'default@example.com' WHERE email IS NULL`,
    );
    console.log("  ✅ Updated NULL emails with default values");

    // Now migration should succeed
    console.log("\n📦 Retrying migration after fixing data...");
    await migrator.migrate("@elizaos/not-null-test-v1", schemaV2);
    console.log("  ✅ Migration succeeded after fixing NULL values");

    // Verify constraint is in place
    let insertError: Error | null = null;
    try {
      await db.execute(
        sql`INSERT INTO users (name, email) VALUES ('Test User', NULL)`,
      );
    } catch (error) {
      insertError = error as Error;
    }

    expect(insertError).not.toBeNull();
    console.log("  ✅ NOT NULL constraint is now enforced");
  });

  it("should handle adding UNIQUE constraints with duplicate values", async () => {
    // V1: Table without unique constraint
    const agentTableV1 = pgTable("agents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      username: text("username"),
    });

    const schemaV1 = { agents: agentTableV1 };

    console.log("📦 Creating schema without unique constraint...");
    await migrator.migrate("@elizaos/unique-test-v1", schemaV1);

    // Insert data with duplicate usernames
    await db.insert(agentTableV1).values([
      { name: "Agent 1", username: "alpha" },
```