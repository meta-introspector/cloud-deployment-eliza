# a7046c18:packages_docs_plugin-registry_sql_schema-management.mdx:151-264

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/schema-management.mdx:151-264
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
for (const fk of tableDefinition.foreignKeys) {
  await addForeignKey(db, tableName, fk);
}
```

## Best Practices

### 1. Schema Design
- Use UUIDs for primary keys
- Include timestamps (created_at, updated_at)
- Use JSONB for flexible metadata
- Define proper indexes for query performance

### 2. Foreign Keys
- Always reference existing tables
- Consider cascade options carefully
- Be aware of circular dependencies

### 3. Composite Keys
```typescript
// Example: Cache table with composite primary key
export const cacheTable = pgTable('cache', {
  key: text('key').notNull(),
  agentId: uuid('agent_id').notNull(),
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    pk: primaryKey(table.key, table.agentId),
  };
});
```

### 4. Plugin Schema Organization
```typescript
// Organize related tables together
export const schema = {
  // Core tables
  users: userTable,
  profiles: profileTable,
  
  // Feature tables
  posts: postTable,
  comments: commentTable,
  
  // Junction tables
  userFollows: userFollowsTable,
};
```

## Error Handling

The migration system includes robust error handling:

- **Duplicate Tables** - Silently skipped
- **Missing Dependencies** - Tables created in dependency order
- **Failed Migrations** - Detailed error logging with rollback
- **Schema Conflicts** - Clear error messages for debugging

## Limitations and Considerations

1. **No Downgrades** - The system only adds, never removes
2. **Column Type Changes** - Not automatically handled
3. **Data Migrations** - Must be handled separately
4. **Production Use** - Test thoroughly before deploying schema changes

## Example: Complete Plugin Schema

```typescript
import { Plugin } from '@elizaos/core';
import { pgTable, uuid, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define tables
export const projectTable = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('active'),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const taskTable = pgTable('project_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projectTable.id),
  title: text('title').notNull(),
  completed: boolean('completed').default(false),
  priority: integer('priority').default(0),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Create indexes
export const projectIndexes = {
  agentIdIdx: index('project_agent_id_idx').on(projectTable.agentId),
  statusIdx: index('project_status_idx').on(projectTable.status),
};

// Export plugin
export const projectPlugin: Plugin = {
  name: 'project-management',
  schema: {
    projectTable,
    taskTable,
    ...projectIndexes,
  },
  // ... other plugin properties
};
```

This schema will be automatically created when the agent starts, with all tables, columns, indexes, and foreign keys properly configured.
```