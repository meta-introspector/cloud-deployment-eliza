# 5e8c73c1:packages_plugin-sql_src_schema_component.ts:1-40

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/schema/component.ts:1-40
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { sql } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { agentTable } from './agent';
import { entityTable } from './entity';
import { roomTable } from './room';
import { worldTable } from './world';

/**
 * Represents a component table in the database.
 */
export const componentTable = pgTable('components', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),

  // Foreign keys
  entityId: uuid('entity_id')
    .references(() => entityTable.id, { onDelete: 'cascade' })
    .notNull(),
  agentId: uuid('agent_id')
    .references(() => agentTable.id, { onDelete: 'cascade' })
    .notNull(),
  roomId: uuid('room_id')
    .references(() => roomTable.id, { onDelete: 'cascade' })
    .notNull(),
  worldId: uuid('world_id').references(() => worldTable.id, { onDelete: 'cascade' }),
  sourceEntityId: uuid('source_entity_id').references(() => entityTable.id, {
    onDelete: 'cascade',
  }),

  // Data
  type: text('type').notNull(),
  data: jsonb('data').default(sql`'{}'::jsonb`),

  // Timestamps
  createdAt: timestamp('created_at')
    .default(sql`now()`)
    .notNull(),
});
```