# a7046c18:packages_plugin-sql_src_schema_entity.ts:1-34

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/entity.ts:1-34
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { agentTable } from "./agent";

/**
 * Represents an entity table in the database.
 * Includes columns for id, agentId, createdAt, names, and metadata.
 */
export const entityTable = pgTable(
  "entities",
  {
    id: uuid("id").notNull().primaryKey(),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agentTable.id, {
        onDelete: "cascade",
      }),
    createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    names: text("names").array().default(sql`'{}'::text[]`).notNull(),
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`).notNull(),
  },
  (table) => {
    return {
      idAgentIdUnique: unique("id_agent_id_unique").on(table.id, table.agentId),
    };
  },
);
```