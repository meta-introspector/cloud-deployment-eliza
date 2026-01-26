# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_database-introspector.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/database-introspector.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { logger } from "@elizaos/core";
import { sql } from "drizzle-orm";
import type { DrizzleDB, SchemaSnapshot } from "../types";

/**
 * Introspect the current database state and generate a snapshot
 * This is used when no previous snapshot exists for a plugin
 * to capture the existing database state before migrations
 */
export class DatabaseIntrospector {
  constructor(private db: DrizzleDB) {}

  /**
   * Introspect all tables in the database and generate a snapshot
   * @param schemaName - Schema to introspect (default: 'public')
   * @returns Schema snapshot of current database state
   */
  async introspectSchema(
    schemaName: string = "public",
  ): Promise<SchemaSnapshot> {
    logger.info(
      { src: "plugin:sql", schemaName },
      "Starting database introspection",
    );

    const tables: any = {};
    const schemas: any = {};
    const enums: any = {};

    // Get all tables in the schema
    const allTables = await this.getTables(schemaName);

    for (const tableInfo of allTables) {
      const tableName = tableInfo.table_name;
      const tableSchema = tableInfo.table_schema || "public";

      logger.debug(
        { src: "plugin:sql", tableSchema, tableName },
        "Introspecting table",
      );

      // Get columns for this table
      const columns = await this.getColumns(tableSchema, tableName);
      const columnsObject: any = {};
      const uniqueConstraintObject: any = {};

      for (const col of columns) {
        columnsObject[col.column_name] = {
          name: col.column_name,
          type: col.data_type,
          primaryKey: col.is_primary || false,
          notNull: col.is_nullable === "NO",
          default: col.column_default
            ? this.parseDefault(col.column_default, col.data_type)
            : undefined,
        };
      }

      // Get indexes
      const indexes = await this.getIndexes(tableSchema, tableName);
      const indexesObject: any = {};

      for (const idx of indexes) {
        if (!idx.is_primary && !idx.is_unique_constraint) {
          // Skip primary keys and unique constraints
          // Also skip indexes with no columns (partial indexes, expression indexes, etc.)
          if (
            idx.columns &&
            Array.isArray(idx.columns) &&
            idx.columns.length > 0
          ) {
            indexesObject[idx.name] = {
              name: idx.name,
              columns: idx.columns.map((col) => ({
                expression: col,
                isExpression: false,
              })),
              isUnique: idx.is_unique,
              method: idx.method || "btree",
            };
          }
        }
      }

      // Get foreign keys
      const foreignKeys = await this.getForeignKeys(tableSchema, tableName);
      const foreignKeysObject: any = {};

      for (const fk of foreignKeys) {
        foreignKeysObject[fk.name] = {
          name: fk.name,
          tableFrom: tableName,
          schemaFrom: tableSchema,
          tableTo: fk.foreign_table_name,
          schemaTo: fk.foreign_table_schema || "public",
          columnsFrom: [fk.column_name],
          columnsTo: [fk.foreign_column_name],
          onDelete: fk.delete_rule?.toLowerCase() || "no action",
          onUpdate: fk.update_rule?.toLowerCase() || "no action",
        };
      }

      // Get primary keys
      const primaryKeys = await this.getPrimaryKeys(tableSchema, tableName);
      const primaryKeysObject: any = {};

      for (const pk of primaryKeys) {
        primaryKeysObject[pk.name] = {
          name: pk.name,
          columns: pk.columns,
        };
      }

      // Get unique constraints
      const uniqueConstraints = await this.getUniqueConstraints(
        tableSchema,
        tableName,
      );

      for (const unq of uniqueConstraints) {
        uniqueConstraintObject[unq.name] = {
          name: unq.name,
          columns: unq.columns,
          nullsNotDistinct: false, // Default value
        };
      }

      // Get check constraints
      const checkConstraints = await this.getCheckConstraints(
        tableSchema,
        tableName,
      );
      const checksObject: any = {};

      for (const check of checkConstraints) {
        checksObject[check.name] = {
          name: check.name,
          value: check.definition,
        };
      }

      // Build the table object
      tables[`${tableSchema}.${tableName}`] = {
        name: tableName,
        schema: tableSchema,
        columns: columnsObject,
        indexes: indexesObject,
        foreignKeys: foreignKeysObject,
        compositePrimaryKeys: primaryKeysObject,
        uniqueConstraints: uniqueConstraintObject,
```