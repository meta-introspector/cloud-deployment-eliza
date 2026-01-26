# a7046c18:packages_plugin-sql_src_schema_agent.ts:1-70

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/agent.ts:1-70
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { MessageExample } from "@elizaos/core";
import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Represents a table for storing agent data.
 *
 * @type {Table}
 */
export const agentTable = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  enabled: boolean("enabled").default(true).notNull(),
  server_id: uuid("server_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`now()`)
    .notNull(),

  // Character
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
  topics: jsonb("topics").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
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
```