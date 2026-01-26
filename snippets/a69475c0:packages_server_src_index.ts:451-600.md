# a69475c0:packages_server_src_index.ts:451-600

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/index.ts:451-600
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      this.isInitialized = true;
    } catch (error) {
      logger.error({ src: 'http', error }, 'Failed to initialize AgentServer');
      console.trace(error);
      throw error;
    }
  }

  private async ensureDefaultServer(): Promise<void> {
    try {
      // When data isolation is enabled, create a server per server instance instead of a shared default server
      const dataIsolationEnabled = process.env.ENABLE_DATA_ISOLATION === 'true';

      // Security: Separate RLS server_id (internal) from message_servers.id (public API)
      // - rlsServerId: Used for PostgreSQL RLS isolation (from ELIZA_SERVER_ID env var)
      // - messageServerId: Used for message_servers.id (random UUID, exposed in API)
      // This prevents leaking sensitive ELIZA_SERVER_ID values in public API paths
      if (dataIsolationEnabled && this.rlsServerId) {
        // Check if a message_server already exists for this RLS server instance
        const existingServer = await this.database.getMessageServerByRlsServerId(
          this.rlsServerId
        );

        if (existingServer) {
          // Reuse existing message_server ID (stable across restarts)
          this.messageServerId = existingServer.id;
          logger.info(
            {
              src: 'db',
              messageServerId: this.messageServerId,
              rlsServerId: this.rlsServerId.substring(0, 8),
            },
            'Found existing message_server for RLS server'
          );
        } else {
          // First boot: generate new random UUID for message_server (will be linked to rlsServerId via server_id column)
          this.messageServerId = crypto.randomUUID() as UUID;
          logger.info(
            {
              src: 'db',
              messageServerId: this.messageServerId,
              rlsServerId: this.rlsServerId.substring(0, 8),
            },
            'Generating new message_server ID for RLS server'
          );
        }
      } else {
        // RLS disabled: use shared default server
        this.messageServerId = '00000000-0000-0000-0000-000000000000';
      }

      const serverName =
        dataIsolationEnabled && this.rlsServerId
          ? `Server ${this.messageServerId.substring(0, 8)}`
          : 'Default Server';

      logger.info({ src: 'db', serverId: this.messageServerId }, 'Checking for server...');
      const servers = await this.database.getMessageServers();
      logger.debug({ src: 'db', serverCount: servers.length }, 'Found existing servers');

      const defaultServer = servers.find((s) => s.id === this.messageServerId);

      if (!defaultServer) {
        logger.info({ src: 'db', serverId: this.messageServerId }, 'Creating server...');

        // Use parameterized query to prevent SQL injection
        try {
          const db = this.database.db;
          await db.execute(sql`
            INSERT INTO message_servers (id, name, source_type, created_at, updated_at)
            VALUES (${this.messageServerId}, ${serverName}, ${'eliza_default'}, NOW(), NOW())
            ON CONFLICT (id) DO NOTHING
          `);
          logger.info(
            { src: 'db', serverId: this.messageServerId },
            'Server created via parameterized query'
          );
        } catch (sqlError: unknown) {
          logger.warn(
            { src: 'db', error: sqlError instanceof Error ? sqlError.message : String(sqlError) },
            'SQL insert failed, trying ORM'
          );

          // Try creating with ORM as fallback
          try {
            await this.database.createMessageServer({
              id: this.messageServerId as UUID,
              name: serverName,
              sourceType: 'eliza_default',
            });
          } catch (ormError: unknown) {
            const errorMessage = ormError instanceof Error ? ormError.message : String(ormError);
            logger.error({ src: 'db', error: errorMessage }, 'Both SQL and ORM creation failed');
            throw new Error(`Failed to create server: ${errorMessage}`);
          }
        }

        // Verify it was created
        const verifyServers = await this.database.getMessageServers();
        logger.debug(
          { src: 'db', serverCount: verifyServers.length },
          'After creation attempt, found servers'
        );

        const verifyDefault = verifyServers.find((s) => s.id === this.messageServerId);
        if (!verifyDefault) {
          throw new Error(`Failed to create or verify server with ID ${this.messageServerId}`);
        } else {
          logger.info(
            { src: 'db', serverId: this.messageServerId },
            'Server creation verified successfully'
          );
        }
        logger.info({ src: 'db', serverId: this.messageServerId }, 'Default server created');
      }
    } catch (error) {
      logger.error({ src: 'db', error }, 'Error ensuring default server');
      throw error;
    }
  }

  /**
   * Initializes the server with the provided configuration.
   *
   * @param {ServerConfig} [config] - Optional server configuration.
   * @returns {Promise<void>} - A promise that resolves once the server is initialized.
   * @private
   */
  private async initializeServer(config?: ServerConfig) {
    try {
      // Store the client path if provided
      if (config?.clientPath) {
        this.clientPath = config.clientPath;
      }

      // Initialize middleware and database
      this.app = express();

      // Initialize Sentry (if configured) before any other middleware
      const DEFAULT_SENTRY_DSN =
        'https://c20e2d51b66c14a783b0689d536f7e5c@o4509349865259008.ingest.us.sentry.io/4509352524120064';
      const sentryDsn = process.env.SENTRY_DSN?.trim() || DEFAULT_SENTRY_DSN;
      const sentryEnabled = Boolean(sentryDsn);
      if (sentryEnabled) {
        try {
          Sentry.init({
            dsn: sentryDsn,
            environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
            integrations: [Sentry.vercelAIIntegration({ force: sentryEnabled })],
            tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
```