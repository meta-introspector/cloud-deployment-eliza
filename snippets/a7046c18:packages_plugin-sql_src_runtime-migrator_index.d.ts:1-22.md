# a7046c18:packages_plugin-sql_src_runtime-migrator_index.d.ts:1-22

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/index.d.ts:1-22
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
export {
  calculateDiff,
  hasDiffChanges,
  type SchemaDiff,
} from "./drizzle-adapters/diff-calculator";
export {
  createEmptySnapshot,
  generateSnapshot,
  hasChanges,
  hashSnapshot,
} from "./drizzle-adapters/snapshot-generator";
export {
  generateMigrationSQL,
  generateRenameColumnSQL,
  generateRenameTableSQL,
} from "./drizzle-adapters/sql-generator";
export { RuntimeMigrator } from "./runtime-migrator";
export { JournalStorage } from "./storage/journal-storage";
export { MigrationTracker } from "./storage/migration-tracker";
export { SnapshotStorage } from "./storage/snapshot-storage";
export * from "./types";
//# sourceMappingURL=index.d.ts.map
```