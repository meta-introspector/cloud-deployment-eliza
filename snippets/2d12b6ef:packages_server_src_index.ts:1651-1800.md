# 2d12b6ef:packages_server_src_index.ts:1651-1800

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/index.ts:1651-1800
**Novelty Score:** 35.43
**Concepts:** testing

```
    for (const message of messages) {
      await this.database.deleteMessage(message.id);
    }
    logger.debug({ src: 'db', channelId }, 'Cleared channel messages');
  }

  async findOrCreateCentralDmChannel(
    user1Id: UUID,
    user2Id: UUID,
    messageServerId: UUID
  ): Promise<MessageChannel> {
    return this.database.findOrCreateDmChannel(user1Id, user2Id, messageServerId);
  }

  /**
   * Creates a message in the database.
   */
  async createMessage(
    data: Omit<CentralRootMessage, 'id' | 'createdAt' | 'updatedAt'> & { messageId?: UUID }
  ): Promise<CentralRootMessage> {
    return this.database.createMessage({
      ...data,
      messageId: data.messageId,
    });
  }

  async getMessagesForChannel(
    channelId: UUID,
    limit: number = 50,
    beforeTimestamp?: Date
  ): Promise<CentralRootMessage[]> {
    // TODO: Add afterTimestamp support when database layer is updated
    return this.database.getMessagesForChannel(channelId, limit, beforeTimestamp);
  }

  async updateMessage(
    messageId: UUID,
    patch: {
      content?: string;
      rawMessage?: Record<string, unknown>;
      sourceType?: string;
      sourceId?: string;
      metadata?: Record<string, unknown>;
      inReplyToRootMessageId?: UUID;
    }
  ): Promise<CentralRootMessage | null> {
    return this.database.updateMessage(messageId, patch);
  }

  // Optional: Method to remove a participant
  async removeParticipantFromChannel(): Promise<void> {
    // Since we don't have a direct method for this, we'll need to handle it at the channel level
    logger.warn({ src: 'db' }, 'Remove participant operation not supported');
  }

  // ===============================
  // MessageServer-Agent Association Methods
  // ===============================

  /**
   * Add an agent to a message server (Discord/Telegram server)
   * @param {UUID} messageServerId - The message server ID
   * @param {UUID} agentId - The agent ID to add
   */
  async addAgentToMessageServer(messageServerId: UUID, agentId: UUID): Promise<void> {
    // First, verify the message server exists
    const messageServer = await this.getServerById(messageServerId);
    if (!messageServer) {
      throw new Error(`Message server ${messageServerId} not found`);
    }

    return this.database.addAgentToMessageServer(messageServerId, agentId);
  }

  /**
   * Remove an agent from a message server (Discord/Telegram server)
   * @param {UUID} messageServerId - The message server ID
   * @param {UUID} agentId - The agent ID to remove
   */
  async removeAgentFromMessageServer(messageServerId: UUID, agentId: UUID): Promise<void> {
    return this.database.removeAgentFromMessageServer(messageServerId, agentId);
  }

  /**
   * Get all agents associated with a message server (Discord/Telegram server)
   * @param {UUID} messageServerId - The message server ID
   * @returns {Promise<UUID[]>} Array of agent IDs
   */
  async getAgentsForMessageServer(messageServerId: UUID): Promise<UUID[]> {
    return this.database.getAgentsForMessageServer(messageServerId);
  }

  /**
   * Get all message servers an agent belongs to
   * @param {UUID} agentId - The agent ID
   * @returns {Promise<UUID[]>} Array of message server IDs
   */
  async getMessageServersForAgent(agentId: UUID): Promise<UUID[]> {
    // This method isn't directly supported in the adapter, so we need to implement it differently
    const messageServers = await this.database.getMessageServers();
    const messageServerIds = [];
    for (const messageServer of messageServers) {
      const agents = await this.database.getAgentsForMessageServer(messageServer.id);
      if (agents.includes(agentId)) {
        messageServerIds.push(messageServer.id as never);
      }
    }
    return messageServerIds;
  }

  /**
   * Registers signal handlers for graceful shutdown.
   * This is called once in the constructor to prevent handler accumulation.
   */
  private registerSignalHandlers(): void {
    const gracefulShutdown = async () => {
      logger.info({ src: 'http' }, 'Received shutdown signal');

      const agents = this.elizaOS?.getAgents() || [];
      for (const agent of agents) {
        try {
          await agent.stop();
        } catch (error) {
          logger.error({ src: 'agent', error, agentId: agent.agentId }, 'Error stopping agent');
        }
      }

      if (this.database) {
        try {
          await this.database.close();
        } catch (error) {
          logger.error({ src: 'db', error }, 'Error closing database');
        }
      }

      if (this.server) {
        this.server.close(() => {
          logger.success({ src: 'http' }, 'Server closed');
          process.exit(0);
        });

        setTimeout(() => {
          logger.error({ src: 'http' }, 'Forcing shutdown after timeout');
          process.exit(1);
        }, 5000);
      } else {
        process.exit(0);
      }
    };

```