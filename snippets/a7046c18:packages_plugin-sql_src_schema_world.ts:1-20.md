# a7046c18:packages_plugin-sql_src_schema_world.ts:1-20

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/world.ts:1-20
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { agentTable } from "./agent";

/**
 * Represents a table schema for worlds in the database.
 *
 * @type {PgTable}
 */

export const worldTable = pgTable("worlds", {
  id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
  agentId: uuid("agent_id")
    .notNull()
    .references(() => agentTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  metadata: jsonb("metadata"),
  messageServerId: uuid("message_server_id"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});
```