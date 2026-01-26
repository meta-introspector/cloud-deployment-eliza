# 5e8c73c1:packages_plugin-sql_src_base.ts:3451-3600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:3451-3600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  > {
    return this.withDatabase(async () => {
      const results = await this.db
        .select()
        .from(channelTable)
        .where(eq(channelTable.messageServerId, messageServerId));
      return results.map((r) => ({
        id: r.id as UUID,
        messageServerId: r.messageServerId as UUID,
        name: r.name,
        type: r.type,
        sourceType: r.sourceType || undefined,
        sourceId: r.sourceId || undefined,
        topic: r.topic || undefined,
        metadata: r.metadata || undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
    });
  }

  /**
   * Gets channel details
   */
  async getChannelDetails(channelId: UUID): Promise<{
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
  } | null> {
    return this.withDatabase(async () => {
      const results = await this.db
        .select()
        .from(channelTable)
        .where(eq(channelTable.id, channelId))
        .limit(1);
      return results.length > 0
        ? {
            id: results[0].id as UUID,
            messageServerId: results[0].messageServerId as UUID,
            name: results[0].name,
            type: results[0].type,
            sourceType: results[0].sourceType || undefined,
            sourceId: results[0].sourceId || undefined,
            topic: results[0].topic || undefined,
            metadata: results[0].metadata || undefined,
            createdAt: results[0].createdAt,
            updatedAt: results[0].updatedAt,
          }
        : null;
    });
  }

  /**
   * Creates a message
   */
  async createMessage(data: {
    channelId: UUID;
    authorId: UUID;
    content: string;
    rawMessage?: Record<string, unknown>;
    sourceType?: string;
    sourceId?: string;
    metadata?: Metadata;
    inReplyToRootMessageId?: UUID;
    messageId?: UUID;
  }): Promise<{
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
  }> {
    return this.withDatabase(async () => {
      const newId = data.messageId || (v4() as UUID);
      const now = new Date();
      const messageToInsert = {
        id: newId,
        channelId: data.channelId,
        authorId: data.authorId,
        content: data.content,
        rawMessage: data.rawMessage,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        metadata: data.metadata,
        inReplyToRootMessageId: data.inReplyToRootMessageId,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(messageTable).values(messageToInsert);
      return messageToInsert;
    });
  }

  async getMessageById(id: UUID): Promise<{
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
  }> {
    return this.withDatabase(async () => {
      const rows = await this.db
        .select()
        .from(messageTable)
        .where(eq(messageTable.id, id))
        .limit(1);
      return rows?.[0] ?? null;
    });
  }

  async updateMessage(
    id: UUID,
    patch: {
      content?: string;
      rawMessage?: Record<string, unknown>;
      sourceType?: string;
      sourceId?: string;
      metadata?: Metadata;
      inReplyToRootMessageId?: UUID;
    }
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
```