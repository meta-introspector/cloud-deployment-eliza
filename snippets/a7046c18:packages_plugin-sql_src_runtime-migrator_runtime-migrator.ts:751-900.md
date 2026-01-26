# a7046c18:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          { src: "plugin:sql", statement: stmt },
          "Executing SQL statement",
        );
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
        true, // breakpoints
      );

      // Store snapshot
      await this.snapshotStorage.saveSnapshot(pluginName, idx, snapshot);

      // Commit the transaction
      await this.db.execute(sql`COMMIT`);

      logger.info({ src: "plugin:sql", pluginName, tag }, "Recorded migration");
    } catch (error) {
      // Rollback on error if transaction was started
      if (transactionStarted) {
        try {
          await this.db.execute(sql`ROLLBACK`);
          logger.error(
            {
              src: "plugin:sql",
              error: error instanceof Error ? error.message : String(error),
            },
            "Migration failed, rolled back",
          );
        } catch (rollbackError) {
          logger.error(
            {
              src: "plugin:sql",
              error:
                rollbackError instanceof Error
                  ? rollbackError.message
                  : String(rollbackError),
            },
            "Failed to rollback transaction",
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
    const prefix = idx.toString().padStart(4, "0");
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
    const lastMigration =
      await this.migrationTracker.getLastMigration(pluginName);
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
    logger.warn({ src: "plugin:sql", pluginName }, "Resetting migrations");

    await this.db.execute(
      sql`DELETE FROM migrations._migrations WHERE plugin_name = ${pluginName}`,
    );
    await this.db.execute(
      sql`DELETE FROM migrations._journal WHERE plugin_name = ${pluginName}`,
    );
    await this.db.execute(
      sql`DELETE FROM migrations._snapshots WHERE plugin_name = ${pluginName}`,
    );

    logger.warn({ src: "plugin:sql", pluginName }, "Reset complete");
  }

  /**
   * Check if a migration would cause data loss without executing it
   * @param pluginName - Plugin identifier
   * @param schema - Drizzle schema to check
   * @returns Data loss analysis or null if no changes
   */
  async checkMigration(
    pluginName: string,
    schema: any,
  ): Promise<DataLossCheck | null> {
    try {
      logger.info({ src: "plugin:sql", pluginName }, "Checking migration");

      // Generate current snapshot from schema
      const currentSnapshot = await generateSnapshot(schema);

      // Load previous snapshot
      const previousSnapshot =
        await this.snapshotStorage.getLatestSnapshot(pluginName);

      // Check if there are changes
      if (!hasChanges(previousSnapshot, currentSnapshot)) {
        logger.info({ src: "plugin:sql", pluginName }, "No changes detected");
        return null;
      }

      // Calculate diff
      const diff = await calculateDiff(previousSnapshot, currentSnapshot);

      // Check for data loss
      const dataLossCheck = checkForDataLoss(diff);

      if (dataLossCheck.hasDataLoss) {
        logger.warn(
          { src: "plugin:sql", pluginName },
          "Migration would cause data loss",
        );
      } else {
```