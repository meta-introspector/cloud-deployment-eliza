# a7046c18:packages_plugin-sql_src_base.d.ts:901-1049

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.d.ts:901-1049
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    authorId: UUID;
    content: string;
    rawMessage?: Record<string, unknown>;
    sourceType?: string;
    sourceId?: string;
    metadata?: Metadata;
    inReplyToRootMessageId?: UUID;
    createdAt: Date;
    updatedAt: Date;
  }>;
  getMessageById(id: UUID): Promise<{
    id: UUID;
    channelId: UUID;
    authorId: UUID;
    content: string;
    rawMessage?: Record<string, unknown>;
    sourceType?: string;
    sourceId?: string;
    metadata?: Metadata;
    inReplyToRootMessageId?: UUID;
    createdAt: Date;
    updatedAt: Date;
  }>;
  updateMessage(
    id: UUID,
    patch: {
      content?: string;
      rawMessage?: Record<string, unknown>;
      sourceType?: string;
      sourceId?: string;
      metadata?: Metadata;
      inReplyToRootMessageId?: UUID;
    },
  ): Promise<{
    id: UUID;
    channelId: UUID;
    authorId: UUID;
    content: string;
    rawMessage?: Record<string, unknown>;
    sourceType?: string;
    sourceId?: string;
    metadata?: Metadata;
    inReplyToRootMessageId?: UUID;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  /**
   * Gets messages for a channel
   */
  getMessagesForChannel(
    channelId: UUID,
    limit?: number,
    beforeTimestamp?: Date,
  ): Promise<
    Array<{
      id: UUID;
      channelId: UUID;
      authorId: UUID;
      content: string;
      rawMessage?: Record<string, unknown>;
      sourceType?: string;
      sourceId?: string;
      metadata?: Metadata;
      inReplyToRootMessageId?: UUID;
      createdAt: Date;
      updatedAt: Date;
    }>
  >;
  /**
   * Deletes a message
   */
  deleteMessage(messageId: UUID): Promise<void>;
  /**
   * Updates a channel
   */
  updateChannel(
    channelId: UUID,
    updates: {
      name?: string;
      participantCentralUserIds?: UUID[];
      metadata?: Metadata;
    },
  ): Promise<{
    id: UUID;
    messageServerId: UUID;
    name: string;
    type: string;
    sourceType?: string;
    sourceId?: string;
    topic?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  }>;
  /**
   * Deletes a channel and all its associated data
   */
  deleteChannel(channelId: UUID): Promise<void>;
  /**
   * Adds participants to a channel
   */
  addChannelParticipants(channelId: UUID, entityIds: UUID[]): Promise<void>;
  /**
   * Gets participants for a channel
   */
  getChannelParticipants(channelId: UUID): Promise<UUID[]>;
  /**
   * Check if an entity is a participant in a specific messaging channel.
   * @param {UUID} channelId - The ID of the channel to check.
   * @param {UUID} entityId - The ID of the entity to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if entity is a participant.
   */
  isChannelParticipant(channelId: UUID, entityId: UUID): Promise<boolean>;
  /**
   * Adds an agent to a message server (Discord/Telegram server)
   */
  addAgentToMessageServer(messageServerId: UUID, agentId: UUID): Promise<void>;
  /**
   * Gets agents for a message server (Discord/Telegram server)
   */
  getAgentsForMessageServer(messageServerId: UUID): Promise<UUID[]>;
  /**
   * Removes an agent from a message server (Discord/Telegram server)
   */
  removeAgentFromMessageServer(
    messageServerId: UUID,
    agentId: UUID,
  ): Promise<void>;
  /**
   * Finds or creates a DM channel between two users
   */
  findOrCreateDmChannel(
    user1Id: UUID,
    user2Id: UUID,
    messageServerId: UUID,
  ): Promise<{
    id: UUID;
    messageServerId: UUID;
    name: string;
    type: string;
    sourceType?: string;
    sourceId?: string;
    topic?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
//# sourceMappingURL=base.d.ts.map
```