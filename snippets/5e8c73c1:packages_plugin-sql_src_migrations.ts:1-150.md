# 5e8c73c1:packages_plugin-sql_src_migrations.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/migrations.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { logger, type IDatabaseAdapter } from '@elizaos/core';
import { sql } from 'drizzle-orm';
import { getDb } from './types';

/**
 * TEMPORARY MIGRATION: pre-1.6.5 → 1.6.5+ schema migration
 *
 * This migration runs automatically on startup and is idempotent.
 * It handles the migration from Owner RLS to Server RLS + Entity RLS, including:
 * - Disabling old RLS policies temporarily
 * - Renaming server_id → message_server_id in channels, worlds, rooms
 * - Converting TEXT → UUID where needed
 * - Dropping old server_id columns for RLS
 * - Cleaning up indexes
 *
 * @param adapter - Database adapter
 */
export async function migrateToEntityRLS(adapter: IDatabaseAdapter): Promise<void> {
  const db = getDb(adapter);

  // Detect database type - skip PostgreSQL-specific migrations for SQLite
  try {
    await db.execute(sql`SELECT 1 FROM pg_tables LIMIT 1`);
  } catch {
    // Not PostgreSQL (likely SQLite)
    logger.debug('[Migration] ⊘ Not PostgreSQL, skipping PostgreSQL-specific migrations');
    return;
  }

  // Check if schema migration has already been completed
  // We use the presence of snake_case columns as a marker
  let schemaAlreadyMigrated = false;
  try {
    const migrationCheck = await db.execute(sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'rooms'
        AND column_name = 'agent_id'
    `);

    if (migrationCheck.rows && migrationCheck.rows.length > 0) {
      // Migration already completed - rooms.agent_id exists (snake_case)
      schemaAlreadyMigrated = true;
      logger.debug('[Migration] ⊘ Schema already migrated (snake_case columns exist)');
    }
  } catch {
    // Table might not exist yet, continue with migration
    logger.debug('[Migration] → rooms table not found, will be created by RuntimeMigrator');
    return; // Let RuntimeMigrator create fresh tables
  }

  // If schema is already migrated, check if we need to clean up RLS
  // Only disable RLS if ENABLE_DATA_ISOLATION is NOT true (user disabled isolation)
  // If ENABLE_DATA_ISOLATION=true, keep RLS as-is - migration-service.ts will ensure proper config
  if (schemaAlreadyMigrated) {
    const dataIsolationEnabled = process.env.ENABLE_DATA_ISOLATION === 'true';

    if (dataIsolationEnabled) {
      // RLS should stay enabled - no need to disable/re-enable cycle
      // Note: migration-service.ts will ensure RLS is properly configured after this
      // via applyRLSToNewTables() and applyEntityRLSToAllTables() which are idempotent
      logger.debug('[Migration] ⊘ Schema already migrated, RLS enabled - nothing to do');
      return;
    }

    // User disabled data isolation - clean up RLS if it was previously enabled
    logger.debug('[Migration] → Schema migrated but RLS disabled, cleaning up...');

    try {
      const tablesWithRls = await db.execute(sql`
        SELECT c.relname as tablename
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
          AND c.relrowsecurity = true
        ORDER BY c.relname
      `);

      if (tablesWithRls.rows && tablesWithRls.rows.length > 0) {
        for (const row of tablesWithRls.rows) {
          const tableName = row.tablename as string;
          try {
            await db.execute(sql.raw(`ALTER TABLE "${tableName}" DISABLE ROW LEVEL SECURITY`));
          } catch {
            // Ignore errors
          }
        }
        logger.debug(`[Migration] ✓ RLS cleanup completed (${tablesWithRls.rows.length} tables)`);
      } else {
        logger.debug('[Migration] ⊘ No tables with RLS to clean up');
      }
    } catch {
      logger.debug('[Migration] ⊘ Could not perform RLS cleanup');
    }

    return;
  }

  logger.info('[Migration] Starting pre-1.6.5 → 1.6.5+ schema migration...');

  try {
    // Clear RuntimeMigrator snapshot cache to force fresh introspection
    // This ensures the snapshot matches the current database state after our migrations
    logger.debug('[Migration] → Clearing RuntimeMigrator snapshot cache...');
    try {
      await db.execute(
        sql`DELETE FROM migrations._snapshots WHERE plugin_name = '@elizaos/plugin-sql'`
      );
      logger.debug('[Migration] ✓ Snapshot cache cleared');
    } catch (error) {
      // If migrations schema doesn't exist yet, that's fine - no cache to clear
      logger.debug('[Migration] ⊘ No snapshot cache to clear (migrations schema not yet created)');
    }

    // Disable RLS only on tables that have it enabled
    // RLS will be re-implemented properly later
    logger.debug('[Migration] → Checking for Row Level Security to disable...');
    try {
      const tablesWithRls = await db.execute(sql`
        SELECT c.relname as tablename
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
          AND c.relkind = 'r'
          AND c.relrowsecurity = true
        ORDER BY c.relname
      `);

      if (tablesWithRls.rows && tablesWithRls.rows.length > 0) {
        for (const row of tablesWithRls.rows) {
          const tableName = row.tablename as string;
          try {
            await db.execute(sql.raw(`ALTER TABLE "${tableName}" DISABLE ROW LEVEL SECURITY`));
            logger.debug(`[Migration] ✓ Disabled RLS on ${tableName}`);
          } catch (error) {
            logger.debug(`[Migration] ⊘ Could not disable RLS on ${tableName}`);
          }
        }
      } else {
        logger.debug('[Migration] ⊘ No tables with RLS enabled');
      }
    } catch (error) {
      logger.debug('[Migration] ⊘ Could not check RLS (may not have permissions)');
    }

    // Special handling for tables where serverId/server_id needs to become message_server_id
    // v1.6.4 had: rooms.serverId (TEXT camelCase), worlds.serverId (TEXT camelCase), channels.server_id (UUID)
    // Current: message_server_id (UUID) in all tables
    //
```