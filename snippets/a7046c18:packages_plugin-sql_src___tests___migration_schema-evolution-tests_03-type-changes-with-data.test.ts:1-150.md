# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_03-type-changes-with-data.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/03-type-changes-with-data.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { RuntimeMigrator } from "../../../runtime-migrator/runtime-migrator";
import type { DrizzleDB } from "../../../runtime-migrator/types";
import { createIsolatedTestDatabaseForSchemaEvolutionTests } from "../../test-helpers";

/**
 * Schema Evolution Test 3: Type Changes with Incompatible Data
 *
 * This test verifies handling of column type changes that could
 * cause data loss, conversion errors, or precision loss.
 */

describe("Schema Evolution Test: Type Changes with Data", () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testSetup = await createIsolatedTestDatabaseForSchemaEvolutionTests(
      "schema_evolution_type_changes_test",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    migrator = new RuntimeMigrator(db);
    await migrator.initialize();

    // Set environment variable for tests since they all test destructive operations
    process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS = "true";
  });

  afterEach(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  it("should handle JSONB to text conversion with complex data", async () => {
    // V1: JSONB columns storing complex nested data
    const memoryTableV1 = pgTable("memories", {
      id: uuid("id").primaryKey().notNull(),
      content: jsonb("content").notNull(),
      metadata: jsonb("metadata").default({}).notNull(),
      settings: jsonb("settings"),
    });

    const schemaV1 = { memories: memoryTableV1 };

    await migrator.migrate("@elizaos/schema-evolution-test-types-v1", schemaV1);

    // Insert complex JSON data
    await db.insert(memoryTableV1).values([
      {
        id: "110e8400-e29b-41d4-a716-446655440001",
        content: {
          text: "Complex memory",
          nested: {
            level1: {
              level2: {
                data: ["array", "of", "values"],
                number: 42,
              },
            },
          },
          tags: ["important", "conversation", "technical"],
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: 2,
          flags: {
            processed: true,
            archived: false,
          },
        },
        settings: {
          visibility: "private",
          retention: 30,
          notifications: {
            email: true,
            push: false,
          },
        },
      },
      {
        id: "110e8400-e29b-41d4-a716-446655440002",
        content: {
          simple: "Another memory",
          score: 0.95,
        },
        metadata: {
          source: "chat",
          confidence: 0.8,
        },
        settings: null,
      },
    ]);

    const beforeData = await db.select().from(memoryTableV1);
    console.log("Data before type change:");
    console.log(
      `  - ${beforeData.length} records with complex JSON structures`,
    );
    console.log(`  - Sample content type: ${typeof beforeData[0].content}`);
    console.log(
      `  - Content keys: ${Object.keys(beforeData[0].content as ContentObject).join(", ")}`,
    );

    // V2: Change JSONB to text (lossy conversion!)
    const memoryTableV2 = pgTable("memories", {
      id: uuid("id").primaryKey().notNull(),
      content: text("content").notNull(), // JSONB → text
      metadata: text("metadata").notNull(), // JSONB → text
      settings: text("settings"), // JSONB → text (nullable)
    });

    const schemaV2 = { memories: memoryTableV2 };

    // Check migration warnings
    const check = await migrator.checkMigration(
      "@elizaos/schema-evolution-test-types-v1",
      schemaV2,
    );

    expect(check).toBeDefined();
    expect(check?.warnings.length).toBeGreaterThan(0);

    console.log("\n⚠️  Type Conversion Warnings:");
    check?.warnings.forEach((warning) => {
      console.log(`  • ${warning}`);
    });

    // Migration allowed because ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS is set in beforeEach
    await migrator.migrate("@elizaos/schema-evolution-test-types-v1", schemaV2);

    // Check converted data
    const afterData = await db.select().from(memoryTableV2);

    console.log("\n📊 After type conversion:");
    console.log(`  - Content is now: ${typeof afterData[0].content}`);
    console.log(
      `  - First 100 chars: ${(afterData[0].content as string).substring(0, 100)}...`,
    );
```