# a7046c18:packages_plugin-sql_src_base.ts:2401-2550

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:2401-2550
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        conditions.push(eq(memoryTable.unique, true));
      }

      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(memoryTable)
        .where(and(...conditions));

      return Number(result[0]?.count ?? 0);
    });
  }

  /**
   * Asynchronously retrieves rooms from the database based on the provided parameters.
   * @param {UUID[]} roomIds - The IDs of the rooms to retrieve.
   * @returns {Promise<Room[] | null>} A Promise that resolves to the rooms if found, null otherwise.
   */
  async getRoomsByIds(roomIds: UUID[]): Promise<Room[] | null> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({
          id: roomTable.id,
          name: roomTable.name, // Added name
          channelId: roomTable.channelId,
          agentId: roomTable.agentId,
          messageServerId: roomTable.messageServerId,
          worldId: roomTable.worldId,
          type: roomTable.type,
          source: roomTable.source,
          metadata: roomTable.metadata, // Added metadata
        })
        .from(roomTable)
        .where(
          and(
            inArray(roomTable.id, roomIds),
            eq(roomTable.agentId, this.agentId),
          ),
        );

      // Map the result to properly typed Room objects
      const rooms = result.map((room) => ({
        ...room,
        id: room.id as UUID,
        name: room.name ?? undefined,
        agentId: room.agentId as UUID,
        messageServerId: room.messageServerId as UUID,
        serverId: room.messageServerId as UUID, // Backward compatibility alias
        worldId: room.worldId as UUID,
        channelId: room.channelId as UUID,
        type: room.type as ChannelType,
        metadata: room.metadata as RoomMetadata,
      }));

      return rooms;
    });
  }

  /**
   * Asynchronously retrieves all rooms from the database based on the provided parameters.
   * @param {UUID} worldId - The ID of the world to retrieve rooms from.
   * @returns {Promise<Room[]>} A Promise that resolves to an array of rooms.
   */
  async getRoomsByWorld(worldId: UUID): Promise<Room[]> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select()
        .from(roomTable)
        .where(eq(roomTable.worldId, worldId));
      const rooms = result.map((room) => ({
        ...room,
        id: room.id as UUID,
        name: room.name ?? undefined,
        agentId: room.agentId as UUID,
        messageServerId: room.messageServerId as UUID,
        serverId: room.messageServerId as UUID, // Backward compatibility alias
        worldId: room.worldId as UUID,
        channelId: room.channelId as UUID,
        type: room.type as ChannelType,
        metadata: room.metadata as RoomMetadata,
      }));
      return rooms;
    });
  }

  /**
   * Asynchronously updates a room in the database based on the provided parameters.
   * @param {Room} room - The room object to update.
   * @returns {Promise<void>} A Promise that resolves when the room is updated.
   */
  async updateRoom(room: Room): Promise<void> {
    return this.withDatabase(async () => {
      await this.db
        .update(roomTable)
        .set({ ...room, agentId: this.agentId })
        .where(eq(roomTable.id, room.id));
    });
  }

  /**
   * Asynchronously creates a new room in the database based on the provided parameters.
   * @param {Room} room - The room object to create.
   * @returns {Promise<UUID>} A Promise that resolves to the ID of the created room.
   */
  async createRooms(rooms: Room[]): Promise<UUID[]> {
    return this.withDatabase(async () => {
      const roomsWithIds = rooms.map((room) => ({
        ...room,
        agentId: this.agentId,
        id: room.id || v4(), // ensure each room has a unique ID
      }));

      const insertedRooms = await this.db
        .insert(roomTable)
        .values(roomsWithIds)
        .onConflictDoNothing()
        .returning();
      const insertedIds = insertedRooms.map((r) => r.id as UUID);
      return insertedIds;
    });
  }

  /**
   * Asynchronously deletes a room from the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to delete.
   * @returns {Promise<void>} A Promise that resolves when the room is deleted.
   */
  async deleteRoom(roomId: UUID): Promise<void> {
    if (!roomId) throw new Error("Room ID is required");
    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        await tx.delete(roomTable).where(eq(roomTable.id, roomId));
      });
    });
  }

  /**
   * Asynchronously retrieves all rooms for a participant from the database based on the provided parameters.
   * @param {UUID} entityId - The ID of the entity to retrieve rooms for.
   * @returns {Promise<UUID[]>} A Promise that resolves to an array of room IDs.
   */
  async getRoomsForParticipant(entityId: UUID): Promise<UUID[]> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({ roomId: participantTable.roomId })
        .from(participantTable)
        .innerJoin(roomTable, eq(participantTable.roomId, roomTable.id))
        .where(
          and(
            eq(participantTable.entityId, entityId),
            eq(roomTable.agentId, this.agentId),
```