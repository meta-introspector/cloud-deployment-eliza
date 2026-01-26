# a7046c18:packages_docs_plugin-registry_sql.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Database Management"
description: "Database integration and management for elizaOS"
---


The `@elizaos/plugin-sql` provides comprehensive database management for elizaOS agents, featuring automatic schema migrations, multi-database support, and a sophisticated plugin architecture.

## Key Features

### 🗄️ Dual Database Support
- **PGLite** - Embedded PostgreSQL for development
- **PostgreSQL** - Full PostgreSQL for production
- Automatic adapter selection based on environment

### 🔄 Dynamic Migration System
- Automatic schema discovery from plugins
- Intelligent table creation and updates
- Dependency resolution for foreign keys
- No manual migration files needed

### 🏗️ Schema Introspection
- Analyzes existing database structure
- Detects missing columns and indexes
- Handles composite primary keys
- Preserves existing data

### 🔌 Plugin Integration
- Plugins can define their own schemas
- Automatic table creation at startup
- Isolated namespaces prevent conflicts
- Shared core tables for common data

## Architecture Overview

The plugin consists of several key components:

```mermaid
flowchart TD
    A[elizaOS Runtime] --> B[DatabaseMigrationService<br/>• Schema Discovery<br/>• Migration Orchestration]
    B --> C[Database Adapters]
    
    C --> D[PGLite Adapter<br/>• Development<br/>• File-based]
    C --> E[PG Adapter<br/>• Production<br/>• Pooled]
```

## Core Components

### 1. Database Adapters
- **BaseDrizzleAdapter** - Shared functionality
- **PgliteDatabaseAdapter** - Development database
- **PgDatabaseAdapter** - Production database

### 2. Migration Service
- **DatabaseMigrationService** - Orchestrates migrations
- **DrizzleSchemaIntrospector** - Analyzes schemas
- **Custom Migrator** - Executes schema changes

### 3. Connection Management
- **PGliteClientManager** - Singleton PGLite instance
- **PostgresConnectionManager** - Connection pooling
- **Global Singletons** - Prevents multiple connections

### 4. Schema Definitions
Core tables for agent functionality:
- `agents` - Agent identities
- `memories` - Knowledge storage
- `entities` - People and objects
- `relationships` - Entity connections
- `messages` - Communication history
- `embeddings` - Vector search
- `cache` - Key-value storage
- `logs` - System events

## Installation

```bash
elizaos plugins add @elizaos/plugin-sql
```

## Configuration

The SQL plugin is automatically included by the elizaOS runtime and configured via environment variables.

### Environment Setup

Create a `.env` file in your project root:

```bash
# For PostgreSQL (production)
POSTGRES_URL=postgresql://user:password@host:5432/database

# For custom PGLite directory (development)
# Optional - defaults to ./.eliza/.elizadb if not set
PGLITE_DATA_DIR=/path/to/custom/db
```

### Adapter Selection

The plugin automatically chooses the appropriate adapter:

- **With `POSTGRES_URL`** → PostgreSQL adapter (production)
- **Without `POSTGRES_URL`** → PGLite adapter (development)

No code changes needed - just set your environment variables.

### Custom Plugin with Schema

```typescript
import { Plugin } from '@elizaos/core';
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

// Define your schema
const customTable = pgTable('custom_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  agentId: uuid('agent_id').notNull(),
  data: text('data').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Create plugin
export const customPlugin: Plugin = {
  name: 'custom-plugin',
  schema: {
    customTable,
  },
  // Plugin will have access to database via runtime
};
```

## How It Works

### 1. Initialization
When the agent starts:
1. SQL plugin initializes the appropriate database adapter
2. Migration service discovers all plugin schemas
3. Schemas are analyzed and dependencies resolved
4. Tables are created or updated as needed

### 2. Schema Discovery
```typescript
// Plugins export their schemas
export const myPlugin: Plugin = {
  name: 'my-plugin',
  schema: { /* Drizzle tables */ },
};

// Migration service finds and registers them
discoverAndRegisterPluginSchemas(plugins);
```
```