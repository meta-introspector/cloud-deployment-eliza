# a7046c18:packages_plugin-sql_src_base.ts:3601-3750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:3601-3750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            name: rows[0].name,
            sourceType: rows[0].source_type,
            sourceId: rows[0].source_id || undefined,
            metadata: rows[0].metadata || undefined,
            createdAt: new Date(rows[0].created_at),
            updatedAt: new Date(rows[0].updated_at),
          }
        : null;
    });
  }

  /**
   * Creates a new channel
   */
  async createChannel(
    data: {
      id?: UUID; // Allow passing a specific ID
      messageServerId: UUID;
      name: string;
      type: string;
      sourceType?: string;
      sourceId?: string;
      topic?: string;
      metadata?: Metadata;
    },
    participantIds?: UUID[],
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
      const newId = data.id || (v4() as UUID);
      const now = new Date();
      const channelToInsert = {
        id: newId,
        messageServerId: data.messageServerId,
        name: data.name,
        type: data.type,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        topic: data.topic,
        metadata: data.metadata,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.transaction(async (tx) => {
        await tx.insert(channelTable).values(channelToInsert);

        if (participantIds && participantIds.length > 0) {
          const participantValues = participantIds.map((entityId) => ({
            channelId: newId,
            entityId: entityId,
          }));
          await tx
            .insert(channelParticipantsTable)
            .values(participantValues)
            .onConflictDoNothing();
        }
      });

      return channelToInsert;
    });
  }

  /**
   * Gets channels for a message server
   */
  async getChannelsForMessageServer(messageServerId: UUID): Promise<
    Array<{
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
    }>
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
```