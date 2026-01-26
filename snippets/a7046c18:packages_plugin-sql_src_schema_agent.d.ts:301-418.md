# a7046c18:packages_plugin-sql_src_schema_agent.d.ts:301-418

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/agent.d.ts:301-418
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          | {
              path: string;
              shared?: boolean;
            }
        )[];
        driverParam: unknown;
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
      {
        $type: (
          | string
          | {
              path: string;
              shared?: boolean;
            }
        )[];
      }
    >;
    plugins: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "plugins";
        tableName: "agents";
        dataType: "json";
        columnType: "PgJsonb";
        data: string[];
        driverParam: unknown;
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
      {
        $type: string[];
      }
    >;
    settings: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "settings";
        tableName: "agents";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
          [key: string]: unknown;
          secrets?: {
            [key: string]: string | boolean | number;
          };
        };
        driverParam: unknown;
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
      {
        $type: {
          [key: string]: unknown;
          secrets?: {
            [key: string]: string | boolean | number;
          };
        };
      }
    >;
    style: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "style";
        tableName: "agents";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
          all?: string[];
          chat?: string[];
          post?: string[];
        };
        driverParam: unknown;
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
      {
        $type: {
          all?: string[];
          chat?: string[];
          post?: string[];
        };
      }
    >;
  };
  dialect: "pg";
}>;
//# sourceMappingURL=agent.d.ts.map
```