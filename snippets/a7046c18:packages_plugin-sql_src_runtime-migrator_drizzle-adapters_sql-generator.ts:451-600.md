# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 * Generate CREATE TABLE SQL (following Drizzle's pattern)
 * Returns the table creation SQL and separate foreign key SQLs
 */
function generateCreateTableSQL(
  fullTableName: string,
  table: any,
): { tableSQL: string; fkSQLs: string[] } {
  const [schema, tableName] = fullTableName.includes(".")
    ? fullTableName.split(".")
    : ["public", fullTableName];
  const columns: string[] = [];
  const fkSQLs: string[] = [];

  // Add columns
  for (const [colName, colDef] of Object.entries(table.columns || {})) {
    columns.push(generateColumnDefinition(colName, colDef as any));
  }

  // Add composite primary keys if exists
  const primaryKeys = table.compositePrimaryKeys || {};
  for (const [pkName, pkDef] of Object.entries(primaryKeys)) {
    const pk = pkDef as any;
    if (pk.columns && pk.columns.length > 0) {
      columns.push(
        `CONSTRAINT "${pkName}" PRIMARY KEY (${pk.columns.map((c: string) => `"${c}"`).join(", ")})`,
      );
    }
  }

  // Add unique constraints
  const uniqueConstraints = table.uniqueConstraints || {};
  for (const [uqName, uqDef] of Object.entries(uniqueConstraints)) {
    const uq = uqDef as any;
    if (uq.columns && uq.columns.length > 0) {
      const uniqueDef = uq.nullsNotDistinct
        ? `CONSTRAINT "${uqName}" UNIQUE NULLS NOT DISTINCT (${uq.columns.map((c: string) => `"${c}"`).join(", ")})`
        : `CONSTRAINT "${uqName}" UNIQUE (${uq.columns.map((c: string) => `"${c}"`).join(", ")})`;
      columns.push(uniqueDef);
    }
  }

  // Add check constraints
  const checkConstraints = table.checkConstraints || {};
  for (const [checkName, checkDef] of Object.entries(checkConstraints)) {
    const check = checkDef as any;
    if (check.value) {
      columns.push(`CONSTRAINT "${checkName}" CHECK (${check.value})`);
    }
  }

  // Following drizzle-kit pattern: don't create schema here, it's handled separately
  const tableSQL = `CREATE TABLE IF NOT EXISTS "${schema}"."${tableName}" (\n  ${columns.join(",\n  ")}\n);`;

  // Collect foreign keys to be added AFTER all tables are created
  const foreignKeys = table.foreignKeys || {};
  for (const [fkName, fkDef] of Object.entries(foreignKeys)) {
    const fk = fkDef as any;
    const fkSQL = `ALTER TABLE "${schema}"."${tableName}" ADD CONSTRAINT "${fkName}" FOREIGN KEY (${fk.columnsFrom.map((c: string) => `"${c}"`).join(", ")}) REFERENCES "${fk.schemaTo || "public"}"."${fk.tableTo}" (${fk.columnsTo.map((c: string) => `"${c}"`).join(", ")})${fk.onDelete ? ` ON DELETE ${fk.onDelete}` : ""}${fk.onUpdate ? ` ON UPDATE ${fk.onUpdate}` : ""};`;
    fkSQLs.push(fkSQL);
  }

  return { tableSQL, fkSQLs };
}

/**
 * Generate column definition (following Drizzle's pattern)
 */
function generateColumnDefinition(name: string, def: any): string {
  let sql = `"${name}" ${def.type}`;

  // Handle primary key that's not part of composite
  if (def.primaryKey && !def.type.includes("SERIAL")) {
    sql += " PRIMARY KEY";
  }

  // Add NOT NULL constraint
  if (def.notNull) {
    sql += " NOT NULL";
  }

  // Add DEFAULT value - properly formatted
  if (def.default !== undefined) {
    const defaultValue = formatDefaultValue(def.default, def.type);
    sql += ` DEFAULT ${defaultValue}`;
  }

  return sql;
}

/**
 * Generate ALTER TABLE ADD COLUMN SQL
 * Based on Drizzle's PgAlterTableAddColumnConvertor
 */
function generateAddColumnSQL(
  table: string,
  column: string,
  definition: any,
): string {
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];
  const tableNameWithSchema = `"${schema}"."${tableName}"`;

  // Build column definition parts in the correct order (like Drizzle)
  const parts: string[] = [`"${column}"`];

  // Type
  parts.push(definition.type);

  // Primary key
  if (definition.primaryKey) {
    parts.push("PRIMARY KEY");
  }

  // Default value - needs proper formatting based on type
  if (definition.default !== undefined) {
    const defaultValue = formatDefaultValue(
      definition.default,
      definition.type,
    );
    if (defaultValue) {
      parts.push(`DEFAULT ${defaultValue}`);
    }
  }

  // Generated columns
  if (definition.generated) {
    parts.push(`GENERATED ALWAYS AS (${definition.generated}) STORED`);
  }

  // NOT NULL constraint - comes after DEFAULT
  if (definition.notNull) {
    parts.push("NOT NULL");
  }

  return `ALTER TABLE ${tableNameWithSchema} ADD COLUMN ${parts.join(" ")};`;
}

/**
 * Generate ALTER TABLE DROP COLUMN SQL
 * Based on Drizzle's approach with CASCADE
 */
function generateDropColumnSQL(table: string, column: string): string {
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];
  const tableNameWithSchema = `"${schema}"."${tableName}"`;
  // Use CASCADE to handle dependent objects
  return `ALTER TABLE ${tableNameWithSchema} DROP COLUMN "${column}" CASCADE;`;
}
```