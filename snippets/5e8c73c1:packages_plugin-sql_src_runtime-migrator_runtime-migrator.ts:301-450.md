# 5e8c73c1:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  /**
   * Run migrations for a plugin/schema
   * @param pluginName - Plugin identifier
   * @param schema - Drizzle schema object
   * @param options - Migration options (verbose, force, dryRun, allowDataLoss)
   * @throws Error if destructive migrations blocked or migration fails
   */
  async migrate(
    pluginName: string,
    schema: any,
    options: RuntimeMigrationOptions = {}
  ): Promise<void> {
    const lockId = this.getAdvisoryLockId(pluginName);

    // Validate lockId is within PostgreSQL bigint range
    if (!this.validateBigInt(lockId)) {
      throw new Error(`Invalid advisory lock ID generated for plugin ${pluginName}`);
    }

    let lockAcquired = false;

    try {
      logger.info({ src: 'plugin:sql', pluginName }, 'Starting migration for plugin');

      // Ensure migration tables exist
      await this.initialize();

      // Only use advisory locks for real PostgreSQL databases
      // Skip for PGLite or development databases
      const postgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
      const isRealPostgres = this.isRealPostgresDatabase(postgresUrl);

      if (isRealPostgres) {
        try {
          logger.debug({ src: 'plugin:sql', pluginName }, 'Using PostgreSQL advisory locks');

          // Convert bigint to string for SQL query
          // The sql tagged template will properly parameterize this value
          const lockIdStr = lockId.toString();

          const lockResult = await this.db.execute(
            sql`SELECT pg_try_advisory_lock(CAST(${lockIdStr} AS bigint)) as acquired`
          );

          interface LockResultRow {
            acquired: boolean;
          }
          lockAcquired = getRow<LockResultRow>(lockResult)?.acquired === true;

          if (!lockAcquired) {
            logger.info(
              { src: 'plugin:sql', pluginName },
              'Migration already in progress, waiting for lock'
            );

            // Wait for the lock (blocking call)
            await this.db.execute(sql`SELECT pg_advisory_lock(CAST(${lockIdStr} AS bigint))`);
            lockAcquired = true;

            logger.info({ src: 'plugin:sql', pluginName }, 'Lock acquired');
          } else {
            logger.debug(
              { src: 'plugin:sql', pluginName, lockId: lockIdStr },
              'Advisory lock acquired'
            );
          }
        } catch (lockError) {
          // If advisory locks fail, log but continue
          // This might happen if the PostgreSQL version doesn't support advisory locks
          logger.warn(
            {
              src: 'plugin:sql',
              pluginName,
              error: lockError instanceof Error ? lockError.message : String(lockError),
            },
            'Failed to acquire advisory lock, continuing without lock'
          );
          lockAcquired = false;
        }
      } else {
        // For PGLite or other development databases, skip advisory locks
        logger.debug(
          { src: 'plugin:sql' },
          'Development database detected, skipping advisory locks'
        );
      }

      // Install required extensions (same as old migrator)
      await this.extensionManager.installRequiredExtensions([
        'vector',
        'fuzzystrmatch',
        'pgcrypto',
      ]);

      // Generate current snapshot from schema
      const currentSnapshot = await generateSnapshot(schema);

      // Ensure all schemas referenced in the snapshot exist
      await this.ensureSchemasExist(currentSnapshot);

      // Validate schema usage and warn about potential issues
      this.validateSchemaUsage(pluginName, currentSnapshot);

      const currentHash = hashSnapshot(currentSnapshot);

      // Check if we've already run this exact migration
      // This check happens AFTER acquiring the lock to handle concurrent scenarios
      // This is critical: if we had to wait for the lock (lockAcquired was initially false),
      // another process may have completed the migration while we were waiting
      // We MUST check regardless of whether lastMigration existed before
      const lastMigration = await this.migrationTracker.getLastMigration(pluginName);
      if (lastMigration && lastMigration.hash === currentHash) {
        logger.info(
          { src: 'plugin:sql', pluginName, hash: currentHash },
          'No changes detected, skipping migration'
        );
        return;
      }

      // Load previous snapshot
      let previousSnapshot = await this.snapshotStorage.getLatestSnapshot(pluginName);

      // If no snapshot exists but tables exist in database, introspect them
      if (!previousSnapshot && Object.keys(currentSnapshot.tables).length > 0) {
        const hasExistingTables = await this.introspector.hasExistingTables(pluginName);

        if (hasExistingTables) {
          logger.info(
            { src: 'plugin:sql', pluginName },
            'No snapshot found but tables exist in database, introspecting'
          );

          // Determine the schema name for introspection
          const schemaName = this.getExpectedSchemaName(pluginName);

          // Introspect the current database state
          const introspectedSnapshot = await this.introspector.introspectSchema(schemaName);

          // IMPORTANT: Filter the introspected snapshot to only include tables that are
          // defined in the current schema. This prevents tables from other plugins
          // (e.g., gamification tables in 'public' schema) from being marked as "orphans"
          // and scheduled for deletion.
          const expectedTableNames = new Set<string>();
          for (const tableKey of Object.keys(currentSnapshot.tables)) {
            const tableData = currentSnapshot.tables[tableKey] as any;
            const tableName = tableData.name || tableKey.split('.').pop();
            expectedTableNames.add(tableName);
          }

          // Filter introspected tables to only those in the current schema
```