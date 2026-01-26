# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { logger } from "@elizaos/core";
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
export function checkForDataLoss(diff: SchemaDiff): DataLossCheck {
  const result: DataLossCheck = {
    hasDataLoss: false,
    tablesToRemove: [],
    columnsToRemove: [],
    tablesToTruncate: [],
    typeChanges: [],
    warnings: [],
    requiresConfirmation: false,
  };

  // Check for table deletions
  if (diff.tables.deleted.length > 0) {
    result.hasDataLoss = true;
    result.requiresConfirmation = true;
    result.tablesToRemove = [...diff.tables.deleted];
    for (const table of diff.tables.deleted) {
      result.warnings.push(
        `Table "${table}" will be dropped with all its data`,
      );
    }
  }

  // Check for column deletions
  if (diff.columns.deleted.length > 0) {
    result.hasDataLoss = true;
    result.requiresConfirmation = true;
    for (const col of diff.columns.deleted) {
      result.columnsToRemove.push(`${col.table}.${col.column}`);
      result.warnings.push(
        `Column "${col.column}" in table "${col.table}" will be dropped`,
      );
    }
  }

  // Check for column type changes that might cause data loss
  for (const modified of diff.columns.modified) {
    const from = modified.changes.from;
    const to = modified.changes.to;

    // Check if type change is destructive
    if (from.type !== to.type) {
      const isDestructive = checkIfTypeChangeIsDestructive(from.type, to.type);

      if (isDestructive) {
        result.hasDataLoss = true;
        result.requiresConfirmation = true;
        result.typeChanges.push({
          table: modified.table,
          column: modified.column,
          from: from.type,
          to: to.type,
        });
        result.tablesToTruncate.push(modified.table);
        result.warnings.push(
          `Column "${modified.column}" in table "${modified.table}" changes type from "${from.type}" to "${to.type}". ` +
            `This may require truncating the table to avoid data conversion errors.`,
        );
      }
    }

    // Check for adding NOT NULL without default to existing column
    if (!from.notNull && to.notNull && !to.default) {
      result.hasDataLoss = true;
      result.requiresConfirmation = true;
      result.warnings.push(
        `Column "${modified.column}" in table "${modified.table}" is becoming NOT NULL without a default value. ` +
          `This will fail if the table contains NULL values.`,
      );
    }
  }

  // Check for adding NOT NULL columns without defaults
  for (const added of diff.columns.added) {
    if (added.definition.notNull && !added.definition.default) {
      // This is only a problem if the table already has data
      // We'll flag it as a potential issue
      result.warnings.push(
        `Column "${added.column}" is being added to table "${added.table}" as NOT NULL without a default value. ` +
          `This will fail if the table contains data.`,
      );
      // Don't set requiresConfirmation here - it's only a warning
    }
  }

  return result;
}

/**
 * Normalize SQL types for comparison
 * Handles equivalent type variations between introspected DB and schema definitions
 */
function normalizeType(type: string | undefined): string {
  if (!type) return "";

  const normalized = type.toLowerCase().trim();

  // Handle timestamp variations - all are equivalent
  if (
    normalized === "timestamp without time zone" ||
    normalized === "timestamp with time zone" ||
    normalized === "timestamptz"
  ) {
    return "timestamp";
  }

  // Handle serial vs integer with identity
  // serial is essentially integer with auto-increment
  if (normalized === "serial") {
    return "integer";
  }
  if (normalized === "bigserial") {
    return "bigint";
  }
  if (normalized === "smallserial") {
    return "smallint";
  }

  // Handle numeric/decimal equivalence
  if (normalized.startsWith("numeric") || normalized.startsWith("decimal")) {
    // Extract precision and scale if present
    const match = normalized.match(/\((\d+)(?:,\s*(\d+))?\)/);
    if (match) {
```