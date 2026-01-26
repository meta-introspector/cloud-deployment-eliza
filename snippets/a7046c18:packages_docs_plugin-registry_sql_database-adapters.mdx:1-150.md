# a7046c18:packages_docs_plugin-registry_sql_database-adapters.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/database-adapters.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Database Adapters"
description: "Understanding PGLite and PostgreSQL adapters in the SQL plugin"
---


The SQL plugin provides two database adapters that extend a common `BaseDrizzleAdapter`:

- **PGLite Adapter** - Embedded PostgreSQL for development and testing
- **PostgreSQL Adapter** - Full PostgreSQL for production environments

## Architecture Overview

Both adapters share the same base functionality through `BaseDrizzleAdapter`, which implements the `IDatabaseAdapter` interface from `@elizaos/core`. The adapters handle:

- Connection management through dedicated managers
- Automatic retry logic for database operations
- Schema introspection and dynamic migrations
- Embedding dimension configuration (default: 384 dimensions)

## PGLite Adapter

The `PgliteDatabaseAdapter` uses an embedded PostgreSQL instance that runs entirely in Node.js.

### Key Features

- **Zero external dependencies** - No PostgreSQL installation required
- **File-based persistence** - Data stored in local filesystem
- **Singleton connection manager** - Ensures single database instance per process
- **Automatic initialization** - Database created on first use

### Implementation Details

```typescript
export class PgliteDatabaseAdapter extends BaseDrizzleAdapter {
  private manager: PGliteClientManager;
  protected embeddingDimension: EmbeddingDimensionColumn = DIMENSION_MAP[384];

  constructor(agentId: UUID, manager: PGliteClientManager) {
    super(agentId);
    this.manager = manager;
    this.db = drizzle(this.manager.getConnection());
  }
}
```

### Connection Management

The `PGliteClientManager` handles:
- Singleton PGLite instance creation
- Data directory resolution and creation
- Connection persistence across adapter instances

## PostgreSQL Adapter

The `PgDatabaseAdapter` connects to a full PostgreSQL database using connection pooling.

### Key Features

- **Connection pooling** - Efficient resource management
- **Automatic retry logic** - Built-in resilience for transient failures
- **Production-ready** - Designed for scalable deployments
- **SSL support** - Secure connections when configured
- **Cloud compatibility** - Works with Supabase, Neon, and other PostgreSQL providers

### Implementation Details

```typescript
export class PgDatabaseAdapter extends BaseDrizzleAdapter {
  protected embeddingDimension: EmbeddingDimensionColumn = DIMENSION_MAP[384];
  private manager: PostgresConnectionManager;

  constructor(agentId: UUID, manager: PostgresConnectionManager, _schema?: any) {
    super(agentId);
    this.manager = manager;
    this.db = manager.getDatabase();
  }

  protected async withDatabase<T>(operation: () => Promise<T>): Promise<T> {
    return await this.withRetry(async () => {
      const client = await this.manager.getClient();
      try {
        const db = drizzle(client);
        this.db = db;
        return await operation();
      } finally {
        client.release();
      }
    });
  }
}
```

### Connection Management

The `PostgresConnectionManager` provides:
- Connection pool management (default size: 20)
- SSL configuration based on environment
- Singleton pattern to prevent multiple pools
- Graceful shutdown handling

## Adapter Selection

The adapter is automatically selected based on environment configuration:

```typescript
export function createDatabaseAdapter(
  config: {
    dataDir?: string;
    postgresUrl?: string;
  },
  agentId: UUID
): IDatabaseAdapter {
  if (config.postgresUrl) {
    // PostgreSQL adapter for production
    if (!globalSingletons.postgresConnectionManager) {
      globalSingletons.postgresConnectionManager = new PostgresConnectionManager(
        config.postgresUrl
      );
    }
    return new PgDatabaseAdapter(agentId, globalSingletons.postgresConnectionManager);
  } else {
    // PGLite adapter for development
    const resolvedDataDir = resolvePgliteDir(config.dataDir);
    if (!globalSingletons.pgLiteClientManager) {
      globalSingletons.pgLiteClientManager = new PGliteClientManager(resolvedDataDir);
    }
    return new PgliteDatabaseAdapter(agentId, globalSingletons.pgLiteClientManager);
  }
}
```

## Migration Handling

**Important**: Both adapters delegate migration handling to the `DatabaseMigrationService`. The adapters themselves do not run migrations directly.

```typescript
// In both adapters:
async runMigrations(): Promise<void> {
  logger.debug('Migrations are handled by the migration service');
  // Migrations are handled by the migration service, not the adapter
}
```

The migration service handles:
- Plugin schema discovery and registration
- Dynamic table creation and updates
- Schema introspection for existing tables
- Dependency resolution for table creation order

```