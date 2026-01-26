# a7046c18:packages_plugin-sql_src_runtime-migrator_storage_migration-tracker.d.ts:1-18

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/storage/migration-tracker.d.ts:1-18
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { DrizzleDB } from "../types";
export declare class MigrationTracker {
  private db;
  constructor(db: DrizzleDB);
  ensureSchema(): Promise<void>;
  ensureTables(): Promise<void>;
  getLastMigration(pluginName: string): Promise<{
    id: number;
    hash: string;
    created_at: string;
  } | null>;
  recordMigration(
    pluginName: string,
    hash: string,
    createdAt: number,
  ): Promise<void>;
}
//# sourceMappingURL=migration-tracker.d.ts.map
```