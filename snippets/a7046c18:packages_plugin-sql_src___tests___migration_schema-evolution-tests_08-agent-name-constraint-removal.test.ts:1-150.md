# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_08-agent-name-constraint-removal.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/08-agent-name-constraint-removal.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
import type { MessageExample } from "@elizaos/core";
import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { v4 as uuidv4 } from "uuid";

/**
 * Test suite for agent table schema migration:
 * From: agent table WITH unique name constraint
 * To: agent table WITHOUT unique name constraint
 *
 * This verifies that existing databases can migrate correctly to support
 * multiple agents with the same name (UUID-based identification only).
 */
describe("Schema Evolution: Agent Name Constraint Removal", () => {
  let client: PGlite;
  let db: ReturnType<typeof drizzle>;

  // Define the OLD schema with unique name constraint
  const _oldAgentTable = pgTable(
    "agents_old_schema",
    {
      id: uuid("id").primaryKey().defaultRandom(),
      enabled: boolean("enabled").default(true).notNull(),
      createdAt: timestamp("created_at", { withTimezone: true })
        .default(sql`now()`)
        .notNull(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
        .default(sql`now()`)
        .notNull(),
      name: text("name").notNull(),
      username: text("username"),
      system: text("system").default(""),
      bio: jsonb("bio").$type<string | string[]>().default(sql`'[]'::jsonb`),
      messageExamples: jsonb("message_examples")
        .$type<MessageExample[][]>()
        .default(sql`'[]'::jsonb`)
        .notNull(),
      postExamples: jsonb("post_examples")
        .$type<string[]>()
        .default(sql`'[]'::jsonb`)
        .notNull(),
      topics: jsonb("topics")
        .$type<string[]>()
        .default(sql`'[]'::jsonb`)
        .notNull(),
      adjectives: jsonb("adjectives")
        .$type<string[]>()
        .default(sql`'[]'::jsonb`)
        .notNull(),
      knowledge: jsonb("knowledge")
        .$type<(string | { path: string; shared?: boolean })[]>()
        .default(sql`'[]'::jsonb`)
        .notNull(),
      plugins: jsonb("plugins")
        .$type<string[]>()
        .default(sql`'[]'::jsonb`)
        .notNull(),
      settings: jsonb("settings")
        .$type<{
          secrets?: { [key: string]: string | boolean | number };
          [key: string]: unknown;
        }>()
        .default(sql`'{}'::jsonb`)
        .notNull(),
      style: jsonb("style")
        .$type<{
          all?: string[];
          chat?: string[];
          post?: string[];
        }>()
        .default(sql`'{}'::jsonb`)
        .notNull(),
    },
    (table) => {
      return {
        nameUnique: unique("name_unique_old").on(table.name),
      };
    },
  );

  // Define the NEW schema without unique name constraint
  const _newAgentTable = pgTable("agents_new_schema", {
    id: uuid("id").primaryKey().defaultRandom(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    name: text("name").notNull(),
    username: text("username"),
    system: text("system").default(""),
    bio: jsonb("bio").$type<string | string[]>().default(sql`'[]'::jsonb`),
    messageExamples: jsonb("message_examples")
      .$type<MessageExample[][]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    postExamples: jsonb("post_examples")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    topics: jsonb("topics")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    adjectives: jsonb("adjectives")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    knowledge: jsonb("knowledge")
      .$type<(string | { path: string; shared?: boolean })[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    plugins: jsonb("plugins")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    settings: jsonb("settings")
      .$type<{
        secrets?: { [key: string]: string | boolean | number };
        [key: string]: unknown;
      }>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    style: jsonb("style")
      .$type<{
        all?: string[];
        chat?: string[];
        post?: string[];
      }>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
  });

  beforeEach(async () => {
    // Create a fresh PGlite instance for each test
    client = new PGlite();
    db = drizzle(client);
```