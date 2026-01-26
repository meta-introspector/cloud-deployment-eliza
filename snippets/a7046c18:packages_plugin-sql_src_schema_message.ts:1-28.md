# a7046c18:packages_plugin-sql_src_schema_message.ts:1-28

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/message.ts:1-28
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { channelTable } from "./channel";

export const messageTable = pgTable("central_messages", {
  id: text("id").primaryKey(), // UUID stored as text
  channelId: text("channel_id")
    .notNull()
    .references(() => channelTable.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  content: text("content").notNull(),
  rawMessage: jsonb("raw_message"),
  inReplyToRootMessageId: text("in_reply_to_root_message_id").references(
    () => messageTable.id,
    {
      onDelete: "set null",
    },
  ),
  sourceType: text("source_type"),
  sourceId: text("source_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
```