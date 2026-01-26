# 5e8c73c1:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      logger.info({ src: 'plugin:sql', pluginName }, 'Migration completed successfully');

      // Return a success result
      return;
    } catch (error) {
      logger.error(
        {
          src: 'plugin:sql',
          pluginName,
          error: error instanceof Error ? error.message : String(error),
        },
        'Migration failed'
      );
      throw error;
    } finally {
      // Always release the advisory lock if we acquired it (only for real PostgreSQL)
      const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
      const isRealPostgres = this.isRealPostgresDatabase(postgresUrl);

      if (lockAcquired && isRealPostgres) {
        try {
          // Convert bigint to string for SQL query (same as when acquiring)
          const lockIdStr = lockId.toString();
          await this.db.execute(sql`SELECT pg_advisory_unlock(CAST(${lockIdStr} AS bigint))`);
          logger.debug({ src: 'plugin:sql', pluginName }, 'Advisory lock released');
        } catch (unlockError) {
          logger.warn(
            {
              src: 'plugin:sql',
              pluginName,
              error: unlockError instanceof Error ? unlockError.message : String(unlockError),
            },
            'Failed to release advisory lock'
          );
        }
      }
    }
  }

  /**
   * Execute migration in a transaction
   */
  private async executeMigration(
    pluginName: string,
    snapshot: SchemaSnapshot,
    hash: string,
    sqlStatements: string[]
  ): Promise<void> {
    let transactionStarted = false;

    try {
      // Start manual transaction
      await this.db.execute(sql`BEGIN`);
      transactionStarted = true;

      // Execute all SQL statements
      for (const stmt of sqlStatements) {
        logger.debug({ src: 'plugin:sql', statement: stmt }, 'Executing SQL statement');
        await this.db.execute(sql.raw(stmt));
      }

      // Get next index for journal
      const idx = await this.journalStorage.getNextIdx(pluginName);

      // Record migration
      await this.migrationTracker.recordMigration(pluginName, hash, Date.now());

      // Update journal
      const tag = this.generateMigrationTag(idx, pluginName);
      await this.journalStorage.updateJournal(
        pluginName,
        idx,
        tag,
        true // breakpoints
      );

      // Store snapshot
      await this.snapshotStorage.saveSnapshot(pluginName, idx, snapshot);

      // Commit the transaction
      await this.db.execute(sql`COMMIT`);

      logger.info({ src: 'plugin:sql', pluginName, tag }, 'Recorded migration');
    } catch (error) {
      // Rollback on error if transaction was started
      if (transactionStarted) {
        try {
          await this.db.execute(sql`ROLLBACK`);
          logger.error(
            { src: 'plugin:sql', error: error instanceof Error ? error.message : String(error) },
            'Migration failed, rolled back'
          );
        } catch (rollbackError) {
          logger.error(
            {
              src: 'plugin:sql',
              error: rollbackError instanceof Error ? rollbackError.message : String(rollbackError),
            },
            'Failed to rollback transaction'
          );
        }
      }
      throw error;
    }
  }

  /**
   * Generate migration tag (like 0000_jazzy_shard)
   */
  private generateMigrationTag(idx: number, pluginName: string): string {
    // Generate a simple tag - in production, use Drizzle's word generation
    const prefix = idx.toString().padStart(4, '0');
    const timestamp = Date.now().toString(36);
    return `${prefix}_${pluginName}_${timestamp}`;
  }

  /**
   * Get migration status for a plugin
   * @param pluginName - Plugin identifier
   * @returns Migration history and current state
   */
  async getStatus(pluginName: string): Promise<{
    hasRun: boolean;
    lastMigration: any;
    journal: any;
    snapshots: number;
  }> {
    const lastMigration = await this.migrationTracker.getLastMigration(pluginName);
    const journal = await this.journalStorage.loadJournal(pluginName);
    const snapshots = await this.snapshotStorage.getAllSnapshots(pluginName);

    return {
      hasRun: !!lastMigration,
      lastMigration,
      journal,
      snapshots: snapshots.length,
    };
  }

  /**
   * Reset migrations for a plugin (dangerous - for development only)
   * @param pluginName - Plugin identifier
   * @warning Deletes all migration history - use only in development
   */
  async reset(pluginName: string): Promise<void> {
    logger.warn({ src: 'plugin:sql', pluginName }, 'Resetting migrations');

    await this.db.execute(
      sql`DELETE FROM migrations._migrations WHERE plugin_name = ${pluginName}`
    );
```