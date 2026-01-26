# a7046c18:packages_docs_plugin-registry_sql_plugin-tables.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/plugin-tables.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
export const pluginPostsTable = pgTable('plugin_posts', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Reference user in same plugin
  authorId: uuid('author_id')
    .notNull()
    .references(() => pluginUsersTable.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),
  content: text('content').notNull(),
});
```

### Cross-Plugin References

To reference tables from other plugins:

```typescript
// Reference using fully qualified name
userId: uuid('user_id')
  .notNull()
  .references(() => sql`"other_plugin"."users"("id")`),
```

## Table Design Patterns

### User Tables

```typescript
export const pluginUsersTable = pgTable('plugin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Link to core agent
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agentTable.id),
  
  // User identification
  externalId: text('external_id').unique(),
  username: text('username').notNull().unique(),
  email: text('email'),
  
  // User state
  status: text('status').default('active'),
  lastSeenAt: timestamp('last_seen_at'),
  
  // Flexible data
  profile: jsonb('profile').default(sql`'{}'::jsonb`),
  settings: jsonb('settings').default(sql`'{}'::jsonb`),
  
  // Timestamps
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`now()`).notNull(),
}, (table) => ({
  // Indexes for performance
  agentIdIdx: index('plugin_users_agent_id_idx').on(table.agentId),
  emailIdx: index('plugin_users_email_idx').on(table.email),
}));
```

### Event/Log Tables

```typescript
export const pluginEventsTable = pgTable('plugin_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Event classification
  type: text('type').notNull(),
  category: text('category'),
  severity: text('severity').default('info'),
  
  // Event context
  userId: uuid('user_id').references(() => pluginUsersTable.id),
  agentId: uuid('agent_id').references(() => agentTable.id),
  
  // Event data
  data: jsonb('data').notNull(),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
  
  // Timestamp (no updatedAt needed for immutable logs)
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
}, (table) => ({
  // Indexes for querying
  typeIdx: index('plugin_events_type_idx').on(table.type),
  userIdIdx: index('plugin_events_user_id_idx').on(table.userId),
  createdAtIdx: index('plugin_events_created_at_idx').on(table.createdAt),
}));
```

### Configuration Tables

```typescript
export const pluginConfigTable = pgTable('plugin_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Scope the configuration
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agentTable.id, { onDelete: 'cascade' }),
  
  // Configuration identification
  key: text('key').notNull(),
  namespace: text('namespace').default('default'),
  
  // Configuration data
  value: jsonb('value').notNull(),
  description: text('description'),
  
  // Configuration metadata
  isSecret: boolean('is_secret').default(false),
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`now()`).notNull(),
}, (table) => ({
  // Unique constraint for key per agent/namespace
  uniqueKeyPerAgent: unique('plugin_config_agent_namespace_key_unique')
    .on(table.agentId, table.namespace, table.key),
}));
```

## Advanced Features

### Composite Primary Keys

```typescript
export const pluginUserRolesTable = pgTable('plugin_user_roles', {
  userId: uuid('user_id')
    .notNull()
    .references(() => pluginUsersTable.id, { onDelete: 'cascade' }),
  
  roleId: uuid('role_id')
    .notNull()
    .references(() => pluginRolesTable.id, { onDelete: 'cascade' }),
  
  assignedAt: timestamp('assigned_at').default(sql`now()`).notNull(),
  assignedBy: uuid('assigned_by').references(() => pluginUsersTable.id),
}, (table) => ({
  // Composite primary key
  pk: primaryKey({ columns: [table.userId, table.roleId] }),
}));
```

### Check Constraints

```typescript
export const pluginProductsTable = pgTable('plugin_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
```