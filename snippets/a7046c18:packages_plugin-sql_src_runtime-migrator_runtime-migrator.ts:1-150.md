# a7046c18:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { createHash } from "node:crypto";
import { logger } from "@elizaos/core";
import { sql } from "drizzle-orm";
import { getRow } from "../types";
import { DatabaseIntrospector } from "./drizzle-adapters/database-introspector";
import {
  calculateDiff,
  hasDiffChanges,
} from "./drizzle-adapters/diff-calculator";
import {
  generateSnapshot,
  hasChanges,
  hashSnapshot,
} from "./drizzle-adapters/snapshot-generator";
import {
  checkForDataLoss,
  type DataLossCheck,
  generateMigrationSQL,
} from "./drizzle-adapters/sql-generator";
import { ExtensionManager } from "./extension-manager";
import { deriveSchemaName } from "./schema-transformer";
import { JournalStorage } from "./storage/journal-storage";
import { MigrationTracker } from "./storage/migration-tracker";
import { SnapshotStorage } from "./storage/snapshot-storage";
import type {
  DrizzleDB,
  RuntimeMigrationOptions,
  SchemaSnapshot,
} from "./types";

export class RuntimeMigrator {
  private migrationTracker: MigrationTracker;
  private journalStorage: JournalStorage;
  private snapshotStorage: SnapshotStorage;
  private extensionManager: ExtensionManager;
  private introspector: DatabaseIntrospector;

  constructor(private db: DrizzleDB) {
    this.migrationTracker = new MigrationTracker(db);
    this.journalStorage = new JournalStorage(db);
    this.snapshotStorage = new SnapshotStorage(db);
    this.extensionManager = new ExtensionManager(db);
    this.introspector = new DatabaseIntrospector(db);
  }

  /**
   * Get expected schema name for a plugin
   * @elizaos/plugin-sql uses 'public' schema (core application)
   * All other plugins should use namespaced schemas
   */
  private getExpectedSchemaName(pluginName: string): string {
    // Core plugin uses public schema
    if (pluginName === "@elizaos/plugin-sql") {
      return "public";
    }

    // Use the schema transformer's logic for consistency
    return deriveSchemaName(pluginName);
  }

  /**
   * Ensure all schemas used in the snapshot exist
   */
  private async ensureSchemasExist(snapshot: SchemaSnapshot): Promise<void> {
    const schemasToCreate = new Set<string>();

    // Collect all schemas from tables
    for (const table of Object.values(snapshot.tables)) {
      const tableData = table as any; // Tables in snapshot have schema property
      const schema = tableData.schema || "public";
      if (schema !== "public") {
        schemasToCreate.add(schema);
      }
    }

    // Also add schemas from the snapshot's schemas object
    for (const schema of Object.keys(snapshot.schemas || {})) {
      if (schema !== "public") {
        schemasToCreate.add(schema);
      }
    }

    // Create all non-public schemas
    for (const schemaName of schemasToCreate) {
      logger.debug({ src: "plugin:sql", schemaName }, "Ensuring schema exists");
      await this.db.execute(
        sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`),
      );
    }
  }

  /**
   * Validate schema usage and provide warnings
   */
  private validateSchemaUsage(
    pluginName: string,
    snapshot: SchemaSnapshot,
  ): void {
    const expectedSchema = this.getExpectedSchemaName(pluginName);
    const isCorePLugin = pluginName === "@elizaos/plugin-sql";

    for (const table of Object.values(snapshot.tables)) {
      const tableData = table as any; // Tables in snapshot have schema and name properties
      const actualSchema = tableData.schema || "public";

      // Warn if non-core plugin is using public schema
      if (!isCorePLugin && actualSchema === "public") {
        logger.warn(
          {
            src: "plugin:sql",
            pluginName,
            tableName: tableData.name,
            expectedSchema,
          },
          "Plugin table is using public schema - consider using pgSchema for better isolation",
        );
      }

      // Warn if core plugin is not using public schema
      if (isCorePLugin && actualSchema !== "public") {
        logger.warn(
          {
            src: "plugin:sql",
            pluginName: "@elizaos/plugin-sql",
            tableName: tableData.name,
            actualSchema,
          },
          "Core plugin table should use public schema",
        );
      }
    }
  }

  /**
   * Generate a stable advisory lock ID from plugin name
   * PostgreSQL advisory locks use bigint, so we need to hash the plugin name
   * and convert to a stable bigint value
   */
  private getAdvisoryLockId(pluginName: string): bigint {
    // Create a hash of the plugin name
    const hash = createHash("sha256").update(pluginName).digest();

    // Take first 8 bytes for a 64-bit integer
    const buffer = hash.slice(0, 8);

    // Convert to bigint
    let lockId = BigInt(`0x${buffer.toString("hex")}`);

    // Ensure the value fits in PostgreSQL's positive bigint range
    // Use a mask to keep only 63 bits (ensures positive in signed 64-bit)
```