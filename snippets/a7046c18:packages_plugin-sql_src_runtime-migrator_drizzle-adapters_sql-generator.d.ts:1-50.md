# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.d.ts:1-50

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.d.ts:1-50
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { SchemaSnapshot } from "../types";
import type { SchemaDiff } from "./diff-calculator";
/**
 * Data loss detection result
 * Based on Drizzle's pgPushUtils approach
 */
export interface DataLossCheck {
  hasDataLoss: boolean;
  tablesToRemove: string[];
  columnsToRemove: string[];
  tablesToTruncate: string[];
  typeChanges: Array<{
    table: string;
    column: string;
    from: string;
    to: string;
  }>;
  warnings: string[];
  requiresConfirmation: boolean;
}
/**
 * Check for potential data loss in schema changes
 * Based on Drizzle's pgSuggestions function
 */
export declare function checkForDataLoss(diff: SchemaDiff): DataLossCheck;
/**
 * Generate SQL statements from a schema diff
 * This follows Drizzle's approach: create all tables first, then add foreign keys
 */
export declare function generateMigrationSQL(
  previousSnapshot: SchemaSnapshot | null,
  currentSnapshot: SchemaSnapshot,
  diff?: SchemaDiff,
): Promise<string[]>;
/**
 * Generate SQL for renaming a table
 */
export declare function generateRenameTableSQL(
  oldName: string,
  newName: string,
): string;
/**
 * Generate SQL for renaming a column
 */
export declare function generateRenameColumnSQL(
  table: string,
  oldName: string,
  newName: string,
): string;
//# sourceMappingURL=sql-generator.d.ts.map
```