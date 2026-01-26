# a69475c0:packages_core_src_runtime.ts:1351-1500

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:1351-1500
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      await this.createRooms(roomObjsToCreate);
    }

    // Step 2: Create all entities
    const entityIds = entities.map((e) => e.id).filter((id): id is UUID => id !== undefined);
    const entityExistsCheck = await this.adapter.getEntitiesByIds(entityIds);
    const entitiesToUpdate = entityExistsCheck?.map((e) => e.id).filter((id): id is UUID => id !== undefined) || [];
    const entitiesToCreate = entities.filter((e) => e.id !== undefined && !entitiesToUpdate.includes(e.id));

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
      const entitiesToCreateWFields: Entity[] = entitiesToCreate.map((e) => ({ ...e, ...ef, metadata: e.metadata || {} }));
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
    const entityIdsInFirstRoomFiltered = entityIdsInFirstRoom.filter((id): id is UUID => id !== undefined);
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
    const names = [name, userName].filter(Boolean) as string[];
    const entityMetadata = {
      [source!]: {
        id: userId,
        name: name,
        userName: userName,
      },
    };
    // First check if the entity exists
    const entity = await this.getEntityById(entityId);

    if (!entity) {
      const success = await this.createEntity({
        id: entityId,
        names,
        metadata: entityMetadata,
        agentId: this.agentId,
      });
      if (success) {
        this.logger.debug(
          { src: 'agent', agentId: this.agentId, entityId, userName: name || userName },
          'Entity created'
        );
      } else {
        throw new Error(`Failed to create entity ${entityId}`);
      }
    } else {
      await this.adapter.updateEntity({
        id: entityId,
        names: [...new Set([...(entity.names || []), ...names])].filter(Boolean) as string[],
        metadata: {
          ...entity.metadata,
          [source!]: {
            ...(entity.metadata?.[source!] && typeof entity.metadata[source!] === 'object'
              ? (entity.metadata[source!] as Record<string, unknown>)
              : {}),
            id: userId,
            name: name,
            userName: userName,
          },
        },
        agentId: this.agentId,
      });
    }
    await this.ensureWorldExists({
      id: worldId,
      name:
        worldName || messageServerId
```