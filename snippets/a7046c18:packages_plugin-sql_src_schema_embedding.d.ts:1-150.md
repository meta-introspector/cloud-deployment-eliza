# a7046c18:packages_plugin-sql_src_schema_embedding.d.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/embedding.d.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { VECTOR_DIMS } from "@elizaos/core";
export declare const DIMENSION_MAP: {
  readonly [VECTOR_DIMS.SMALL]: "dim384";
  readonly [VECTOR_DIMS.MEDIUM]: "dim512";
  readonly [VECTOR_DIMS.LARGE]: "dim768";
  readonly [VECTOR_DIMS.XL]: "dim1024";
  readonly [VECTOR_DIMS.XXL]: "dim1536";
  readonly [VECTOR_DIMS.XXXL]: "dim3072";
};
/**
 * Definition of the embeddings table in the database.
 * Contains columns for ID, Memory ID, Creation Timestamp, and multiple vector dimensions.
 */
export declare const embeddingTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
  name: "embeddings";
  schema: undefined;
  columns: {
    id: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "id";
        tableName: "embeddings";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    memoryId: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "memory_id";
        tableName: "embeddings";
        dataType: "string";
        columnType: "PgUUID";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    createdAt: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "created_at";
        tableName: "embeddings";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    dim384: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "dim_384";
        tableName: "embeddings";
        dataType: "array";
        columnType: "PgVector";
        data: number[];
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {
        dimensions: any;
      }
    >;
    dim512: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "dim_512";
        tableName: "embeddings";
        dataType: "array";
        columnType: "PgVector";
        data: number[];
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {
        dimensions: any;
      }
    >;
    dim768: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "dim_768";
        tableName: "embeddings";
        dataType: "array";
        columnType: "PgVector";
        data: number[];
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {
        dimensions: any;
      }
    >;
    dim1024: import("drizzle-orm/pg-core").PgColumn<
```