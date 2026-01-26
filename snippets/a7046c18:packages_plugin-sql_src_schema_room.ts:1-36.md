# a7046c18:packages_plugin-sql_src_schema_room.ts:1-36

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/room.ts:1-36
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { agentTable } from "./agent";

/**
 * Defines a table schema for 'rooms' in the database.
 *
 * @typedef {object} RoomTable
 * @property {string} id - The unique identifier for the room.
 * @property {string} agentId - The UUID of the agent associated with the room.
 * @property {string} source - The source of the room.
 * @property {string} type - The type of the room.
 * @property {string} messageServerId - The message server ID of the room.
 * @property {string} worldId - The UUID of the world associated with the room.
 * @property {string} name - The name of the room.
 * @property {object} metadata - Additional metadata for the room in JSON format.
 * @property {string} channelId - The channel ID of the room.
 * @property {number} createdAt - The timestamp of when the room was created.
 */
export const roomTable = pgTable("rooms", {
  id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
  agentId: uuid("agent_id").references(() => agentTable.id, {
    onDelete: "cascade",
  }),
  source: text("source").notNull(),
  type: text("type").notNull(),
  messageServerId: uuid("message_server_id"),
  worldId: uuid("world_id"), // no guarantee that world exists, it is optional for now
  // .references(() => worldTable.id, {
  //   onDelete: 'cascade',
  // }),
  name: text("name"),
  metadata: jsonb("metadata"),
  channelId: text("channel_id"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});
```