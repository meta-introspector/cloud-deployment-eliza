# a7046c18:packages_plugin-sql_README.md:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/README.md:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# DrizzleDatabaseAdapter

A PostgreSQL database adapter built with Drizzle ORM for the elizaOS ecosystem.

## Installation

```bash
# Using bun
bun add @elizaos/plugin-sql
```

## Vector Dimensions

The adapter supports the following vector dimensions:

```typescript
VECTOR_DIMS = {
  SMALL: 384,
  MEDIUM: 512,
  LARGE: 768,
  XL: 1024,
  XXL: 1536,
  XXXL: 3072,
};
```

Important Note: Once an agent is initialized with a specific embedding dimension, it cannot be changed. Attempting to change the dimension will result in an error: "Cannot change embedding dimension for agent"

## Features

- Circuit breaker pattern for database failures
- Automatic retries with exponential backoff
- Connection pooling
- Vector search capabilities
- Memory management
- Caching system
- Room and participant management
- Goal tracking system

## Database Schema

The plugin uses a structured schema with the following main tables:

### Core Tables

- **Agent**: Stores agent information and configurations
- **Room**: Manages conversation rooms and their settings
- **Participant**: Tracks participants in rooms
- **Memory**: Stores agent memories with vector embeddings for semantic search
- **Embedding**: Manages vector embeddings for various entities
- **Entity**: Represents entities that agents can interact with
- **Relationship**: Tracks relationships between entities
- **Component**: Stores agent components and their configurations
- **Tasks**: Manages tasks and goals for agents
- **Log**: Stores system logs
- **Cache**: Provides a caching mechanism for frequently accessed data
- **World**: Manages world settings and configurations

Each table is defined using Drizzle ORM schema definitions in the `src/schema` directory. The schema is designed to support the elizaOS ecosystem's requirements for agent-based systems.

## Usage

The adapter is typically used as part of the elizaOS runtime:

```typescript
async function findDatabaseAdapter(runtime: IAgentRuntime) {
  let adapter = runtime;

  if (!adapter) {
    const drizzleAdapterPlugin = await import('@elizaos/plugin-sql');
    const drizzleAdapterPluginDefault = drizzleAdapterPlugin.default;
    adapter = drizzleAdapterPluginDefault.adapter;
    if (!adapter) {
      throw new Error('Internal error: No database adapter found for default plugin-sql');
    }
  } else if (!adapter) {
    throw new Error(
      'Multiple database adapters found. You must have no more than one. Adjust your plugins configuration.'
    );
  }

  const adapterInterface = await adapter?.init(runtime);
  return adapterInterface;
}
```

## Error Handling Configuration

The adapter implements the following error handling configurations:

```typescript
{
    failureThreshold: 5,
    resetTimeout: 60000,
    halfOpenMaxAttempts: 3,
    maxRetries: 3,
    baseDelay: 1000,  // 1 second
    maxDelay: 10000,  // 10 seconds
    jitterMax: 1000,  // 1 second
    connectionTimeout: 5000  // 5 seconds
}
```

## Requirements

- PostgreSQL with vector extension installed
- Node.js or Bun (≥1.2.2)

## Environment Variables

The plugin uses the following environment variables:

- `POSTGRES_URL`: Connection string for PostgreSQL database (e.g., `postgresql://user:password@localhost:5432/dbname`)
  - If not provided, the plugin will use PGlite as a fallback
- `PGLITE_DATA_DIR`: (Optional) Directory for PGlite data storage (default: `./pglite`)

These variables should be defined in a `.env` file at the root of your project.

## Database Pool Configuration

Default pool configuration:

```typescript
{
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
}
```

## Migration Support

elizaOS v1.0.0 introduces **dynamic runtime migrations** - automatic schema management that runs at startup without manual intervention. Plugins can define their schemas and the system handles all migrations automatically.

### TLDR: What Changed?

**Before (v0.x):** Manual migrations with `drizzle-kit generate` → `drizzle-kit push` → restart  
**Now (v1.0.0):** Define schema in plugin → Start agent → Migrations run automatically ✨

### Key Features

- **Zero-Config Migrations**: No more manual migration commands
- **Plugin Isolation**: Each plugin gets its own schema namespace
- **Safety First**: Destructive changes blocked by default in production
- **Concurrent Safety**: Built-in locks prevent race conditions
- **Rollback Protection**: All migrations run in transactions

### How It Works

1. **Plugin defines schema** using Drizzle ORM:
```