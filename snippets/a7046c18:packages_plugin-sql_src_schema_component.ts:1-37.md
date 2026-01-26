# a7046c18:packages_plugin-sql_src_schema_component.ts:1-37

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/component.ts:1-37
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { agentTable } from "./agent";
import { entityTable } from "./entity";
import { roomTable } from "./room";
import { worldTable } from "./world";

/**
 * Represents a component table in the database.
 */
export const componentTable = pgTable("components", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).notNull(),

  // Foreign keys
  entityId: uuid("entity_id")
    .references(() => entityTable.id, { onDelete: "cascade" })
    .notNull(),
  agentId: uuid("agent_id")
    .references(() => agentTable.id, { onDelete: "cascade" })
    .notNull(),
  roomId: uuid("room_id")
    .references(() => roomTable.id, { onDelete: "cascade" })
    .notNull(),
  worldId: uuid("world_id").references(() => worldTable.id, {
    onDelete: "cascade",
  }),
  sourceEntityId: uuid("source_entity_id").references(() => entityTable.id, {
    onDelete: "cascade",
  }),

  // Data
  type: text("type").notNull(),
  data: jsonb("data").default(sql`'{}'::jsonb`),

  // Timestamps
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});
```