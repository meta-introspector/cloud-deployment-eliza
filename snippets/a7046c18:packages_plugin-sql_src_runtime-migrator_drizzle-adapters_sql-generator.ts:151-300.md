# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
 * Check if a type change is destructive
 * Based on PostgreSQL's type casting rules
 */
function checkIfTypeChangeIsDestructive(
  fromType: string,
  toType: string,
): boolean {
  // First normalize the types to handle equivalent variations
  const normalizedFrom = normalizeType(fromType);
  const normalizedTo = normalizeType(toType);

  // If normalized types match, it's not destructive
  if (normalizedFrom === normalizedTo) {
    return false;
  }

  // Safe conversions (PostgreSQL) - based on Drizzle's logic
  const safeConversions: Record<string, string[]> = {
    smallint: ["integer", "bigint", "numeric", "real", "double precision"],
    integer: ["bigint", "numeric", "real", "double precision"],
    bigint: ["numeric"],
    real: ["double precision"],
    varchar: ["text"],
    char: ["varchar", "text"],
    citext: ["text"],
    text: ["citext"],
    // UUID to text is safe
    uuid: ["text", "varchar"],
    // Timestamp variations are generally safe (now handled by normalization)
    timestamp: ["timestamp"], // Simplified since normalization handles variations
    // Date/time conversions
    date: ["timestamp"],
    time: ["timetz"],
  };

  const fromBase = normalizedFrom.split("(")[0];
  const toBase = normalizedTo.split("(")[0];

  // Same type is always safe
  if (fromBase === toBase) {
    return false;
  }

  // Check if it's a safe conversion
  const safeTo = safeConversions[fromBase];
  if (safeTo?.includes(toBase)) {
    return false;
  }

  // All other conversions are considered potentially destructive
  return true;
}

/**
 * Generate SQL statements from a schema diff
 * This follows Drizzle's approach: create all tables first, then add foreign keys
 */
export async function generateMigrationSQL(
  previousSnapshot: SchemaSnapshot | null,
  currentSnapshot: SchemaSnapshot,
  diff?: SchemaDiff,
): Promise<string[]> {
  const statements: string[] = [];

  // If no diff provided, calculate it
  if (!diff) {
    const { calculateDiff } = await import("./diff-calculator");
    diff = await calculateDiff(previousSnapshot, currentSnapshot);
  }

  // Check for data loss
  const dataLossCheck = checkForDataLoss(diff);

  // Log warnings if any
  if (dataLossCheck.warnings.length > 0) {
    logger.warn(
      { src: "plugin:sql", warnings: dataLossCheck.warnings },
      "Schema changes may cause data loss",
    );
  }

  // Phase 1: Collect unique schemas and create them first
  const schemasToCreate = new Set<string>();
  for (const tableName of diff.tables.created) {
    const table = currentSnapshot.tables[tableName];
    if (table) {
      const schema = table.schema || "public";
      if (schema !== "public") {
        schemasToCreate.add(schema);
      }
    }
  }

  // Create schemas first (following drizzle-kit pattern)
  for (const schema of schemasToCreate) {
    statements.push(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);
  }

  // Phase 2: Generate CREATE TABLE statements for new tables (WITHOUT foreign keys)
  const createTableStatements: string[] = [];
  const foreignKeyStatements: string[] = [];

  for (const tableName of diff.tables.created) {
    const table = currentSnapshot.tables[tableName];
    if (table) {
      const { tableSQL, fkSQLs } = generateCreateTableSQL(tableName, table);
      createTableStatements.push(tableSQL);
      foreignKeyStatements.push(...fkSQLs);
    }
  }

  // Add all CREATE TABLE statements
  statements.push(...createTableStatements);

  // Phase 3: Add all foreign keys AFTER tables are created
  // Deduplicate foreign key statements to avoid duplicate constraints
  const uniqueFKs = new Set<string>();
  const dedupedFKStatements: string[] = [];

  for (const fkSQL of foreignKeyStatements) {
    // Extract constraint name to check for duplicates
    const match = fkSQL.match(/ADD CONSTRAINT "([^"]+)"/);
    if (match) {
      const constraintName = match[1];
      if (!uniqueFKs.has(constraintName)) {
        uniqueFKs.add(constraintName);
        dedupedFKStatements.push(fkSQL);
      }
    } else {
      dedupedFKStatements.push(fkSQL);
    }
```