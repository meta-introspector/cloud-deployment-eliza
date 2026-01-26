# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_snapshot-generator.d.ts:1-22

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/snapshot-generator.d.ts:1-22
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { SchemaSnapshot } from "../types";
/**
 * Generate a snapshot from a Drizzle schema
 * This is a port of Drizzle's pgSerializer.generatePgSnapshot
 */
export declare function generateSnapshot(schema: any): Promise<SchemaSnapshot>;
/**
 * Calculate hash of a snapshot for change detection
 */
export declare function hashSnapshot(snapshot: SchemaSnapshot): string;
/**
 * Create an empty snapshot for initial migration
 */
export declare function createEmptySnapshot(): SchemaSnapshot;
/**
 * Compare two snapshots and detect if there are changes
 */
export declare function hasChanges(
  previousSnapshot: SchemaSnapshot | null,
  currentSnapshot: SchemaSnapshot,
): boolean;
//# sourceMappingURL=snapshot-generator.d.ts.map
```