# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_database-introspector.d.ts:1-63

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/database-introspector.d.ts:1-63
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { DrizzleDB, SchemaSnapshot } from "../types";
/**
 * Introspect the current database state and generate a snapshot
 * This is used when no previous snapshot exists for a plugin
 * to capture the existing database state before migrations
 */
export declare class DatabaseIntrospector {
  private db;
  constructor(db: DrizzleDB);
  /**
   * Introspect all tables in the database and generate a snapshot
   * @param schemaName - Schema to introspect (default: 'public')
   * @returns Schema snapshot of current database state
   */
  introspectSchema(schemaName?: string): Promise<SchemaSnapshot>;
  /**
   * Get all tables in a schema
   */
  private getTables;
  /**
   * Get columns for a table
   */
  private getColumns;
  /**
   * Get indexes for a table
   */
  private getIndexes;
  /**
   * Get foreign keys for a table
   */
  private getForeignKeys;
  /**
   * Get primary keys for a table
   */
  private getPrimaryKeys;
  /**
   * Get unique constraints for a table
   */
  private getUniqueConstraints;
  /**
   * Get check constraints for a table
   */
  private getCheckConstraints;
  /**
   * Get enums in a schema
   */
  private getEnums;
  /**
   * Parse default value for a column
   */
  private parseDefault;
  /**
   * Check if tables exist for a plugin by checking if any tables exist in its schema
   * @param pluginName - Name of the plugin
   * @returns True if tables exist, false otherwise
   */
  hasExistingTables(pluginName: string): Promise<boolean>;
  /**
   * Derive schema name from plugin name
   */
  private deriveSchemaName;
}
//# sourceMappingURL=database-introspector.d.ts.map
```