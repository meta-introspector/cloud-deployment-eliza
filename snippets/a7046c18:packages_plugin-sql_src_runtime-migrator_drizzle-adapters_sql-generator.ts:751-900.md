# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  // Handle numeric types
  if (type?.match(/^(integer|bigint|smallint|numeric|decimal|real|double)/i)) {
    return String(value);
  }

  // Handle SQL expressions and pre-formatted defaults
  if (typeof value === "string") {
    // Already formatted with type cast (e.g., '[]'::jsonb, '{}'::jsonb)
    // These come from the snapshot and are already properly formatted
    if (value.includes("::")) {
      return value;
    }

    // Already quoted string literals (from snapshot)
    // These start and end with single quotes
    if (value.startsWith("'") && value.endsWith("'")) {
      return value;
    }

    // SQL functions like now(), gen_random_uuid(), etc.
    if (
      value.match(/^\w+\(\)/i) ||
      (value.includes("(") && value.includes(")"))
    ) {
      return value;
    }

    // SQL expressions starting with CURRENT_
    if (value.toUpperCase().startsWith("CURRENT_")) {
      return value;
    }

    // Otherwise, it's an unquoted string literal - wrap and escape
    return `'${value.replace(/'/g, "''")}'`;
  }

  // Default: return as-is
  return String(value);
}

/**
 * Generate CREATE INDEX SQL
 */
function generateCreateIndexSQL(index: any): string {
  const unique = index.isUnique ? "UNIQUE " : "";
  const method = index.method || "btree";
  const columns = index.columns
    .map((c: any) => {
      if (c.isExpression) {
        return c.expression;
      }
      // Only add DESC if explicitly set to false, no NULLS clause by default
      return `"${c.expression}"${c.asc === false ? " DESC" : ""}`;
    })
    .join(", ");

  // Extract index name and table with proper schema handling
  const indexName = index.name.includes(".")
    ? index.name.split(".")[1]
    : index.name;

  // Keep the full table name with schema if present
  let tableRef: string;
  if (index.table?.includes(".")) {
    const [schema, table] = index.table.split(".");
    tableRef = `"${schema}"."${table}"`;
  } else {
    tableRef = `"${index.table || ""}"`;
  }

  // Include schema in table reference for correct index creation
  return `CREATE ${unique}INDEX "${indexName}" ON ${tableRef} USING ${method} (${columns});`;
}

/**
 * Generate DROP INDEX SQL
 */
function generateDropIndexSQL(index: any): string {
  // Extract just the index name without schema
  const indexName = index.name
    ? index.name.includes(".")
      ? index.name.split(".")[1]
      : index.name
    : index;
  // Match Drizzle's format - no schema qualification
  return `DROP INDEX IF EXISTS "${indexName}";`;
}

/**
 * Generate CREATE FOREIGN KEY SQL (for existing tables)
 */
function generateCreateForeignKeySQL(fk: any): string {
  const schemaFrom = fk.schemaFrom || "public";
  const schemaTo = fk.schemaTo || "public";
  const tableFrom = fk.tableFrom;
  const columnsFrom = fk.columnsFrom.map((c: string) => `"${c}"`).join(", ");
  const columnsTo = fk.columnsTo.map((c: string) => `"${c}"`).join(", ");

  let sql = `ALTER TABLE "${schemaFrom}"."${tableFrom}" ADD CONSTRAINT "${fk.name}" FOREIGN KEY (${columnsFrom}) REFERENCES "${schemaTo}"."${fk.tableTo}" (${columnsTo})`;

  if (fk.onDelete) {
    sql += ` ON DELETE ${fk.onDelete}`;
  }

  if (fk.onUpdate) {
    sql += ` ON UPDATE ${fk.onUpdate}`;
  }

  return `${sql};`;
}

/**
 * Generate DROP FOREIGN KEY SQL
 */
function generateDropForeignKeySQL(fk: any): string {
  const [schema, tableName] = fk.tableFrom
    ? fk.tableFrom.includes(".")
      ? fk.tableFrom.split(".")
      : ["public", fk.tableFrom]
    : ["public", ""];
  return `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${fk.name}";`;
}

/**
 * Generate SQL for renaming a table
 */
export function generateRenameTableSQL(
  oldName: string,
  newName: string,
): string {
  const [oldSchema, oldTable] = oldName.includes(".")
    ? oldName.split(".")
    : ["public", oldName];
  const [, newTable] = newName.includes(".")
    ? newName.split(".")
    : ["public", newName];
  return `ALTER TABLE "${oldSchema}"."${oldTable}" RENAME TO "${newTable}";`;
}

/**
 * Generate SQL for renaming a column
 */
export function generateRenameColumnSQL(
  table: string,
  oldName: string,
  newName: string,
): string {
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];
```