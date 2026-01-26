# a7046c18:packages_plugin-sql_src_schema_relationship.d.ts:151-194

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/relationship.d.ts:151-194
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      },
      {},
      {
        size: undefined;
        baseBuilder: import("drizzle-orm/pg-core").PgColumnBuilder<
          {
            name: "tags";
            dataType: "string";
            columnType: "PgText";
            data: string;
            enumValues: [string, ...string[]];
            driverParam: string;
          },
          {},
          {},
          import("drizzle-orm").ColumnBuilderExtraConfig
        >;
      }
    >;
    metadata: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "metadata";
        tableName: "relationships";
        dataType: "json";
        columnType: "PgJsonb";
        data: unknown;
        driverParam: unknown;
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
  };
  dialect: "pg";
}>;
//# sourceMappingURL=relationship.d.ts.map
```