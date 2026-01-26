# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_snapshot-generator.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/snapshot-generator.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            } else if (
              isPgArrayType(sqlTypeLowered) &&
              Array.isArray(column.default)
            ) {
              columnToSet.default = `'${buildArrayString(column.default, sqlTypeLowered)}'`;
            } else {
              // Should do for all types
              // columnToSet.default = `'${column.default}'::${sqlTypeLowered}`;
              columnToSet.default = column.default;
            }
          }
        }
      }

      // Handle column-level unique constraints
      // IMPORTANT: Check isUnique, not just uniqueName presence!
      // Drizzle sets uniqueName for all columns but only unique ones should have constraints
      if ((column as any).isUnique && (column as any).config?.uniqueName) {
        uniqueConstraintObject[(column as any).config.uniqueName] = {
          name: (column as any).config.uniqueName,
          columns: [name],
          nullsNotDistinct:
            (column as any).config?.uniqueType === "not distinct",
        };
      }

      columnsObject[name] = columnToSet;
    });

    // Process primary keys
    primaryKeys.forEach((pk: any) => {
      const columnNames = pk.columns.map((c: any) => c.name);
      const name = pk.getName();

      primaryKeysObject[name] = {
        name,
        columns: columnNames,
      };
    });

    // Process unique constraints
    uniqueConstraints?.forEach((unq: any) => {
      const columnNames = unq.columns.map((c: any) => c.name);
      const name = unq.name || `${tableName}_${columnNames.join("_")}_unique`;

      uniqueConstraintObject[name] = {
        name,
        columns: columnNames,
        nullsNotDistinct: unq.nullsNotDistinct,
      };
    });

    // Process foreign keys - includes both explicit foreignKeys and inline references
    // Drizzle's getTableConfig automatically collects inline .references() into foreignKeys
    foreignKeys.forEach((fk: any) => {
      const reference = fk.reference();
      const columnsFrom = reference.columns.map((it: any) => it.name);
      const columnsTo = reference.foreignColumns.map((it: any) => it.name);
      const tableTo = getTableConfig(reference.foreignTable).name;
      const schemaTo =
        getTableConfig(reference.foreignTable).schema || "public";

      const name = fk.getName();

      foreignKeysObject[name] = {
        name,
        tableFrom: tableName,
        schemaFrom: tableSchema, // Add source table schema
        tableTo,
        schemaTo,
        columnsFrom,
        columnsTo,
        onDelete: fk.onDelete || "no action",
        onUpdate: fk.onUpdate || "no action",
      };
    });

    // Process indexes
    indexes.forEach((idx: any) => {
      const columns = idx.config.columns;
      const indexColumns = columns.map((col: any) => {
        if (is(col, SQL)) {
          return {
            expression: dialect.sqlToQuery(col).sql,
            isExpression: true,
          };
        } else {
          const indexCol: any = {
            expression: col.name,
            isExpression: false,
            asc: col.indexConfig?.order === "asc",
          };
          // Only add nulls if explicitly specified in the config
          if (col.indexConfig?.nulls) {
            indexCol.nulls = col.indexConfig.nulls;
          }
          return indexCol;
        }
      });

      const name =
        idx.config.name ||
        `${tableName}_${indexColumns.map((c: any) => c.expression).join("_")}_index`;

      indexesObject[name] = {
        name,
        columns: indexColumns,
        isUnique: idx.config.unique || false,
        method: idx.config.method || "btree",
      };
    });

    // Process check constraints
    if (checks) {
      checks.forEach((check: any) => {
        const checkName = check.name;
        checksObject[checkName] = {
          name: checkName,
          value: dialect.sqlToQuery(check.value).sql,
        };
      });
    }

    // Build the table object
    tables[`${tableSchema || "public"}.${tableName}`] = {
      name: tableName,
      schema: tableSchema || "public",
      columns: columnsObject,
      indexes: indexesObject,
      foreignKeys: foreignKeysObject,
      compositePrimaryKeys: primaryKeysObject,
      uniqueConstraints: uniqueConstraintObject,
      checkConstraints: checksObject,
    };

    // Track schemas
    if (tableSchema && tableSchema !== "public") {
      schemas[tableSchema] = tableSchema;
    }
  }

  // Create snapshot in Drizzle's format
  const snapshot: SchemaSnapshot = {
    version: "7",
    dialect: "postgresql",
    tables,
    schemas,
    enums,
    _meta: {
      schemas: {},
```