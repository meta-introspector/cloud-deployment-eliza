# a7046c18:packages_plugin-sql_src_schema_relationship.ts:1-59

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/relationship.ts:1-59
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { agentTable } from "./agent";
import { entityTable } from "./entity";

/**
 * Defines the relationshipTable containing information about relationships between entities and agents.
 * @type {import('knex').TableBuilder}
 */
export const relationshipTable = pgTable(
  "relationships",
  {
    id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    sourceEntityId: uuid("source_entity_id")
      .notNull()
      .references(() => entityTable.id, { onDelete: "cascade" }),
    targetEntityId: uuid("target_entity_id")
      .notNull()
      .references(() => entityTable.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agentTable.id, { onDelete: "cascade" }),
    tags: text("tags").array(),
    metadata: jsonb("metadata"),
  },
  (table) => [
    index("idx_relationships_users").on(
      table.sourceEntityId,
      table.targetEntityId,
    ),
    unique("unique_relationship").on(
      table.sourceEntityId,
      table.targetEntityId,
      table.agentId,
    ),
    foreignKey({
      name: "fk_user_a",
      columns: [table.sourceEntityId],
      foreignColumns: [entityTable.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "fk_user_b",
      columns: [table.targetEntityId],
      foreignColumns: [entityTable.id],
    }).onDelete("cascade"),
  ],
);
```