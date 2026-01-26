# 5e8c73c1:packages_server_src_index.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/index.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      // Ensure default server exists
      await this.ensureDefaultServer();

      logger.info({ src: 'http' }, 'Initializing ElizaOS');
      this.elizaOS = new ElizaOS();
      this.elizaOS.enableEditableMode();
      setGlobalElizaOS(this.elizaOS);
      setGlobalAgentServer(this);
      logger.success({ src: 'http' }, 'ElizaOS initialized');

      await this.initializeServer(config);
      await new Promise((resolve) => setTimeout(resolve, 250));
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
        const existingServer = await this.database.getMessageServerByRlsServerId(this.rlsServerId);

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
```