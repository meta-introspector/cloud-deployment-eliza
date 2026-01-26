# a7046c18:packages_plugin-sql_src_schema_channel.ts:1-23

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/channel.ts:1-23
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { messageServerTable } from "./messageServer";

export const channelTable = pgTable("channels", {
  id: text("id").primaryKey(), // UUID stored as text
  messageServerId: uuid("message_server_id")
    .notNull()
    .references(() => messageServerTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // Store ChannelType enum values as text
  sourceType: text("source_type"),
  sourceId: text("source_id"),
  topic: text("topic"),
  metadata: jsonb("metadata"),
  // Note: server_id is added dynamically by RLS setup, not defined in schema
  createdAt: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
```