# 2d12b6ef:packages_server_src_index.ts:1351-1500

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/index.ts:1351-1500
**Novelty Score:** 35.43
**Concepts:** testing

```
        } catch (stopError) {
          logger.error(
            { src: 'agent', error: stopError, agentId },
            'Error stopping agent services'
          );
        }
      }

      if (this.elizaOS) {
        await this.elizaOS.deleteAgents([agentId]);
      }

      logger.debug({ src: 'agent', agentId }, 'Agent unregistered');
    } catch (error) {
      logger.error({ src: 'agent', error, agentId }, 'Error removing agent');
    }
  }

  /**
   * Add middleware to the server's request handling pipeline
   * @param {ServerMiddleware} middleware - The middleware function to be registered
   */
  public registerMiddleware(middleware: ServerMiddleware) {
    this.app.use(middleware);
  }

  /**
   * Starts the server with unified configuration.
   * Handles initialization, port resolution, and optional agent startup.
   *
   * @param {ServerConfig} config - Server configuration including port, agents, and infrastructure options.
   * @returns {Promise<void>} A promise that resolves when the server is listening.
   * @throws {Error} If there is an error during initialization or startup.
   */
  public async start(config?: ServerConfig): Promise<void> {
    // Step 1: Auto-initialize if not already done
    if (!this.isInitialized) {
      await this.initialize(config);
    }

    // Step 2: Start HTTP server (skip in test mode)
    let boundPort: number | undefined;
    if (!config?.isTestMode) {
      boundPort = await this.resolveAndFindPort(config?.port);
      try {
        await this.startHttpServer(boundPort);
      } catch (error: unknown) {
        // If binding fails due to EADDRINUSE, attempt fallback to next available port
        const isAddressInUse =
          error instanceof Error &&
          'code' in error &&
          (error as NodeJS.ErrnoException).code === 'EADDRINUSE';
        if (isAddressInUse) {
          const startFrom = (boundPort ?? 3000) + 1;
          const fallbackPort = await this.findAvailablePort(startFrom);
          logger.warn({ src: 'http', port: boundPort, fallbackPort }, 'Port in use, falling back');
          boundPort = fallbackPort;
          await this.startHttpServer(boundPort);
        } else {
          throw error;
        }
      }

      // Ensure dependent services discover the final port
      if (boundPort) {
        process.env.SERVER_PORT = String(boundPort);
      }
    }

    // Step 3: Start agents if provided
    if (config?.agents && config.agents.length > 0) {
      await this.startAgents(config.agents, { isTestMode: config.isTestMode });
      logger.info({ src: 'agent', count: config.agents.length }, 'Started agents');
    }
  }

  /**
   * Resolves and finds an available port.
   * - If port is provided (number): validates and returns it (strict - fails if unavailable)
   * - If port is undefined: finds next available port starting from env/default (auto-discovery)
   */
  private async resolveAndFindPort(port?: number): Promise<number> {
    // Explicit port number: validate and fail if unavailable (strict mode)
    if (port !== undefined) {
      if (typeof port !== 'number' || port < 1 || port > 65535) {
        throw new Error(`Invalid port number: ${port}. Must be between 1 and 65535.`);
      }
      // Don't auto-discover, fail if port is taken
      return port;
    }

    // undefined: resolve from env/default, then find available (auto-discovery mode)
    let requestedPort = 3000;

    const envPort = process.env.SERVER_PORT;
    if (envPort) {
      const parsed = parseInt(envPort, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 65535) {
        requestedPort = parsed;
      } else {
        logger.warn({ src: 'http', envPort }, 'Invalid SERVER_PORT, falling back to 3000');
      }
    }

    // Find next available port starting from requestedPort
    return await this.findAvailablePort(requestedPort);
  }

  /**
   * Finds an available port starting from the requested port.
   * Tries incrementing ports up to maxAttempts.
   */
  private async findAvailablePort(startPort: number, maxAttempts = 10): Promise<number> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const port = startPort + attempt;

      if (port > 65535) {
        throw new Error(
          `Could not find available port (exceeded max port 65535, tried up to ${port - 1})`
        );
      }

      if (await this.isPortAvailable(port)) {
        if (attempt > 0) {
          logger.info(
            { src: 'http', requestedPort: startPort, actualPort: port },
            'Port in use, using alternative'
          );
        }
        return port;
      }
    }

    throw new Error(
      `Could not find available port after ${maxAttempts} attempts starting from ${startPort}`
    );
  }

  /**
   * Checks if a port is available by attempting to bind to it.
   */
  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      const host = process.env.SERVER_HOST || '0.0.0.0';

      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err && (err.code === 'EADDRINUSE' || err.code === 'EACCES')) {
          resolve(false);
        } else {
```