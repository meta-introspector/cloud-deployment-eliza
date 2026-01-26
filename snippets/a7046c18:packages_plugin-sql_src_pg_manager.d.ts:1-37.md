# a7046c18:packages_plugin-sql_src_pg_manager.d.ts:1-37

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/pg/manager.d.ts:1-37
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { type UUID } from "@elizaos/core";
import { type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient } from "pg";
export declare class PostgresConnectionManager {
  private pool;
  private db;
  constructor(connectionString: string, rlsServerId?: string);
  getDatabase(): NodePgDatabase;
  getConnection(): Pool;
  getClient(): Promise<PoolClient>;
  testConnection(): Promise<boolean>;
  /**
   * Execute a query with entity context for Entity RLS.
   * Sets app.entity_id before executing the callback.
   *
   * Server RLS context (if enabled) is already set via Pool's application_name.
   *
   * If ENABLE_DATA_ISOLATION is not true, this method skips setting entity context
   * entirely to avoid PostgreSQL errors that would abort the transaction.
   *
   * @param entityId - The entity UUID to set as context (or null for server operations)
   * @param callback - The database operations to execute with the entity context
   * @returns The result of the callback
   * @throws {Error} If the callback fails or if there's a critical Entity RLS configuration issue
   */
  withEntityContext<T>(
    entityId: UUID | null,
    callback: (tx: NodePgDatabase) => Promise<T>,
  ): Promise<T>;
  /**
   * Closes the connection pool.
   * @returns {Promise<void>}
   * @memberof PostgresConnectionManager
   */
  close(): Promise<void>;
}
//# sourceMappingURL=manager.d.ts.map
```