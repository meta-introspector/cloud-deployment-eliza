# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_snapshot-generator.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/snapshot-generator.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { createHash } from "node:crypto";
import { is, SQL } from "drizzle-orm";
import {
  getTableConfig,
  type PgColumn,
  PgDialect,
  PgTable,
} from "drizzle-orm/pg-core";
import type { SchemaSnapshot } from "../types";

/**
 * Utility functions from Drizzle's code
 */
function escapeSingleQuotes(str: string): string {
  return str.replace(/'/g, "''");
}

function isPgArrayType(sqlType: string): boolean {
  return sqlType.match(/.*\[\d*\].*|.*\[\].*/g) !== null;
}

function buildArrayString(array: any[], sqlType: string): string {
  sqlType = sqlType.split("[")[0];
  const values = array
    .map((value) => {
      if (typeof value === "number" || typeof value === "bigint") {
        return value.toString();
      } else if (typeof value === "boolean") {
        return value ? "true" : "false";
      } else if (Array.isArray(value)) {
        return buildArrayString(value, sqlType);
      } else if (value instanceof Date) {
        if (sqlType === "date") {
          return `"${value.toISOString().split("T")[0]}"`;
        } else if (sqlType === "timestamp") {
          return `"${value.toISOString().replace("T", " ").slice(0, 23)}"`;
        } else {
          return `"${value.toISOString()}"`;
        }
      } else if (typeof value === "object") {
        return `"${JSON.stringify(value).replaceAll('"', '\\"')}"`;
      }

      return `"${value}"`;
    })
    .join(",");

  return `{${values}}`;
}

const sqlToStr = (sql: SQL, casing: any) => {
  return sql.toQuery({
    escapeName: () => {
      throw new Error("we don't support params for `sql` default values");
    },
    escapeParam: () => {
      throw new Error("we don't support params for `sql` default values");
    },
    escapeString: () => {
      throw new Error("we don't support params for `sql` default values");
    },
    casing,
  }).sql;
};

/**
 * Extract Drizzle tables from a schema object
 */
function extractTablesFromSchema(schema: any): PgTable[] {
  const tables: PgTable[] = [];

  // Iterate through all exports in the schema
  const exports = Object.values(schema);
  exports.forEach((t: any) => {
    // Check if it's a PgTable using Drizzle's is() function
    if (is(t, PgTable)) {
      tables.push(t);
    }
  });

  return tables;
}

/**
 * Generate a snapshot from a Drizzle schema
 * This is a port of Drizzle's pgSerializer.generatePgSnapshot
 */
export async function generateSnapshot(schema: any): Promise<SchemaSnapshot> {
  const dialect = new PgDialect({ casing: undefined });
  const tables: any = {};
  const schemas: any = {};
  const enums: any = {};

  // Extract tables from schema
  const pgTables = extractTablesFromSchema(schema);

  // Process each table
  for (const table of pgTables) {
    const config = getTableConfig(table);
    const {
      name: tableName,
      columns,
      indexes,
      foreignKeys,
      schema: tableSchema,
      primaryKeys,
      uniqueConstraints,
      checks,
    } = config;

    const columnsObject: any = {};
    const indexesObject: any = {};
    const foreignKeysObject: any = {};
    const primaryKeysObject: any = {};
    const uniqueConstraintObject: any = {};
    const checksObject: any = {};

    // Process columns - EXACT copy of Drizzle's logic
    columns.forEach((column: PgColumn) => {
      const name = column.name;
      const notNull = column.notNull;
      const primaryKey = column.primary;
      const sqlType = column.getSQLType();
      const sqlTypeLowered = sqlType.toLowerCase();

      const columnToSet: any = {
        name,
        type: sqlType,
        primaryKey,
        notNull,
      };

      // Handle defaults - EXACT copy from Drizzle's pgSerializer.ts lines 247-273
      if (column.default !== undefined) {
        if (is(column.default, SQL)) {
          columnToSet.default = sqlToStr(column.default, undefined);
        } else {
          if (typeof column.default === "string") {
            columnToSet.default = `'${escapeSingleQuotes(column.default)}'`;
          } else {
            if (sqlTypeLowered === "jsonb" || sqlTypeLowered === "json") {
              columnToSet.default = `'${JSON.stringify(column.default)}'::${sqlTypeLowered}`;
            } else if (column.default instanceof Date) {
              if (sqlTypeLowered === "date") {
                columnToSet.default = `'${column.default.toISOString().split("T")[0]}'`;
              } else if (sqlTypeLowered === "timestamp") {
                columnToSet.default = `'${column.default.toISOString().replace("T", " ").slice(0, 23)}'`;
              } else {
                columnToSet.default = `'${column.default.toISOString()}'`;
              }
```