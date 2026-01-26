# a7046c18:packages_docs_plugin-registry_sql_schema-management.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/schema-management.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Schema Management"
description: "Dynamic schema management and migrations in the SQL plugin"
---


The SQL plugin provides a sophisticated dynamic migration system that automatically manages database schemas for plugins. This guide covers how the system works and how to define schemas for your plugins.

## Dynamic Migration System

The SQL plugin uses a **dynamic migration service** that automatically creates and updates database tables based on plugin schemas. This eliminates the need for traditional migration files.

### How It Works

1. **Plugin Registration** - Plugins export their schema definitions
2. **Schema Discovery** - The migration service discovers all plugin schemas at startup
3. **Schema Introspection** - The system analyzes existing database tables
4. **Dynamic Migration** - Tables are created or updated as needed
5. **Dependency Resolution** - Tables are created in the correct order based on foreign key dependencies

### Key Components

```typescript
// DatabaseMigrationService - Manages all plugin migrations
export class DatabaseMigrationService {
  private registeredSchemas = new Map<string, any>();

  discoverAndRegisterPluginSchemas(plugins: Plugin[]): void {
    for (const plugin of plugins) {
      if (plugin.schema) {
        this.registeredSchemas.set(plugin.name, plugin.schema);
      }
    }
  }

  async runAllPluginMigrations(): Promise<void> {
    for (const [pluginName, schema] of this.registeredSchemas) {
      await runPluginMigrations(this.db!, pluginName, schema);
    }
  }
}
```

## Defining Plugin Schemas

To enable automatic schema management, plugins must export their Drizzle schema definitions:

### Plugin Structure

```typescript
import { Plugin } from '@elizaos/core';
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Define your schema
export const myTable = pgTable('my_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at').defaultNow(),
});

// Export as part of plugin
export const myPlugin: Plugin = {
  name: 'my-plugin',
  schema: {
    myTable,
    // Add other tables here
  },
  // ... other plugin properties
};
```

## Core Schema Tables

The SQL plugin provides these core tables that all agents use:

### Agent Tables
- `agents` - Core agent identity
- `memories` - Agent memory storage
- `entities` - People, objects, and concepts
- `relationships` - Connections between entities

### Communication Tables
- `rooms` - Conversation contexts
- `participants` - Room membership
- `messages` - Message history

### System Tables
- `logs` - System event logging
- `cache` - Key-value cache with composite primary key
- `tasks` - Background task management
- `embeddings` - Vector embeddings for similarity search

## Schema Introspection

The system uses `DrizzleSchemaIntrospector` to analyze database schemas:

```typescript
export class DrizzleSchemaIntrospector {
  parseTableDefinition(table: any, exportKey?: string): TableDefinition {
    const columns = this.parseColumns(table);
    const foreignKeys = this.parseForeignKeys(table);
    const indexes = this.parseIndexes(table);
    const checkConstraints = this.parseCheckConstraints(table);
    const compositePrimaryKey = this.parseCompositePrimaryKey(table);
    
    return {
      name: tableName,
      columns,
      indexes,
      foreignKeys,
      checkConstraints,
      compositePrimaryKey,
      dependencies, // Tables this table depends on
    };
  }
}
```

## Migration Process

The dynamic migrator handles various scenarios:

### Table Creation
```typescript
// Automatically generates CREATE TABLE statements
await createTable(db, tableDefinition);
```

### Column Addition
```typescript
// Detects and adds missing columns
if (!existingColumns.has(column.name)) {
  await addColumn(db, tableName, column);
}
```

### Index Management
```typescript
// Creates missing indexes
for (const index of tableDefinition.indexes) {
  if (!existingIndexes.has(index.name)) {
    await createIndex(db, tableName, index);
  }
}
```

### Foreign Key Constraints
```typescript
// Adds foreign keys after all tables exist
```