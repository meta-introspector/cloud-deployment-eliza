# a7046c18:packages_plugin-sql_src_schema_types.ts:1-44

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/types.ts:1-44
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { customType } from "drizzle-orm/pg-core";

/**
 * Represents a custom type for converting a string to a JSONB format and vice versa.
 * @param {Object} options - The options for the custom type.
 * @param {Function} options.dataType - A function that returns the data type as "jsonb".
 * @param {Function} options.toDriver - A function that converts a string to a JSON string.
 * @param {Function} options.fromDriver - A function that converts a JSON string back to a string.
 * @returns {Object} - The custom type for string to JSONB conversion.
 */

export const stringJsonb = customType<{ data: string; driverData: string }>({
  dataType() {
    return "jsonb";
  },
  toDriver(value: string): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): string {
    return JSON.stringify(value);
  },
});

/**
 * Represents a custom type for converting a number to a timestamp string and vice versa.
 * @param {Object} options - The options for the custom type.
 * @param {Function} options.dataType - A function that returns the data type as "timestamptz".
 * @param {Function} options.toDriver - A function that converts a number to a timestamp string using the Date object's toISOString method.
 * @param {Function} options.fromDriver - A function that converts a timestamp string to a number using the Date object's getTime method.
 * @returns {Object} - The custom type for number to timestamp conversion.
 */
export const numberTimestamp = customType<{ data: number; driverData: string }>(
  {
    dataType() {
      return "timestamptz";
    },
    toDriver(value: number): string {
      return new Date(value).toISOString();
    },
    fromDriver(value: string): number {
      return new Date(value).getTime();
    },
  },
);
```