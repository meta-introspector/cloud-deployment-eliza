# a7046c18:packages_plugin-sql_src_runtime-migrator_types.d.ts:1-49

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/types.d.ts:1-49
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
export type DrizzleDB = NodePgDatabase | PgliteDatabase;
export interface Journal {
  version: string;
  dialect: string;
  entries: JournalEntry[];
}
export interface JournalEntry {
  idx: number;
  version: string;
  when: number;
  tag: string;
  breakpoints: boolean;
}
export interface MigrationMeta {
  sql: string[];
  folderMillis: number;
  hash: string;
  bps: boolean;
}
export interface SchemaSnapshot {
  version: string;
  dialect: string;
  tables: any;
  schemas: any;
  enums?: any;
  _meta: {
    schemas: any;
    tables: any;
    columns: any;
  };
  internal?: any;
}
export interface MigrationOptions {
  migrationsTable?: string;
  migrationsSchema?: string;
}
export interface RuntimeMigrationOptions {
  /** Run without executing SQL statements */
  dryRun?: boolean;
  /** Log detailed information about the migration */
  verbose?: boolean;
  /** Force migration even in production with destructive changes */
  force?: boolean;
  /** Allow operations that will cause data loss (tables/columns being dropped) */
  allowDataLoss?: boolean;
}
//# sourceMappingURL=types.d.ts.map
```