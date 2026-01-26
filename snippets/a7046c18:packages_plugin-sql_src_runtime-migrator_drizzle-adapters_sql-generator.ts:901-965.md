# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:901-965

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:901-965
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  return `ALTER TABLE "${schema}"."${tableName}" RENAME COLUMN "${oldName}" TO "${newName}";`;
}

/**
 * Generate CREATE UNIQUE CONSTRAINT SQL
 */
function generateCreateUniqueConstraintSQL(constraint: any): string {
  const table = constraint.table || "";
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];

  const name = constraint.name;
  const columns = constraint.columns.map((c: string) => `"${c}"`).join(", ");

  let sql = `ALTER TABLE "${schema}"."${tableName}" ADD CONSTRAINT "${name}" UNIQUE`;

  // Handle NULLS NOT DISTINCT if specified (PostgreSQL 15+)
  if (constraint.nullsNotDistinct) {
    sql += ` NULLS NOT DISTINCT`;
  }

  sql += ` (${columns});`;

  return sql;
}

/**
 * Generate DROP UNIQUE CONSTRAINT SQL
 */
function generateDropUniqueConstraintSQL(constraint: any): string {
  const table = constraint.table || "";
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];

  return `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${constraint.name}";`;
}

/**
 * Generate CREATE CHECK CONSTRAINT SQL
 */
function generateCreateCheckConstraintSQL(constraint: any): string {
  const table = constraint.table || "";
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];

  const name = constraint.name;
  const value = constraint.value;

  return `ALTER TABLE "${schema}"."${tableName}" ADD CONSTRAINT "${name}" CHECK (${value});`;
}

/**
 * Generate DROP CHECK CONSTRAINT SQL
 */
function generateDropCheckConstraintSQL(constraint: any): string {
  const table = constraint.table || "";
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];

  return `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${constraint.name}";`;
}
```