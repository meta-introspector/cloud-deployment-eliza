# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_diff-calculator.d.ts:1-63

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/diff-calculator.d.ts:1-63
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { SchemaSnapshot } from "../types";
export interface SchemaDiff {
  tables: {
    created: string[];
    deleted: string[];
    modified: Array<{
      name: string;
      changes: any;
    }>;
  };
  columns: {
    added: Array<{
      table: string;
      column: string;
      definition: any;
    }>;
    deleted: Array<{
      table: string;
      column: string;
    }>;
    modified: Array<{
      table: string;
      column: string;
      changes: any;
    }>;
  };
  indexes: {
    created: any[];
    deleted: any[];
    altered: Array<{
      old: any;
      new: any;
    }>;
  };
  foreignKeys: {
    created: any[];
    deleted: any[];
    altered: Array<{
      old: any;
      new: any;
    }>;
  };
  uniqueConstraints: {
    created: any[];
    deleted: any[];
  };
  checkConstraints: {
    created: any[];
    deleted: any[];
  };
}
/**
 * Calculate the difference between two snapshots
 */
export declare function calculateDiff(
  previousSnapshot: SchemaSnapshot | null,
  currentSnapshot: SchemaSnapshot,
): Promise<SchemaDiff>;
/**
 * Check if a diff has any changes
 */
export declare function hasDiffChanges(diff: SchemaDiff): boolean;
//# sourceMappingURL=diff-calculator.d.ts.map
```