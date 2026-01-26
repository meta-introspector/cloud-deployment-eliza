# a69475c0:packages_server_src_index.ts:1501-1650

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/index.ts:1501-1650
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
        server.close();
        resolve(true);
      });

      try {
        server.listen(port, host);
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Starts the HTTP server on the specified port.
   */
  private startHttpServer(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Use http server instead of app.listen with explicit host binding and error handling
        // For tests and macOS compatibility, prefer 127.0.0.1 when specified
        const host = process.env.SERVER_HOST || '0.0.0.0';

        this.server
          .listen(port, host, () => {
            // Only show the dashboard URL if UI is enabled
            if (this.isWebUIEnabled && process.env.NODE_ENV !== 'development') {
              // Display the dashboard URL with the correct port after the server is actually listening
              console.log(
                `\x1b[32mStartup successful!\nGo to the dashboard at \x1b[1mhttp://localhost:${port}\x1b[22m\x1b[0m`
              );
            } else if (!this.isWebUIEnabled) {
              // Use actual host or localhost
              const actualHost = host === '0.0.0.0' ? 'localhost' : host;
              const baseUrl = `http://${actualHost}:${port}`;

              console.log(
                '\x1b[32mStartup successful!\x1b[0m\n' +
                  '\x1b[33mWeb UI disabled.\x1b[0m \x1b[32mAPI endpoints available at:\x1b[0m\n' +
                  `  \x1b[1m${baseUrl}/api/server/ping\x1b[22m\x1b[0m\n` +
                  `  \x1b[1m${baseUrl}/api/agents\x1b[22m\x1b[0m\n` +
                  `  \x1b[1m${baseUrl}/api/messaging\x1b[22m\x1b[0m`
              );
            }

            // Add log for test readiness
            console.log(`AgentServer is listening on port ${port}`);

            logger.success({ src: 'http', host, port }, 'REST API started');

            // Resolve the promise now that the server is actually listening
            resolve();
          })
          .on('error', (error: NodeJS.ErrnoException) => {
            logger.error({ src: 'http', error, host, port }, 'Failed to bind server');
            reject(error);
          });
      } catch (error) {
        logger.error({ src: 'http', error }, 'Failed to start server');
        reject(error);
      }
    });
  }

  /**
   * Stops the server if it is running. Closes the server connection,
   * stops the database connection, and logs a success message.
   */
  public async stop(): Promise<void> {
    if (this.server) {
      this.server.close(() => {
        logger.success({ src: 'http' }, 'Server stopped');
      });
    }
  }

  // Central DB Data Access Methods
  async createServer(
    data: Omit<MessageServer, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MessageServer> {
    return this.database.createMessageServer(data);
  }

  async getServers(): Promise<MessageServer[]> {
    return this.database.getMessageServers();
  }

  async getServerById(serverId: UUID): Promise<MessageServer | null> {
    return this.database.getMessageServerById(serverId);
  }

  async getMessageServerBySourceType(sourceType: string): Promise<MessageServer | null> {
    const servers = await this.database.getMessageServers();
    const filtered = servers.filter((s: MessageServer) => s.sourceType === sourceType);
    return filtered.length > 0 ? filtered[0] : null;
  }

  async createChannel(
    data: Omit<MessageChannel, 'id' | 'createdAt' | 'updatedAt'> & { id?: UUID },
    participantIds?: UUID[]
  ): Promise<MessageChannel> {
    return this.database.createChannel(data, participantIds);
  }

  async addParticipantsToChannel(channelId: UUID, userIds: UUID[]): Promise<void> {
    return this.database.addChannelParticipants(channelId, userIds);
  }

  async getChannelsForMessageServer(messageServerId: UUID): Promise<MessageChannel[]> {
    return this.database.getChannelsForMessageServer(messageServerId);
  }

  async getChannelDetails(channelId: UUID): Promise<MessageChannel | null> {
    return this.database.getChannelDetails(channelId);
  }

  async getChannelParticipants(channelId: UUID): Promise<UUID[]> {
    return this.database.getChannelParticipants(channelId);
  }

  async isChannelParticipant(channelId: UUID, entityId: UUID): Promise<boolean> {
    return await this.database.isChannelParticipant(channelId, entityId);
  }

  async deleteMessage(messageId: UUID): Promise<void> {
    return this.database.deleteMessage(messageId);
  }

  async updateChannel(
    channelId: UUID,
    updates: { name?: string; participantCentralUserIds?: UUID[]; metadata?: Record<string, unknown> }
  ): Promise<MessageChannel> {
    return this.database.updateChannel(channelId, updates);
  }

  async deleteChannel(channelId: UUID): Promise<void> {
    return this.database.deleteChannel(channelId);
  }

  async clearChannelMessages(channelId: UUID): Promise<void> {
    // Get all messages for the channel and delete them one by one
    const messages = await this.database.getMessagesForChannel(channelId, 1000);
    for (const message of messages) {
      await this.database.deleteMessage(message.id);
    }
    logger.debug({ src: 'db', channelId }, 'Cleared channel messages');
  }

  async findOrCreateCentralDmChannel(
    user1Id: UUID,
    user2Id: UUID,
```