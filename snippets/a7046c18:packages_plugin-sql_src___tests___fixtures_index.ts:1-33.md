# a7046c18:packages_plugin-sql_src___tests___fixtures_index.ts:1-33

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/fixtures/index.ts:1-33
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Character, Plugin } from "@elizaos/core";
import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const mockCharacter: Character = {
  name: "Test Agent",
  bio: ["A test agent for running tests."],
};

export const helloWorldSchema = {
  helloWorldTable: pgTable("hello_world", {
    id: uuid("id").primaryKey().defaultRandom(),
    message: varchar("message", { length: 255 }).notNull(),
    author: varchar("author", { length: 100 }),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  }),
  greetingsTable: pgTable("greetings", {
    id: uuid("id").primaryKey().defaultRandom(),
    greeting: varchar("greeting", { length: 100 }).notNull(),
    language: varchar("language", { length: 20 }).default("en").notNull(),
    isActive: varchar("is_active", { length: 10 }).default("true").notNull(),
    updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  }),
};

export const helloWorldPlugin: Plugin = {
  name: "test-hello-world",
  description: "A simple test plugin with a database schema.",
  schema: helloWorldSchema,
  init: async (_runtime) => {
    console.log("Hello World Plugin initialized!");
  },
};
```