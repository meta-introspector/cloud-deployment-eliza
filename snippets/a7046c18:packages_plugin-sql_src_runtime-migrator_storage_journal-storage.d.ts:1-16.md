# a7046c18:packages_plugin-sql_src_runtime-migrator_storage_journal-storage.d.ts:1-16

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/storage/journal-storage.d.ts:1-16
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { DrizzleDB, Journal, JournalEntry } from "../types";
export declare class JournalStorage {
  private db;
  constructor(db: DrizzleDB);
  loadJournal(pluginName: string): Promise<Journal | null>;
  saveJournal(pluginName: string, journal: Journal): Promise<void>;
  addEntry(pluginName: string, entry: JournalEntry): Promise<void>;
  getNextIdx(pluginName: string): Promise<number>;
  updateJournal(
    pluginName: string,
    idx: number,
    tag: string,
    breakpoints?: boolean,
  ): Promise<void>;
}
//# sourceMappingURL=journal-storage.d.ts.map
```