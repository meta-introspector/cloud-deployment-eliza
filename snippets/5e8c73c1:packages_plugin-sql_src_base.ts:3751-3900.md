# 5e8c73c1:packages_plugin-sql_src_base.ts:3751-3900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:3751-3900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
   */
  async deleteChannel(channelId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        // Delete all messages in the channel (cascade delete will handle this, but explicit is better)
        await tx.delete(messageTable).where(eq(messageTable.channelId, channelId));

        // Delete all participants (cascade delete will handle this, but explicit is better)
        await tx
          .delete(channelParticipantsTable)
          .where(eq(channelParticipantsTable.channelId, channelId));

        // Delete the channel itself
        await tx.delete(channelTable).where(eq(channelTable.id, channelId));
      });
    });
  }

  /**
   * Adds participants to a channel
   */
  async addChannelParticipants(channelId: UUID, entityIds: UUID[]): Promise<void> {
    return this.withDatabase(async () => {
      if (!entityIds || entityIds.length === 0) return;

      const participantValues = entityIds.map((entityId) => ({
        channelId: channelId,
        entityId: entityId,
      }));

      await this.db
        .insert(channelParticipantsTable)
        .values(participantValues)
        .onConflictDoNothing();
    });
  }

  /**
   * Gets participants for a channel
   */
  async getChannelParticipants(channelId: UUID): Promise<UUID[]> {
    return this.withDatabase(async () => {
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
  async isChannelParticipant(channelId: UUID, entityId: UUID): Promise<boolean> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select()
        .from(channelParticipantsTable)
        .where(
          and(
            eq(channelParticipantsTable.channelId, channelId),
            eq(channelParticipantsTable.entityId, entityId)
          )
        )
        .limit(1);

      return result.length > 0;
    });
  }

  /**
   * Adds an agent to a message server (Discord/Telegram server)
   */
  async addAgentToMessageServer(messageServerId: UUID, agentId: UUID): Promise<void> {
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
  async removeAgentFromMessageServer(messageServerId: UUID, agentId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db
        .delete(messageServerAgentsTable)
        .where(
          and(
            eq(messageServerAgentsTable.messageServerId, messageServerId),
            eq(messageServerAgentsTable.agentId, agentId)
          )
        );
    });
  }

  /**
   * Finds or creates a DM channel between two users
   */
  async findOrCreateDmChannel(
    user1Id: UUID,
    user2Id: UUID,
    messageServerId: UUID
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
            eq(channelTable.messageServerId, messageServerId)
```