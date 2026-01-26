# 12812d74:packages_core_src_runtime.ts:1351-1500

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:1351-1500
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```

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
          ? `World for server ${messageServerId}`
          : `World for room ${roomId}`,
      agentId: this.agentId,
      messageServerId: messageServerId,
      metadata,
    });
    await this.ensureRoomExists({
      id: roomId,
      name: name || 'default',
      source: source || 'default',
      type: type || ChannelType.DM,
      channelId,
      messageServerId,
      worldId,
    });
    await this.ensureParticipantInRoom(entityId, roomId);
    await this.ensureParticipantInRoom(this.agentId, roomId);

    this.logger.debug({ src: 'agent', agentId: this.agentId, entityId, channelId: roomId }, 'Entity connected');
  }

  async ensureParticipantInRoom(entityId: UUID, roomId: UUID) {
    // Make sure entity exists in database before adding as participant
    const entity = await this.getEntityById(entityId);

    // If entity is not found but it's not the agent itself, we might still want to proceed
    // This can happen when an entity exists in the database but isn't associated with this agent
    if (!entity && entityId !== this.agentId) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId, entityId },
        'Entity not accessible, attempting to add as participant'
      );
    } else if (!entity && entityId === this.agentId) {
      throw new Error(`Agent entity ${entityId} not found, cannot add as participant.`);
    } else if (!entity) {
      throw new Error(`User entity ${entityId} not found, cannot add as participant.`);
    }
```