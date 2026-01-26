# a7046c18:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      "fly.io",
    ];
    if (cloudPatterns.some((p) => url.includes(p))) return true;

    // IP:port patterns (IPv4 and IPv6)
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/.test(url)) return true;
    if (/\[[0-9a-f:]+\](:\d{1,5})?/i.test(connectionUrl)) return true;

    // host:port/database format (Docker Compose, etc.)
    if (/^[a-z0-9_.-]+:\d{1,5}\/[a-z0-9_-]+/i.test(connectionUrl)) return true;

    logger.debug(
      { src: "plugin:sql", urlPreview: url.substring(0, 50) },
      "Connection string did not match any PostgreSQL patterns",
    );
    return false;
  }

  /**
   * Initialize migration system - create necessary tables
   * @throws Error if table creation fails
   */
  async initialize(): Promise<void> {
    logger.info({ src: "plugin:sql" }, "Initializing migration system");
    await this.migrationTracker.ensureTables();
    logger.info({ src: "plugin:sql" }, "Migration system initialized");
  }

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
    options: RuntimeMigrationOptions = {},
  ): Promise<void> {
    const lockId = this.getAdvisoryLockId(pluginName);

    // Validate lockId is within PostgreSQL bigint range
    if (!this.validateBigInt(lockId)) {
      throw new Error(
        `Invalid advisory lock ID generated for plugin ${pluginName}`,
      );
    }

    let lockAcquired = false;

    try {
      logger.info(
        { src: "plugin:sql", pluginName },
        "Starting migration for plugin",
      );

      // Ensure migration tables exist
      await this.initialize();

      // Only use advisory locks for real PostgreSQL databases
      // Skip for PGLite or development databases
      const postgresUrl =
        process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
      const isRealPostgres = this.isRealPostgresDatabase(postgresUrl);

      if (isRealPostgres) {
        try {
          logger.debug(
            { src: "plugin:sql", pluginName },
            "Using PostgreSQL advisory locks",
          );

          // Convert bigint to string for SQL query
          // The sql tagged template will properly parameterize this value
          const lockIdStr = lockId.toString();

          const lockResult = await this.db.execute(
            sql`SELECT pg_try_advisory_lock(CAST(${lockIdStr} AS bigint)) as acquired`,
          );

          interface LockResultRow {
            acquired: boolean;
          }
          lockAcquired = getRow<LockResultRow>(lockResult)?.acquired === true;

          if (!lockAcquired) {
            logger.info(
              { src: "plugin:sql", pluginName },
              "Migration already in progress, waiting for lock",
            );

            // Wait for the lock (blocking call)
            await this.db.execute(
              sql`SELECT pg_advisory_lock(CAST(${lockIdStr} AS bigint))`,
            );
            lockAcquired = true;

            logger.info({ src: "plugin:sql", pluginName }, "Lock acquired");
          } else {
            logger.debug(
              { src: "plugin:sql", pluginName, lockId: lockIdStr },
              "Advisory lock acquired",
            );
          }
        } catch (lockError) {
          // If advisory locks fail, log but continue
          // This might happen if the PostgreSQL version doesn't support advisory locks
          logger.warn(
            {
              src: "plugin:sql",
              pluginName,
              error:
                lockError instanceof Error
                  ? lockError.message
                  : String(lockError),
            },
            "Failed to acquire advisory lock, continuing without lock",
          );
          lockAcquired = false;
        }
      } else {
        // For PGLite or other development databases, skip advisory locks
        logger.debug(
          { src: "plugin:sql" },
          "Development database detected, skipping advisory locks",
        );
      }

      // Install required extensions
      // pgcrypto is only needed for real PostgreSQL (PGLite uses native gen_random_uuid)
      const extensions = isRealPostgres
        ? ["vector", "fuzzystrmatch", "pgcrypto"]
        : ["vector", "fuzzystrmatch"];
      await this.extensionManager.installRequiredExtensions(extensions);

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
```