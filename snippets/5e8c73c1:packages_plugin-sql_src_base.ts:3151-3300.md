# 5e8c73c1:packages_plugin-sql_src_base.ts:3151-3300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:3151-3300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const rooms = await this.db
        .select({ id: roomTable.id })
        .from(roomTable)
        .where(and(eq(roomTable.worldId, params.worldId), eq(roomTable.agentId, this.agentId)));

      if (rooms.length === 0) {
        return [];
      }

      const roomIds = rooms.map((room) => room.id as UUID);

      const memories = await this.getMemoriesByRoomIds({
        roomIds,
        tableName: params.tableName || 'messages',
        limit: params.count,
      });

      return memories;
    });
  }

  async deleteRoomsByWorldId(worldId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      const rooms = await this.db
        .select({ id: roomTable.id })
        .from(roomTable)
        .where(and(eq(roomTable.worldId, worldId), eq(roomTable.agentId, this.agentId)));

      if (rooms.length === 0) {
        return;
      }

      const roomIds = rooms.map((room) => room.id as UUID);

      if (roomIds.length > 0) {
        await this.db.delete(logTable).where(inArray(logTable.roomId, roomIds));
        await this.db.delete(participantTable).where(inArray(participantTable.roomId, roomIds));

        const memoriesInRooms = await this.db
          .select({ id: memoryTable.id })
          .from(memoryTable)
          .where(inArray(memoryTable.roomId, roomIds));
        const memoryIdsInRooms = memoriesInRooms.map((m) => m.id as UUID);

        if (memoryIdsInRooms.length > 0) {
          await this.db
            .delete(embeddingTable)
            .where(inArray(embeddingTable.memoryId, memoryIdsInRooms));
          await this.db.delete(memoryTable).where(inArray(memoryTable.id, memoryIdsInRooms));
        }

        await this.db.delete(roomTable).where(inArray(roomTable.id, roomIds));

        logger.debug(
          {
            src: 'plugin:sql',
            worldId,
            roomsDeleted: roomIds.length,
            memoriesDeleted: memoryIdsInRooms.length,
          },
          'World cleanup completed'
        );
      }
    });
  }

  // Message Server Database Operations

  /**
   * Creates a new message server in the central database
   */
  async createMessageServer(data: {
    id?: UUID; // Allow passing a specific ID
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
  }): Promise<{
    id: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.withDatabase(async () => {
      const newId = data.id || (v4() as UUID);
      const now = new Date();
      const serverToInsert = {
        id: newId,
        name: data.name,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        metadata: data.metadata,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(messageServerTable).values(serverToInsert).onConflictDoNothing(); // In case the ID already exists

      // If server already existed, fetch it
      if (data.id) {
        const existing = await this.db
          .select()
          .from(messageServerTable)
          .where(eq(messageServerTable.id, data.id))
          .limit(1);
        if (existing.length > 0) {
          return {
            id: existing[0].id as UUID,
            name: existing[0].name,
            sourceType: existing[0].sourceType,
            sourceId: existing[0].sourceId || undefined,
            metadata: existing[0].metadata || undefined,
            createdAt: existing[0].createdAt,
            updatedAt: existing[0].updatedAt,
          };
        }
      }

      return serverToInsert;
    });
  }

  /**
   * Gets all message servers
   */
  async getMessageServers(): Promise<
    Array<{
      id: UUID;
      name: string;
      sourceType: string;
      sourceId?: string;
      metadata?: Metadata;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    const result = await this.withDatabase(async () => {
      const results = await this.db.select().from(messageServerTable);
      return results.map((r) => ({
        id: r.id as UUID,
        name: r.name,
        sourceType: r.sourceType,
        sourceId: r.sourceId || undefined,
        metadata: r.metadata || undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));
```