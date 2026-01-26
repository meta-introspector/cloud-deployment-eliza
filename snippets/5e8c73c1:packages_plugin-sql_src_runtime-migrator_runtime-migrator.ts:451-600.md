# 5e8c73c1:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          const filteredTables: any = {};
          for (const tableKey of Object.keys(introspectedSnapshot.tables)) {
            const tableData = introspectedSnapshot.tables[tableKey] as any;
            const tableName = tableData.name || tableKey.split('.').pop();
            if (expectedTableNames.has(tableName)) {
              filteredTables[tableKey] = tableData;
            } else {
              logger.debug(
                { src: 'plugin:sql', pluginName, tableName },
                'Ignoring table from introspection (not in current schema)'
              );
            }
          }

          // Use filtered snapshot
          const filteredSnapshot = {
            ...introspectedSnapshot,
            tables: filteredTables,
          };

          // Only use the introspected snapshot if it has tables
          if (Object.keys(filteredSnapshot.tables).length > 0) {
            // Save this as the initial snapshot (idx: 0)
            await this.snapshotStorage.saveSnapshot(pluginName, 0, filteredSnapshot);

            // Update journal to record this initial state
            await this.journalStorage.updateJournal(
              pluginName,
              0,
              `introspected_${Date.now()}`,
              true
            );

            // Record this as a migration
            const filteredHash = hashSnapshot(filteredSnapshot);
            await this.migrationTracker.recordMigration(pluginName, filteredHash, Date.now());

            logger.info(
              { src: 'plugin:sql', pluginName },
              'Created initial snapshot from existing database'
            );

            // Set this as the previous snapshot for comparison
            previousSnapshot = filteredSnapshot;
          }
        }
      }

      // Check if there are actual changes
      if (!hasChanges(previousSnapshot, currentSnapshot)) {
        logger.info({ src: 'plugin:sql', pluginName }, 'No schema changes');

        // For empty schemas, we still want to record the migration
        // to ensure idempotency and consistency
        if (!previousSnapshot && Object.keys(currentSnapshot.tables).length === 0) {
          logger.info({ src: 'plugin:sql', pluginName }, 'Recording empty schema');
          await this.migrationTracker.recordMigration(pluginName, currentHash, Date.now());
          const idx = await this.journalStorage.getNextIdx(pluginName);
          const tag = this.generateMigrationTag(idx, pluginName);
          await this.journalStorage.updateJournal(pluginName, idx, tag, true);
          await this.snapshotStorage.saveSnapshot(pluginName, idx, currentSnapshot);
        }

        return;
      }

      // Calculate diff
      const diff = await calculateDiff(previousSnapshot, currentSnapshot);

      // Check if diff has changes
      if (!hasDiffChanges(diff)) {
        logger.info({ src: 'plugin:sql', pluginName }, 'No actionable changes');
        return;
      }

      // Check for potential data loss
      const dataLossCheck = checkForDataLoss(diff);

      if (dataLossCheck.hasDataLoss) {
        const isProduction = process.env.NODE_ENV === 'production';

        // Determine if destructive migrations are allowed
        // Priority: explicit options > environment variable
        const allowDestructive =
          options.force ||
          options.allowDataLoss ||
          process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS === 'true';

        if (!allowDestructive) {
          // Block the migration and provide clear instructions
          logger.error(
            {
              src: 'plugin:sql',
              pluginName,
              environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
              warnings: dataLossCheck.warnings,
            },
            'Destructive migration blocked - set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true or use force option'
          );

          const errorMessage = isProduction
            ? `Destructive migration blocked in production for ${pluginName}. Set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true or use drizzle-kit.`
            : `Destructive migration blocked for ${pluginName}. Set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true to proceed.`;

          throw new Error(errorMessage);
        }

        // Log that we're proceeding with destructive operations
        if (dataLossCheck.requiresConfirmation) {
          logger.warn(
            { src: 'plugin:sql', pluginName, warnings: dataLossCheck.warnings },
            'Proceeding with destructive migration'
          );
        }
      }

      // Generate SQL statements
      const sqlStatements = await generateMigrationSQL(previousSnapshot, currentSnapshot, diff);

      if (sqlStatements.length === 0) {
        logger.info({ src: 'plugin:sql', pluginName }, 'No SQL statements to execute');
        return;
      }

      // Log what we're about to do
      logger.info(
        { src: 'plugin:sql', pluginName, statementCount: sqlStatements.length },
        'Executing SQL statements'
      );
      if (options.verbose) {
        sqlStatements.forEach((stmt, i) => {
          logger.debug(
            { src: 'plugin:sql', statementIndex: i + 1, statement: stmt },
            'SQL statement'
          );
        });
      }

      // Dry run mode - just log what would happen
      if (options.dryRun) {
        logger.info(
          { src: 'plugin:sql', pluginName, statements: sqlStatements },
          'DRY RUN mode - not executing statements'
        );
        return;
      }

      // Execute migration in transaction
      await this.executeMigration(pluginName, currentSnapshot, currentHash, sqlStatements);

```