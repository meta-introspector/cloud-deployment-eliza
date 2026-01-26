# a7046c18:packages_plugin-sql_src___tests___fixtures_hello-world-plugin.ts:1-40

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/fixtures/hello-world-plugin.ts:1-40
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Plugin } from "@elizaos/core";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Define the hello world table schema
export const helloWorldTable = pgTable("hello_world", {
  id: uuid("id").defaultRandom().primaryKey(),
  message: varchar("message", { length: 255 }).notNull(),
  author: varchar("author", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define another test table to verify multiple tables work
export const greetingsTable = pgTable("greetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  greeting: varchar("greeting", { length: 100 }).notNull(),
  language: varchar("language", { length: 20 }).notNull().default("en"),
  isActive: varchar("is_active", { length: 10 }).notNull().default("true"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export the schema
export const helloWorldSchema = {
  helloWorldTable,
  greetingsTable,
};

// Create the test plugin
export const helloWorldPlugin: Plugin = {
  name: "test-hello-world",
  description: "Test plugin for dynamic migration testing",
  schema: helloWorldSchema,
  priority: 100, // Load after SQL plugin
  dependencies: ["@elizaos/plugin-sql"],

  init: async (_config, _runtime) => {
    console.log("Hello World Plugin initialized!");
  },
};

export default helloWorldPlugin;
```