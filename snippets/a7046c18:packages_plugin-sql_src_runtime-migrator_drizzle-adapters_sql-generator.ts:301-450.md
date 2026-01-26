# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_sql-generator.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/sql-generator.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }

  statements.push(...dedupedFKStatements);

  // Phase 4: Handle table modifications

  // Generate DROP TABLE statements for deleted tables
  for (const tableName of diff.tables.deleted) {
    const [schema, name] = tableName.includes(".")
      ? tableName.split(".")
      : ["public", tableName];
    statements.push(`DROP TABLE IF EXISTS "${schema}"."${name}" CASCADE;`);
  }

  // Generate ALTER TABLE statements for column changes
  // Handle column additions
  for (const added of diff.columns.added) {
    statements.push(
      generateAddColumnSQL(added.table, added.column, added.definition),
    );
  }

  // Handle column deletions
  for (const deleted of diff.columns.deleted) {
    statements.push(generateDropColumnSQL(deleted.table, deleted.column));
  }

  // Handle column modifications
  for (const modified of diff.columns.modified) {
    const alterStatements = generateAlterColumnSQL(
      modified.table,
      modified.column,
      modified.changes,
    );
    statements.push(...alterStatements);
  }

  // Generate DROP INDEX statements (including altered ones - drop old version)
  for (const index of diff.indexes.deleted) {
    statements.push(generateDropIndexSQL(index));
  }

  // Drop old version of altered indexes
  for (const alteredIndex of diff.indexes.altered) {
    statements.push(generateDropIndexSQL(alteredIndex.old));
  }

  // Generate CREATE INDEX statements (including altered ones - create new version)
  for (const index of diff.indexes.created) {
    statements.push(generateCreateIndexSQL(index));
  }

  // Create new version of altered indexes
  for (const alteredIndex of diff.indexes.altered) {
    statements.push(generateCreateIndexSQL(alteredIndex.new));
  }

  // Generate CREATE UNIQUE CONSTRAINT statements
  for (const constraint of diff.uniqueConstraints.created) {
    // Skip if it's part of a new table (already handled)
    const isNewTable = diff.tables.created.some((tableName) => {
      const [schema, table] = tableName.includes(".")
        ? tableName.split(".")
        : ["public", tableName];
      const constraintTable = constraint.table || "";
      const [constraintSchema, constraintTableName] = constraintTable.includes(
        ".",
      )
        ? constraintTable.split(".")
        : ["public", constraintTable];
      return table === constraintTableName && schema === constraintSchema;
    });

    if (!isNewTable) {
      statements.push(generateCreateUniqueConstraintSQL(constraint));
    }
  }

  // Generate DROP UNIQUE CONSTRAINT statements
  for (const constraint of diff.uniqueConstraints.deleted) {
    statements.push(generateDropUniqueConstraintSQL(constraint));
  }

  // Generate CREATE CHECK CONSTRAINT statements
  for (const constraint of diff.checkConstraints.created) {
    // Skip if it's part of a new table (already handled)
    const isNewTable = diff.tables.created.some((tableName) => {
      const [schema, table] = tableName.includes(".")
        ? tableName.split(".")
        : ["public", tableName];
      const constraintTable = constraint.table || "";
      const [constraintSchema, constraintTableName] = constraintTable.includes(
        ".",
      )
        ? constraintTable.split(".")
        : ["public", constraintTable];
      return table === constraintTableName && schema === constraintSchema;
    });

    if (!isNewTable) {
      statements.push(generateCreateCheckConstraintSQL(constraint));
    }
  }

  // Generate DROP CHECK CONSTRAINT statements
  for (const constraint of diff.checkConstraints.deleted) {
    statements.push(generateDropCheckConstraintSQL(constraint));
  }

  // Handle foreign key deletions first (including altered ones)
  for (const fk of diff.foreignKeys.deleted) {
    statements.push(generateDropForeignKeySQL(fk));
  }

  // Drop old version of altered foreign keys
  for (const alteredFK of diff.foreignKeys.altered) {
    statements.push(generateDropForeignKeySQL(alteredFK.old));
  }

  // Handle foreign key creations (for existing tables)
  for (const fk of diff.foreignKeys.created) {
    // Only add if it's not part of a new table (those were handled above)
    // Check both with and without schema prefix
    const tableFrom = fk.tableFrom || "";
    const schemaFrom = fk.schemaFrom || "public";

    const isNewTable = diff.tables.created.some((tableName) => {
      // Compare table names, handling schema prefixes
      const [createdSchema, createdTable] = tableName.includes(".")
        ? tableName.split(".")
        : ["public", tableName];

      // Compare using the actual schema and table from the FK
      return createdTable === tableFrom && createdSchema === schemaFrom;
    });

    if (!isNewTable) {
      statements.push(generateCreateForeignKeySQL(fk));
    }
  }

  // Create new version of altered foreign keys
  for (const alteredFK of diff.foreignKeys.altered) {
    statements.push(generateCreateForeignKeySQL(alteredFK.new));
  }

  return statements;
}

/**
```