# a7046c18:packages_plugin-sql_src_schema_participant.ts:1-52

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/participant.ts:1-52
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { agentTable } from "./agent";
import { entityTable } from "./entity";
import { roomTable } from "./room";

/**
 * Defines the schema for the "participants" table in the database.
 *
 * @type {import('knex').TableBuilder}
 */
export const participantTable = pgTable(
  "participants",
  {
    id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    entityId: uuid("entity_id").references(() => entityTable.id, {
      onDelete: "cascade",
    }),
    roomId: uuid("room_id").references(() => roomTable.id, {
      onDelete: "cascade",
    }),
    agentId: uuid("agent_id").references(() => agentTable.id, {
      onDelete: "cascade",
    }),
    roomState: text("room_state"),
  },
  (table) => [
    // unique("participants_user_room_agent_unique").on(table.entityId, table.roomId, table.agentId),
    index("idx_participants_user").on(table.entityId),
    index("idx_participants_room").on(table.roomId),
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