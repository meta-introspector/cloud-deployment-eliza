# a7046c18:packages_plugin-sql_src_schema_channelParticipant.ts:1-13

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/channelParticipant.ts:1-13
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { channelTable } from "./channel";

export const channelParticipantsTable = pgTable(
  "channel_participants",
  {
    channelId: text("channel_id")
      .notNull()
      .references(() => channelTable.id, { onDelete: "cascade" }),
    entityId: text("entity_id").notNull(), // Entity UUID (can be an agentId or a dedicated central user ID)
  },
  (table) => [primaryKey({ columns: [table.channelId, table.entityId] })],
);
```