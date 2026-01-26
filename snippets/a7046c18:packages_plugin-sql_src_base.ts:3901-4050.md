# a7046c18:packages_plugin-sql_src_base.ts:3901-4050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:3901-4050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        .select()
        .from(messageTable)
        .where(and(...conditions))
        .orderBy(desc(messageTable.createdAt))
        .limit(limit);

      const results = await query;
      return results.map((r) => ({
        id: r.id as UUID,
        channelId: r.channelId as UUID,
        authorId: r.authorId as UUID,
        content: r.content,
        rawMessage: r.rawMessage || undefined,
        sourceType: r.sourceType || undefined,
        sourceId: r.sourceId || undefined,
        metadata: r.metadata || undefined,
        inReplyToRootMessageId: r.inReplyToRootMessageId as UUID | undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
    });
  }

  /**
   * Deletes a message
   */
  async deleteMessage(messageId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.delete(messageTable).where(eq(messageTable.id, messageId));
    });
  }

  /**
   * Updates a channel
   */
  async updateChannel(
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
  }> {
    return this.withDatabase(async () => {
      const now = new Date();

      await this.db.transaction(async (tx) => {
        // Update channel details
        const updateData: Record<string, unknown> = { updatedAt: now };
        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.metadata !== undefined)
          updateData.metadata = updates.metadata;

        await tx
          .update(channelTable)
          .set(updateData)
          .where(eq(channelTable.id, channelId));

        // Update participants if provided
        if (updates.participantCentralUserIds !== undefined) {
          // Remove existing participants
          await tx
            .delete(channelParticipantsTable)
            .where(eq(channelParticipantsTable.channelId, channelId));

          // Add new participants
          if (updates.participantCentralUserIds.length > 0) {
            const participantValues = updates.participantCentralUserIds.map(
              (entityId) => ({
                channelId: channelId,
                entityId: entityId,
              }),
            );
            await tx
              .insert(channelParticipantsTable)
              .values(participantValues)
              .onConflictDoNothing();
          }
        }
      });

      // Return updated channel details
      const updatedChannel = await this.getChannelDetails(channelId);
      if (!updatedChannel) {
        throw new Error(`Channel ${channelId} not found after update`);
      }
      return updatedChannel;
    });
  }

  /**
   * Deletes a channel and all its associated data
   */
  async deleteChannel(channelId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        // Delete all messages in the channel (cascade delete will handle this, but explicit is better)
        await tx
          .delete(messageTable)
          .where(eq(messageTable.channelId, channelId));

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
  async addChannelParticipants(
    channelId: UUID,
    entityIds: UUID[],
  ): Promise<void> {
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
```