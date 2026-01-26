# a7046c18:packages_plugin-sql_src_runtime-migrator_storage_snapshot-storage.d.ts:1-14

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/storage/snapshot-storage.d.ts:1-14
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { DrizzleDB, SchemaSnapshot } from "../types";
export declare class SnapshotStorage {
  private db;
  constructor(db: DrizzleDB);
  saveSnapshot(
    pluginName: string,
    idx: number,
    snapshot: SchemaSnapshot,
  ): Promise<void>;
  loadSnapshot(pluginName: string, idx: number): Promise<SchemaSnapshot | null>;
  getLatestSnapshot(pluginName: string): Promise<SchemaSnapshot | null>;
  getAllSnapshots(pluginName: string): Promise<SchemaSnapshot[]>;
}
//# sourceMappingURL=snapshot-storage.d.ts.map
```