# a7046c18:packages_plugin-sql_src_runtime-migrator_schema-transformer.ts:151-197

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/schema-transformer.ts:151-197
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

/**
 * Check if a value is a PgTable
 */
function isPgTable(value: any): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  // Check for table-like properties
  // This is a heuristic since we can't use instanceof across module boundaries
  try {
    const config = getTableConfig(value);
    return config && typeof config.name === "string";
  } catch {
    return false;
  }
}

/**
 * Check if a schema is already properly namespaced
 */
function isAlreadyNamespaced(schema: any, expectedSchemaName: string): boolean {
  for (const value of Object.values(schema)) {
    if (isPgTable(value)) {
      try {
        const config = getTableConfig(value as any);
        if (config.schema === expectedSchemaName) {
          return true;
        }
      } catch {
        // Not a table, continue
      }
    }
  }
  return false;
}

/**
 * Create a namespaced schema helper for plugins
 * This is what plugins should ideally use to define their tables
 */
export function createPluginSchema(pluginName: string) {
  const schemaName = deriveSchemaName(pluginName);
  return pgSchema(schemaName);
}
```