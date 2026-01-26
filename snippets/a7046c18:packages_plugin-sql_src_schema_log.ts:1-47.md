# a7046c18:packages_plugin-sql_src_schema_log.ts:1-47

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/log.ts:1-47
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import {
  foreignKey,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { entityTable } from "./entity";
import { roomTable } from "./room";

/**
 * Represents a PostgreSQL table for storing logs.
 *
 * @type {Table}
 */

export const logTable = pgTable(
  "logs",
  {
    id: uuid("id").defaultRandom().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entityTable.id, { onDelete: "cascade" }),
    body: jsonb("body").notNull(),
    type: text("type").notNull(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => roomTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    foreignKey({
      name: "fk_room",
      columns: [table.roomId],
      foreignColumns: [roomTable.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "fk_user",
      columns: [table.entityId],
      foreignColumns: [entityTable.id],
    }).onDelete("cascade"),
  ],
);
```