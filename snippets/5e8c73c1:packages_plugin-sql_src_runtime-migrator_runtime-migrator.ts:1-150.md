# 5e8c73c1:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { sql } from 'drizzle-orm';
import { logger } from '@elizaos/core';
import type { DrizzleDB, RuntimeMigrationOptions, SchemaSnapshot } from './types';
import { getRow } from '../types';
import { MigrationTracker } from './storage/migration-tracker';
import { JournalStorage } from './storage/journal-storage';
import { SnapshotStorage } from './storage/snapshot-storage';
import { ExtensionManager } from './extension-manager';
import { generateSnapshot, hashSnapshot, hasChanges } from './drizzle-adapters/snapshot-generator';
import { calculateDiff, hasDiffChanges } from './drizzle-adapters/diff-calculator';
import {
  generateMigrationSQL,
  checkForDataLoss,
  type DataLossCheck,
} from './drizzle-adapters/sql-generator';
import { deriveSchemaName } from './schema-transformer';
import { DatabaseIntrospector } from './drizzle-adapters/database-introspector';
import { createHash } from 'crypto';

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
    if (pluginName === '@elizaos/plugin-sql') {
      return 'public';
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
      const schema = tableData.schema || 'public';
      if (schema !== 'public') {
        schemasToCreate.add(schema);
      }
    }

    // Also add schemas from the snapshot's schemas object
    for (const schema of Object.keys(snapshot.schemas || {})) {
      if (schema !== 'public') {
        schemasToCreate.add(schema);
      }
    }

    // Create all non-public schemas
    for (const schemaName of schemasToCreate) {
      logger.debug({ src: 'plugin:sql', schemaName }, 'Ensuring schema exists');
      await this.db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`));
    }
  }

  /**
   * Validate schema usage and provide warnings
   */
  private validateSchemaUsage(pluginName: string, snapshot: SchemaSnapshot): void {
    const expectedSchema = this.getExpectedSchemaName(pluginName);
    const isCorePLugin = pluginName === '@elizaos/plugin-sql';

    for (const table of Object.values(snapshot.tables)) {
      const tableData = table as any; // Tables in snapshot have schema and name properties
      const actualSchema = tableData.schema || 'public';

      // Warn if non-core plugin is using public schema
      if (!isCorePLugin && actualSchema === 'public') {
        logger.warn(
          { src: 'plugin:sql', pluginName, tableName: tableData.name, expectedSchema },
          'Plugin table is using public schema - consider using pgSchema for better isolation'
        );
      }

      // Warn if core plugin is not using public schema
      if (isCorePLugin && actualSchema !== 'public') {
        logger.warn(
          {
            src: 'plugin:sql',
            pluginName: '@elizaos/plugin-sql',
            tableName: tableData.name,
            actualSchema,
          },
          'Core plugin table should use public schema'
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
    const hash = createHash('sha256').update(pluginName).digest();

    // Take first 8 bytes for a 64-bit integer
    const buffer = hash.slice(0, 8);

    // Convert to bigint
    let lockId = BigInt('0x' + buffer.toString('hex'));

    // Ensure the value fits in PostgreSQL's positive bigint range
    // Use a mask to keep only 63 bits (ensures positive in signed 64-bit)
    // This preserves uniqueness better than modulo and avoids collisions
    const mask63Bits = 0x7fffffffffffffffn; // 63 bits set to 1
    lockId = lockId & mask63Bits;

    // Ensure non-zero (extremely unlikely but handle it)
    if (lockId === 0n) {
      lockId = 1n;
    }

    return lockId;
  }

  /**
   * Validate that a value is a valid PostgreSQL bigint
   * PostgreSQL bigint range: -9223372036854775808 to 9223372036854775807
   */
  private validateBigInt(value: bigint): boolean {
    const MIN_BIGINT = -9223372036854775808n;
    const MAX_BIGINT = 9223372036854775807n;
    return value >= MIN_BIGINT && value <= MAX_BIGINT;
  }
```