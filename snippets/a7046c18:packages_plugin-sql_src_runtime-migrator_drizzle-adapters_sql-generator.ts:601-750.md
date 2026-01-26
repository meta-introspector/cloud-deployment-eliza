# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

/**
 * Generate ALTER TABLE ALTER COLUMN SQL
 * Based on Drizzle's approach with proper type casting and handling
 */
function generateAlterColumnSQL(
  table: string,
  column: string,
  changes: any,
): string[] {
  const [schema, tableName] = table.includes(".")
    ? table.split(".")
    : ["public", table];
  const tableNameWithSchema = `"${schema}"."${tableName}"`;
  const statements: string[] = [];

  // Handle type changes - need to handle enums and complex types
  if (changes.to?.type !== changes.from?.type) {
    const newType = changes.to?.type || "TEXT";

    // Check if we need a USING clause for type conversion
    const needsUsing = checkIfNeedsUsingClause(changes.from?.type, newType);

    if (needsUsing) {
      // For complex type changes, use USING clause like Drizzle
      statements.push(
        `ALTER TABLE ${tableNameWithSchema} ALTER COLUMN "${column}" TYPE ${newType} USING "${column}"::text::${newType};`,
      );
    } else {
      statements.push(
        `ALTER TABLE ${tableNameWithSchema} ALTER COLUMN "${column}" SET DATA TYPE ${newType};`,
      );
    }
  }

  // Handle NOT NULL changes
  if (changes.to?.notNull !== changes.from?.notNull) {
    if (changes.to?.notNull) {
      // When adding NOT NULL, might need to set defaults for existing NULL values
      statements.push(
        `ALTER TABLE ${tableNameWithSchema} ALTER COLUMN "${column}" SET NOT NULL;`,
      );
    } else {
      statements.push(
        `ALTER TABLE ${tableNameWithSchema} ALTER COLUMN "${column}" DROP NOT NULL;`,
      );
    }
  }

  // Handle default value changes
  if (changes.to?.default !== changes.from?.default) {
    if (changes.to?.default !== undefined) {
      const defaultValue = formatDefaultValue(
        changes.to.default,
        changes.to?.type,
      );
      statements.push(
        `ALTER TABLE ${tableNameWithSchema} ALTER COLUMN "${column}" SET DEFAULT ${defaultValue};`,
      );
    } else {
      statements.push(
        `ALTER TABLE ${tableNameWithSchema} ALTER COLUMN "${column}" DROP DEFAULT;`,
      );
    }
  }

  return statements;
}

/**
 * Check if a type change needs a USING clause
 * Based on Drizzle's type conversion logic
 */
function checkIfNeedsUsingClause(fromType: string, toType: string): boolean {
  if (!fromType || !toType) return false;

  // Enum changes always need USING
  if (fromType.includes("enum") || toType.includes("enum")) {
    return true;
  }

  const fromBase = fromType.split("(")[0].toLowerCase();
  const toBase = toType.split("(")[0].toLowerCase();

  // Text/varchar to JSONB always needs USING
  if (
    (fromBase === "text" ||
      fromBase === "varchar" ||
      fromBase === "character varying") &&
    (toBase === "jsonb" || toBase === "json")
  ) {
    return true;
  }

  // Some specific type conversions need USING
  const needsUsingPairs = [
    ["integer", "boolean"],
    ["boolean", "integer"],
    ["text", "integer"],
    ["text", "numeric"],
    ["text", "boolean"],
    ["text", "uuid"],
    ["text", "jsonb"],
    ["text", "json"],
    ["varchar", "integer"],
    ["varchar", "numeric"],
    ["varchar", "boolean"],
    ["varchar", "uuid"],
    ["varchar", "jsonb"],
    ["varchar", "json"],
    ["character varying", "jsonb"],
    ["character varying", "json"],
    // Add more as needed based on PostgreSQL casting rules
  ];

  for (const [from, to] of needsUsingPairs) {
    if (
      (fromBase === from && toBase === to) ||
      (fromBase === to && toBase === from)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Format a default value for SQL
 * Based on Drizzle's default value formatting
 */
function formatDefaultValue(value: any, type: string): string {
  // Handle NULL
  if (value === null || value === "NULL") {
    return "NULL";
  }

  // Handle boolean
  if (
    type &&
    (type.toLowerCase().includes("boolean") || type.toLowerCase() === "bool")
  ) {
    if (value === true || value === "true" || value === "t" || value === 1) {
      return "true";
    }
    if (value === false || value === "false" || value === "f" || value === 0) {
      return "false";
    }
  }

```