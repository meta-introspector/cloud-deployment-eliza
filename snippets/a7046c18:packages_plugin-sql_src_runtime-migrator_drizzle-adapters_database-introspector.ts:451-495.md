# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_database-introspector.ts:451-495

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/database-introspector.ts:451-495
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    // Handle boolean defaults
    if (dataType === "boolean") {
      if (defaultValue === "true") return "true";
      if (defaultValue === "false") return "false";
    }

    // Return as-is for other cases
    return defaultValue;
  }

  /**
   * Check if tables exist for a plugin by checking if any tables exist in its schema
   * @param pluginName - Name of the plugin
   * @returns True if tables exist, false otherwise
   */
  async hasExistingTables(pluginName: string): Promise<boolean> {
    const schemaName =
      pluginName === "@elizaos/plugin-sql"
        ? "public"
        : this.deriveSchemaName(pluginName);

    const result = await this.db.execute(
      sql`SELECT COUNT(*) AS count
          FROM information_schema.tables
          WHERE table_schema = ${schemaName}
            AND table_type = 'BASE TABLE'`,
    );

    const count = parseInt((result.rows[0]?.count as string) || "0", 10);
    return count > 0;
  }

  /**
   * Derive schema name from plugin name
   */
  private deriveSchemaName(pluginName: string): string {
    // Same logic as in schema-transformer.ts
    return pluginName
      .replace("@", "")
      .replace("/", "_")
      .replace(/-/g, "_")
      .toLowerCase();
  }
}
```