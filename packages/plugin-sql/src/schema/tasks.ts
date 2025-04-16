import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { roomTable } from './room';
import { worldTable } from './worldTable';
import { agentTable } from './agent';
/**
 * Represents a table schema for tasks in the database.
 *
 * @type {PgTable}
 */
export const taskTable = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),

  roomId: uuid('room_id').references(() => roomTable.id, {
    onDelete: 'cascade',
  }),

  // FIXME : The world already is referenced from room and task references room, so we dont need to have world in task.
  worldId: uuid('world_id').references(() => worldTable.id, {
    onDelete: 'cascade',
  }),
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agentTable.id, {
      onDelete: 'cascade',
    }),
  tags: text('tags').array(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
