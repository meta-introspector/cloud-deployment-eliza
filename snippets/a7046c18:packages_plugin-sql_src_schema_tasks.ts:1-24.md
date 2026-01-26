# a7046c18:packages_plugin-sql_src_schema_tasks.ts:1-24

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/tasks.ts:1-24
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { agentTable } from "./agent";

/**
 * Represents a table schema for tasks in the database.
 *
 * @type {PgTable}
 */
export const taskTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  roomId: uuid("room_id"),
  worldId: uuid("world_id"),
  entityId: uuid("entity_id"),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => agentTable.id, { onDelete: "cascade" }),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
```