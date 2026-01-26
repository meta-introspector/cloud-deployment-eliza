# a7046c18:packages_plugin-sql_src_types.d.ts:1-32

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/types.d.ts:1-32
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { IDatabaseAdapter } from "@elizaos/core";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
/**
 * Represents a type that can be either a NodePgDatabase or a PgliteDatabase.
 */
export type DrizzleDatabase = NodePgDatabase | PgliteDatabase;
/**
 * Interface for managing a database client.
 * @template T - The type of the database connection object.
 */
export interface IDatabaseClientManager<T> {
  initialize(): Promise<void>;
  getConnection(): T;
  close(): Promise<void>;
}
/**
 * Extract typed Drizzle database from adapter.
 * Use this instead of casting `adapter.db` everywhere.
 */
export declare function getDb(adapter: IDatabaseAdapter): DrizzleDatabase;
/**
 * Type-safe row extraction from query results.
 * Avoids verbose `as unknown as T` casts.
 */
export declare function getRow<T>(
  result: {
    rows: unknown[];
  },
  index?: number,
): T | undefined;
//# sourceMappingURL=types.d.ts.map
```