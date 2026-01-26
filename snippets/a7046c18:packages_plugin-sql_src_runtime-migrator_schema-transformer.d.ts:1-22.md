# a7046c18:packages_plugin-sql_src_runtime-migrator_schema-transformer.d.ts:1-22

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/schema-transformer.d.ts:1-22
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Transform a plugin's schema to use the appropriate namespace
 *
 * @elizaos/plugin-sql uses 'public' schema (no transformation)
 * Other plugins get their tables wrapped in a namespaced schema
 */
export declare function transformPluginSchema(
  pluginName: string,
  schema: any,
): any;
/**
 * Derive a valid PostgreSQL schema name from a plugin name
 */
export declare function deriveSchemaName(pluginName: string): string;
/**
 * Create a namespaced schema helper for plugins
 * This is what plugins should ideally use to define their tables
 */
export declare function createPluginSchema(
  pluginName: string,
): import("drizzle-orm/pg-core").PgSchema<string>;
//# sourceMappingURL=schema-transformer.d.ts.map
```