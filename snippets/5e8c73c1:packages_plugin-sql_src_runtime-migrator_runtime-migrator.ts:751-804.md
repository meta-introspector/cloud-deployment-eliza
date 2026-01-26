# 5e8c73c1:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:751-804

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:751-804
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    await this.db.execute(sql`DELETE FROM migrations._journal WHERE plugin_name = ${pluginName}`);
    await this.db.execute(sql`DELETE FROM migrations._snapshots WHERE plugin_name = ${pluginName}`);

    logger.warn({ src: 'plugin:sql', pluginName }, 'Reset complete');
  }

  /**
   * Check if a migration would cause data loss without executing it
   * @param pluginName - Plugin identifier
   * @param schema - Drizzle schema to check
   * @returns Data loss analysis or null if no changes
   */
  async checkMigration(pluginName: string, schema: any): Promise<DataLossCheck | null> {
    try {
      logger.info({ src: 'plugin:sql', pluginName }, 'Checking migration');

      // Generate current snapshot from schema
      const currentSnapshot = await generateSnapshot(schema);

      // Load previous snapshot
      const previousSnapshot = await this.snapshotStorage.getLatestSnapshot(pluginName);

      // Check if there are changes
      if (!hasChanges(previousSnapshot, currentSnapshot)) {
        logger.info({ src: 'plugin:sql', pluginName }, 'No changes detected');
        return null;
      }

      // Calculate diff
      const diff = await calculateDiff(previousSnapshot, currentSnapshot);

      // Check for data loss
      const dataLossCheck = checkForDataLoss(diff);

      if (dataLossCheck.hasDataLoss) {
        logger.warn({ src: 'plugin:sql', pluginName }, 'Migration would cause data loss');
      } else {
        logger.info({ src: 'plugin:sql', pluginName }, 'Migration is safe (no data loss)');
      }

      return dataLossCheck;
    } catch (error) {
      logger.error(
        {
          src: 'plugin:sql',
          pluginName,
          error: error instanceof Error ? error.message : String(error),
        },
        'Failed to check migration'
      );
      throw error;
    }
  }
}
```