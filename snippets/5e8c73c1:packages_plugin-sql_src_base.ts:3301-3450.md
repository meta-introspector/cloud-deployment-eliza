# 5e8c73c1:packages_plugin-sql_src_base.ts:3301-3450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:3301-3450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    });
    // Guard against null return
    return result || [];
  }

  /**
   * Gets a message server by ID
   */
  async getMessageServerById(serverId: UUID): Promise<{
    id: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    return this.withDatabase(async () => {
      const results = await this.db
        .select()
        .from(messageServerTable)
        .where(eq(messageServerTable.id, serverId))
        .limit(1);
      return results.length > 0
        ? {
            id: results[0].id as UUID,
            name: results[0].name,
            sourceType: results[0].sourceType,
            sourceId: results[0].sourceId || undefined,
            metadata: results[0].metadata || undefined,
            createdAt: results[0].createdAt,
            updatedAt: results[0].updatedAt,
          }
        : null;
    });
  }

  /**
   * Gets a message server by RLS server_id
   * Note: server_id column only exists when RLS is enabled (added dynamically by RLS setup)
   * This is used to find the message_server linked to a specific RLS server instance
   */
  async getMessageServerByRlsServerId(rlsServerId: UUID): Promise<{
    id: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    return this.withDatabase(async () => {
      // Use raw SQL since server_id column is dynamically added by RLS and not in Drizzle schema
      const results = await this.db.execute(sql`
        SELECT id, name, source_type, source_id, metadata, created_at, updated_at
        FROM message_servers
        WHERE server_id = ${rlsServerId}
        LIMIT 1
      `);

      const rows = results.rows || results;
      return rows.length > 0
        ? {
            id: rows[0].id as UUID,
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
    participantIds?: UUID[]
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
          await tx.insert(channelParticipantsTable).values(participantValues).onConflictDoNothing();
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
```