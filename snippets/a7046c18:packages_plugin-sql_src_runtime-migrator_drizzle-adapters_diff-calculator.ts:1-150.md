# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_diff-calculator.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/diff-calculator.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { SchemaSnapshot } from "../types";

/**
 * Normalize SQL types for comparison
 * Handles equivalent type variations between introspected DB and schema definitions
 */
function normalizeType(type: string | undefined): string {
  if (!type) return "";

  const normalized = type.toLowerCase().trim();

  // Handle timestamp variations
  if (
    normalized === "timestamp without time zone" ||
    normalized === "timestamp with time zone"
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
      return `numeric(${match[1]}${match[2] ? `,${match[2]}` : ""})`;
    }
    return "numeric";
  }

  // Handle varchar/character varying
  if (normalized.startsWith("character varying")) {
    return normalized.replace("character varying", "varchar");
  }

  // Handle text array variations
  if (normalized === "text[]" || normalized === "_text") {
    return "text[]";
  }

  return normalized;
}

/**
 * Helper function to compare two index definitions
 * Returns true if indexes are different and need to be recreated
 */
function isIndexChanged(prevIndex: any, currIndex: any): boolean {
  // Compare basic properties
  if (prevIndex.isUnique !== currIndex.isUnique) return true;
  if (prevIndex.method !== currIndex.method) return true;
  if (prevIndex.where !== currIndex.where) return true;
  if (prevIndex.concurrently !== currIndex.concurrently) return true;

  // Compare columns array - must be same columns in same order
  const prevColumns = prevIndex.columns || [];
  const currColumns = currIndex.columns || [];

  if (prevColumns.length !== currColumns.length) return true;

  for (let i = 0; i < prevColumns.length; i++) {
    const prevCol = prevColumns[i];
    const currCol = currColumns[i];

    // Handle both string columns and expression columns
    if (typeof prevCol === "string" && typeof currCol === "string") {
      if (prevCol !== currCol) return true;
    } else if (typeof prevCol === "object" && typeof currCol === "object") {
      // Compare expression columns
      if (prevCol.expression !== currCol.expression) return true;
      if (prevCol.isExpression !== currCol.isExpression) return true;
      if (prevCol.asc !== currCol.asc) return true;
      if (prevCol.nulls !== currCol.nulls) return true;
    } else {
      // Type mismatch (one is string, other is object)
      return true;
    }
  }

  return false;
}

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
      // Indexes with same name but different definition
      old: any;
      new: any;
    }>;
  };
  foreignKeys: {
    created: any[];
    deleted: any[];
    altered: Array<{
      // FKs with modified CASCADE behavior
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
export async function calculateDiff(
```