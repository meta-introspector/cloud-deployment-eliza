# a7046c18:packages_plugin-sql_src_base.ts:4051-4200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:4051-4200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const results = await this.db
        .select({ entityId: channelParticipantsTable.entityId })
        .from(channelParticipantsTable)
        .where(eq(channelParticipantsTable.channelId, channelId));

      return results.map((r) => r.entityId as UUID);
    });
  }

  /**
   * Check if an entity is a participant in a specific messaging channel.
   * @param {UUID} channelId - The ID of the channel to check.
   * @param {UUID} entityId - The ID of the entity to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if entity is a participant.
   */
  async isChannelParticipant(
    channelId: UUID,
    entityId: UUID,
  ): Promise<boolean> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select()
        .from(channelParticipantsTable)
        .where(
          and(
            eq(channelParticipantsTable.channelId, channelId),
            eq(channelParticipantsTable.entityId, entityId),
          ),
        )
        .limit(1);

      return result.length > 0;
    });
  }

  /**
   * Adds an agent to a message server (Discord/Telegram server)
   */
  async addAgentToMessageServer(
    messageServerId: UUID,
    agentId: UUID,
  ): Promise<void> {
    return this.withDatabase(async () => {
      await this.db
        .insert(messageServerAgentsTable)
        .values({
          messageServerId,
          agentId,
        })
        .onConflictDoNothing();
    });
  }

  /**
   * Gets agents for a message server (Discord/Telegram server)
   */
  async getAgentsForMessageServer(messageServerId: UUID): Promise<UUID[]> {
    return this.withDatabase(async () => {
      const results = await this.db
        .select({ agentId: messageServerAgentsTable.agentId })
        .from(messageServerAgentsTable)
        .where(eq(messageServerAgentsTable.messageServerId, messageServerId));

      return results.map((r) => r.agentId as UUID);
    });
  }

  /**
   * Removes an agent from a message server (Discord/Telegram server)
   */
  async removeAgentFromMessageServer(
    messageServerId: UUID,
    agentId: UUID,
  ): Promise<void> {
    return this.withDatabase(async () => {
      await this.db
        .delete(messageServerAgentsTable)
        .where(
          and(
            eq(messageServerAgentsTable.messageServerId, messageServerId),
            eq(messageServerAgentsTable.agentId, agentId),
          ),
        );
    });
  }

  /**
   * Finds or creates a DM channel between two users
   */
  async findOrCreateDmChannel(
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
  }> {
    return this.withDatabase(async () => {
      const ids = [user1Id, user2Id].sort();
      const dmChannelName = `DM-${ids[0]}-${ids[1]}`;

      const existingChannels = await this.db
        .select()
        .from(channelTable)
        .where(
          and(
            eq(channelTable.type, ChannelType.DM),
            eq(channelTable.name, dmChannelName),
            eq(channelTable.messageServerId, messageServerId),
          ),
        )
        .limit(1);

      if (existingChannels.length > 0) {
        return {
          id: existingChannels[0].id as UUID,
          messageServerId: existingChannels[0].messageServerId as UUID,
          name: existingChannels[0].name,
          type: existingChannels[0].type,
          sourceType: existingChannels[0].sourceType || undefined,
          sourceId: existingChannels[0].sourceId || undefined,
          topic: existingChannels[0].topic || undefined,
          metadata: existingChannels[0].metadata || undefined,
          createdAt: existingChannels[0].createdAt,
          updatedAt: existingChannels[0].updatedAt,
        };
      }

      // Create new DM channel
      return this.createChannel(
        {
          messageServerId,
          name: dmChannelName,
          type: ChannelType.DM,
          metadata: { user1: ids[0], user2: ids[1] },
        },
        ids,
      );
    });
  }
}

```