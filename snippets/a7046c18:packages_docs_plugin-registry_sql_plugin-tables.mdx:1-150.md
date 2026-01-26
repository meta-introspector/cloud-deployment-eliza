# a7046c18:packages_docs_plugin-registry_sql_plugin-tables.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/plugin-tables.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Plugin Tables Guide"
description: "How plugins can define their own database tables"
---

This guide shows plugin developers how to add database tables to their elizaOS plugins. The plugin-sql system automatically handles schema creation, migrations, and namespacing.

## Overview

Any elizaOS plugin can define its own database tables by:

1. Creating table definitions using Drizzle ORM
2. Exporting a `schema` property from the plugin
3. That's it! Tables are created automatically on startup

## Step-by-Step Guide

### 1. Set Up Your Plugin Structure

```
packages/my-plugin/
├── src/
│   ├── schema/
│   │   ├── index.ts       # Export all tables
│   │   ├── users.ts       # User table definition
│   │   └── settings.ts    # Settings table definition
│   ├── actions/
│   ├── services/
│   └── index.ts          # Plugin entry point
├── package.json
└── tsconfig.json
```

### 2. Define Your Tables

Create table definitions using Drizzle ORM:

```typescript
// packages/my-plugin/src/schema/users.ts
import { pgTable, uuid, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const pluginUsersTable = pgTable('plugin_users', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Basic fields
  username: text('username').notNull().unique(),
  email: text('email').notNull(),
  isActive: boolean('is_active').default(true),

  // JSONB for flexible data
  profile: jsonb('profile')
    .$type<{
      avatar?: string;
      bio?: string;
      preferences?: Record<string, any>;
    }>()
    .default(sql`'{}'::jsonb`),

  // Standard timestamps
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});
```

### 3. Create Schema Index

Export all your tables from a central location:

```typescript
// packages/my-plugin/src/schema/index.ts
export { pluginUsersTable } from './users';
export { pluginSettingsTable } from './settings';
// Export all other tables...
```

### 4. Export Schema from Plugin

The critical step - export your schema from the plugin:

```typescript
// packages/my-plugin/src/index.ts
import { type Plugin } from '@elizaos/core';
import * as schema from './schema';

export const myPlugin: Plugin = {
  name: '@company/my-plugin',
  description: 'My plugin with custom database tables',

  // This enables automatic migrations!
  schema,

  init: async (config, runtime) => {
    // Plugin initialization
    console.log('Plugin initialized with database tables');
  },

  // Other plugin properties...
  actions: [],
  services: [],
  providers: [],
};

export default myPlugin;
```

## Schema Namespacing

Your plugin's tables are automatically created in a dedicated PostgreSQL schema:

```typescript
// Plugin name: @company/my-plugin
// Schema name: company_my_plugin
// Full table name: company_my_plugin.plugin_users
```

This prevents naming conflicts between plugins.

## Working with Foreign Keys

### Reference Core Tables

To reference tables from the core plugin:

```typescript
// Import core schema
import { agentTable } from '@elizaos/plugin-sql/schema';

export const pluginMemoriesTable = pgTable('plugin_memories', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Reference core agent table
  agentId: uuid('agent_id')
    .notNull()
    .references(() => agentTable.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
});
```

### Reference Your Own Tables

For relationships within your plugin:

```typescript
```