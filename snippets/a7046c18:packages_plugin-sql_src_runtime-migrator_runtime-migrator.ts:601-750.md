# a7046c18:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        // Priority: explicit options > environment variable
        const allowDestructive =
          options.force ||
          options.allowDataLoss ||
          process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS === "true";

        if (!allowDestructive) {
          // Block the migration and provide clear instructions
          logger.error(
            {
              src: "plugin:sql",
              pluginName,
              environment: isProduction ? "PRODUCTION" : "DEVELOPMENT",
              warnings: dataLossCheck.warnings,
            },
            "Destructive migration blocked - set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true or use force option",
          );

          const errorMessage = isProduction
            ? `Destructive migration blocked in production for ${pluginName}. Set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true or use drizzle-kit.`
            : `Destructive migration blocked for ${pluginName}. Set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true to proceed.`;

          throw new Error(errorMessage);
        }

        // Log that we're proceeding with destructive operations
        if (dataLossCheck.requiresConfirmation) {
          logger.warn(
            { src: "plugin:sql", pluginName, warnings: dataLossCheck.warnings },
            "Proceeding with destructive migration",
          );
        }
      }

      // Generate SQL statements
      const sqlStatements = await generateMigrationSQL(
        previousSnapshot,
        currentSnapshot,
        diff,
      );

      if (sqlStatements.length === 0) {
        logger.info(
          { src: "plugin:sql", pluginName },
          "No SQL statements to execute",
        );
        return;
      }

      // Log what we're about to do
      logger.info(
        { src: "plugin:sql", pluginName, statementCount: sqlStatements.length },
        "Executing SQL statements",
      );
      if (options.verbose) {
        sqlStatements.forEach((stmt, i) => {
          logger.debug(
            { src: "plugin:sql", statementIndex: i + 1, statement: stmt },
            "SQL statement",
          );
        });
      }

      // Dry run mode - just log what would happen
      if (options.dryRun) {
        logger.info(
          { src: "plugin:sql", pluginName, statements: sqlStatements },
          "DRY RUN mode - not executing statements",
        );
        return;
      }

      // Execute migration in transaction
      await this.executeMigration(
        pluginName,
        currentSnapshot,
        currentHash,
        sqlStatements,
      );

      logger.info(
        { src: "plugin:sql", pluginName },
        "Migration completed successfully",
      );

      // Return a success result
      return;
    } catch (error) {
      logger.error(
        {
          src: "plugin:sql",
          pluginName,
          error: error instanceof Error ? error.message : String(error),
        },
        "Migration failed",
      );
      throw error;
    } finally {
      // Always release the advisory lock if we acquired it (only for real PostgreSQL)
      const postgresUrl =
        process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
      const isRealPostgres = this.isRealPostgresDatabase(postgresUrl);

      if (lockAcquired && isRealPostgres) {
        try {
          // Convert bigint to string for SQL query (same as when acquiring)
          const lockIdStr = lockId.toString();
          await this.db.execute(
            sql`SELECT pg_advisory_unlock(CAST(${lockIdStr} AS bigint))`,
          );
          logger.debug(
            { src: "plugin:sql", pluginName },
            "Advisory lock released",
          );
        } catch (unlockError) {
          logger.warn(
            {
              src: "plugin:sql",
              pluginName,
              error:
                unlockError instanceof Error
                  ? unlockError.message
                  : String(unlockError),
            },
            "Failed to release advisory lock",
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
    sqlStatements: string[],
  ): Promise<void> {
    let transactionStarted = false;

    try {
      // Start manual transaction
      await this.db.execute(sql`BEGIN`);
      transactionStarted = true;

      // Execute all SQL statements
      for (const stmt of sqlStatements) {
        logger.debug(
```