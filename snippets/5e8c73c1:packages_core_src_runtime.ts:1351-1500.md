# 5e8c73c1:packages_core_src_runtime.ts:1351-1500

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:1351-1500
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        'ensureConnections called without rooms'
      );
      return;
    }

    // Create/ensure the world exists for this server
    await this.ensureWorldExists({ ...world, agentId: this.agentId });

    const firstRoom = rooms[0];

    // Helper function for chunking arrays
    const chunkArray = <T>(arr: T[], size: number): T[][] =>
      arr.reduce((chunks: T[][], item: T, i: number) => {
        if (i % size === 0) chunks.push([]);
        chunks[chunks.length - 1].push(item);
        return chunks;
      }, []);

    // Step 1: Create all rooms FIRST (before adding any participants)
    const roomIds = rooms.map((r: { id: UUID }) => r.id);
    const roomExistsCheck = await this.getRoomsByIds(roomIds);
    const roomsIdExists = roomExistsCheck?.map((r: { id: UUID }) => r.id);
    const roomsToCreate = roomIds.filter((id: UUID) => !roomsIdExists?.includes(id));

    const rf = {
      worldId: world.id,
      messageServerId: world.messageServerId,
      source,
      agentId: this.agentId,
    };

    if (roomsToCreate.length) {
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, count: roomsToCreate.length },
        'Creating rooms'
      );
      const roomObjsToCreate: Room[] = rooms
        .filter((r) => roomsToCreate.includes(r.id))
        .map((r) => ({ ...r, ...rf, type: r.type || ChannelType.GROUP }));
      await this.createRooms(roomObjsToCreate);
    }

    // Step 2: Create all entities
    const entityIds = entities.map((e) => e.id).filter((id): id is UUID => id !== undefined);
    const entityExistsCheck = await this.adapter.getEntitiesByIds(entityIds);
    const entitiesToUpdate =
      entityExistsCheck?.map((e) => e.id).filter((id): id is UUID => id !== undefined) || [];
    const entitiesToCreate = entities.filter(
      (e) => e.id !== undefined && !entitiesToUpdate.includes(e.id)
    );

    const r = {
      roomId: firstRoom.id,
      channelId: firstRoom.channelId,
      type: firstRoom.type,
    };
    const wf = {
      worldId: world.id,
      messageServerId: world.messageServerId,
    };

    if (entitiesToCreate.length) {
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, count: entitiesToCreate.length },
        'Creating entities'
      );
      const ef = {
        ...r,
        ...wf,
        source,
        agentId: this.agentId,
      };
      const entitiesToCreateWFields: Entity[] = entitiesToCreate.map((e) => ({
        ...e,
        ...ef,
        metadata: e.metadata || {},
      }));
      // pglite doesn't like over 10k records
      const batches = chunkArray(entitiesToCreateWFields, 5000);
      for (const batch of batches) {
        await this.createEntities(batch);
      }
    }

    // Step 3: Now add all participants (rooms and entities must exist by now)
    // Always add the agent to the first room
    await this.ensureParticipantInRoom(this.agentId, firstRoom.id);

    // Add all entities to the first room
    const entityIdsInFirstRoom = await this.getParticipantsForRoom(firstRoom.id);
    const entityIdsInFirstRoomFiltered = entityIdsInFirstRoom.filter(
      (id): id is UUID => id !== undefined
    );
    const missingIdsInRoom = entityIds.filter(
      (id: UUID) => !entityIdsInFirstRoomFiltered.includes(id)
    );

    if (missingIdsInRoom.length) {
      this.logger.debug(
        {
          src: 'agent',
          agentId: this.agentId,
          count: missingIdsInRoom.length,
          channelId: firstRoom.id,
        },
        'Adding missing participants'
      );
      // pglite handle this at over 10k records fine though
      const batches = chunkArray(missingIdsInRoom, 5000);
      for (const batch of batches) {
        await this.addParticipantsRoom(batch, firstRoom.id);
      }
    }

    this.logger.success(
      { src: 'agent', agentId: this.agentId, worldId: world.id },
      'World connected'
    );
  }

  async ensureConnection({
    entityId,
    roomId,
    worldId,
    worldName,
    userName,
    name,
    source,
    type,
    channelId,
    messageServerId,
    userId,
    metadata,
  }: {
    entityId: UUID;
    roomId: UUID;
    worldId: UUID;
    worldName?: string;
    userName?: string;
    name?: string;
    source?: string;
    type?: ChannelType;
    channelId?: string;
    messageServerId?: UUID;
    userId?: UUID;
    metadata?: Record<string, unknown>;
  }) {
    if (!worldId && messageServerId) {
      worldId = createUniqueUuid(this as IAgentRuntime, messageServerId);
    }
```