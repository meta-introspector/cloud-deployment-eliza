# 2d12b6ef:packages_server_src_index.ts:301-450

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/index.ts:301-450
**Novelty Score:** 35.43
**Concepts:** testing

```
  }

  /**
   * Initializes the database and server (internal use only).
   *
   * @param {ServerConfig} [config] - Optional server configuration.
   * @returns {Promise<void>} A promise that resolves when initialization is complete.
   * @private
   */
  private async initialize(config?: ServerConfig): Promise<void> {
    if (this.isInitialized) {
      logger.warn({ src: 'http' }, 'AgentServer already initialized, skipping');
      return;
    }

    try {
      logger.debug({ src: 'http' }, 'Initializing AgentServer async operations');

      const agentDataDir = resolvePgliteDir(config?.dataDir);
      logger.info({ src: 'db', dataDir: agentDataDir }, 'Database directory configured');

      // Ensure the database directory exists
      const dbDir = path.dirname(agentDataDir);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
        logger.debug({ src: 'db', dbDir }, 'Database directory created');
      }

      // Create a temporary database adapter just for server operations (migrations, default server)
      // Each agent will have its own database adapter created by the SQL plugin
      const tempServerAgentId = '00000000-0000-0000-0000-000000000000'; // Temporary ID for server operations
      this.database = createDatabaseAdapter(
        {
          dataDir: agentDataDir,
          postgresUrl: config?.postgresUrl,
        },
        tempServerAgentId
      ) as DatabaseAdapterWithMessaging;
      await this.database.init();
      logger.success({ src: 'db' }, 'Database initialized for server operations');

      // Run migrations for the SQL plugin schema
      logger.info({ src: 'db' }, 'Running database migrations');
      try {
        const migrationService = new DatabaseMigrationService();

        // Get the underlying database instance
        const db = this.database.getDatabase?.();
        await migrationService.initializeWithDatabase(db);

        // Register the SQL plugin schema
        migrationService.discoverAndRegisterPluginSchemas([sqlPlugin]);

        // Run the migrations
        await migrationService.runAllPluginMigrations();

        logger.success({ src: 'db' }, 'Database migrations completed');
      } catch (migrationError) {
        logger.error({ src: 'db', error: migrationError }, 'Failed to run database migrations');
        throw new Error(
          `Database migration failed: ${migrationError instanceof Error ? migrationError.message : String(migrationError)}`
        );
      }

      const dataIsolationEnabled = process.env.ENABLE_DATA_ISOLATION === 'true';
      const elizaServerIdString = process.env.ELIZA_SERVER_ID;

      if (dataIsolationEnabled) {
        if (!config?.postgresUrl) {
          logger.error(
            { src: 'db' },
            'ENABLE_DATA_ISOLATION requires PostgreSQL (not compatible with PGLite)'
          );
          throw new Error('Data isolation requires PostgreSQL database');
        }

        if (!elizaServerIdString) {
          logger.error(
            { src: 'db' },
            'ENABLE_DATA_ISOLATION requires ELIZA_SERVER_ID environment variable'
          );
          throw new Error(
            'ELIZA_SERVER_ID environment variable is required when data isolation is enabled'
          );
        }

        // Convert ELIZA_SERVER_ID string to deterministic UUID
        const server_id = stringToUuid(elizaServerIdString);

        logger.info(
          { src: 'db', serverId: server_id.slice(0, 8), serverIdString: elizaServerIdString },
          'Initializing data isolation (Server RLS + Entity RLS)...'
        );
        logger.warn(
          { src: 'db' },
          'Ensure PostgreSQL user is NOT a superuser - superusers bypass RLS'
        );

        try {
          // Install RLS PostgreSQL functions (includes Entity RLS) but DO NOT apply policies yet
          await installRLSFunctions(this.database);

          // Get or create server with the provided server ID
          await getOrCreateRlsServer(this.database, server_id);

          // Store server_id for agent assignment
          this.rlsServerId = server_id as UUID;

          // Set RLS context for this server instance
          await setServerContext(this.database, server_id);

          // Note: applyRLSToNewTables() is NOT called here
          // RLS policies will be applied automatically after agent migrations complete
          // via DatabaseMigrationService.runAllPluginMigrations() to avoid server_id column conflicts

          logger.info(
            { src: 'db' },
            'RLS functions installed and context set (policies will apply after migrations)'
          );
          logger.info(
            { src: 'db' },
            'Entity RLS functions ready - entities will be isolated after migrations'
          );
        } catch (rlsError) {
          logger.error({ src: 'db', error: rlsError }, 'Failed to prepare RLS');
          throw new Error(
            `RLS preparation failed: ${rlsError instanceof Error ? rlsError.message : String(rlsError)}`
          );
        }
      } else if (config?.postgresUrl) {
        logger.info({ src: 'db' }, 'RLS multi-tenant isolation disabled');

        // Clean up RLS if it was previously enabled
        try {
          await uninstallRLS(this.database);
          logger.debug({ src: 'db' }, 'RLS cleanup completed');
        } catch (cleanupError) {
          // It's OK if cleanup fails (RLS might not have been installed)
        }
      }

      // Add a small delay to ensure database is fully ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ensure default server exists
      await this.ensureDefaultServer();

      logger.info({ src: 'http' }, 'Initializing ElizaOS');
      this.elizaOS = new ElizaOS();
      this.elizaOS.enableEditableMode();
```