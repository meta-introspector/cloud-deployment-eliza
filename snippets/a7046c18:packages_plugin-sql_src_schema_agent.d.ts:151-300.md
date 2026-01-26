# a7046c18:packages_plugin-sql_src_schema_agent.d.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/agent.d.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    system: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "system";
        tableName: "agents";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
      },
      {},
      {}
    >;
    bio: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "bio";
        tableName: "agents";
        dataType: "json";
        columnType: "PgJsonb";
        data: string | string[];
        driverParam: unknown;
        notNull: false;
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
        $type: string | string[];
      }
    >;
    messageExamples: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "message_examples";
        tableName: "agents";
        dataType: "json";
        columnType: "PgJsonb";
        data: MessageExample[][];
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
        $type: MessageExample[][];
      }
    >;
    postExamples: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "post_examples";
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
    topics: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "topics";
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
    adjectives: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "adjectives";
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
    knowledge: import("drizzle-orm/pg-core").PgColumn<
      {
        name: "knowledge";
        tableName: "agents";
        dataType: "json";
        columnType: "PgJsonb";
        data: (
          | string
```