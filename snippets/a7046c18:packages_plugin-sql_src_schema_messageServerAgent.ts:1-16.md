# a7046c18:packages_plugin-sql_src_schema_messageServerAgent.ts:1-16

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/messageServerAgent.ts:1-16
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { agentTable } from "./agent";
import { messageServerTable } from "./messageServer";

export const messageServerAgentsTable = pgTable(
  "message_server_agents",
  {
    messageServerId: uuid("message_server_id")
      .notNull()
      .references(() => messageServerTable.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agentTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.messageServerId, table.agentId] })],
);
```