# a7046c18:packages_plugin-sql_src_schema_embedding.d.ts:151-238

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/embedding.d.ts:151-238
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      {
        name: "dim_1024";
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
    dim1536: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "dim_1536";
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
    dim3072: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "dim_3072";
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
  };
  dialect: "pg";
}>;
/**
 * Defines the possible values for the Embedding Dimension Column.
 * It can be "dim384", "dim512", "dim768", "dim1024", "dim1536", or "dim3072".
 */
export type EmbeddingDimensionColumn =
  | "dim384"
  | "dim512"
  | "dim768"
  | "dim1024"
  | "dim1536"
  | "dim3072";
/**
 * Retrieve the type of a specific column in the EmbeddingTable based on the EmbeddingDimensionColumn key.
 */
export type EmbeddingTableColumn =
  (typeof embeddingTable._.columns)[EmbeddingDimensionColumn];
//# sourceMappingURL=embedding.d.ts.map
```