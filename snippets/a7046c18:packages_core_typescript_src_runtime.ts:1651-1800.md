# a7046c18:packages_core_typescript_src_runtime.ts:1651-1800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:1651-1800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            userName: name || userName,
          },
          "Entity created",
        );
      } else {
        throw new Error(`Failed to create entity ${entityId}`);
      }
    } else {
      await this.adapter.updateEntity({
        id: entityId,
        names: [...new Set([...(entity.names || []), ...names])].filter(
          Boolean,
        ) as string[],
        metadata: {
          ...entity.metadata,
          [source]: {
            ...(entity.metadata?.[source] &&
            typeof entity.metadata[source] === "object"
              ? (entity.metadata[source] as Record<string, unknown>)
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
      name: name || "default",
      source: source || "default",
      type: type || ChannelType.DM,
      channelId,
      messageServerId,
      worldId,
    });
    await this.ensureParticipantInRoom(entityId, roomId);
    await this.ensureParticipantInRoom(this.agentId, roomId);

    this.logger.debug(
      { src: "agent", agentId: this.agentId, entityId, channelId: roomId },
      "Entity connected",
    );
  }

  async ensureParticipantInRoom(entityId: UUID, roomId: UUID) {
    // Make sure entity exists in database before adding as participant
    const entity = await this.getEntityById(entityId);

    // If entity is not found but it's not the agent itself, we might still want to proceed
    // This can happen when an entity exists in the database but isn't associated with this agent
    if (!entity && entityId !== this.agentId) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId, entityId },
        "Entity not accessible, attempting to add as participant",
      );
    } else if (!entity && entityId === this.agentId) {
      throw new Error(
        `Agent entity ${entityId} not found, cannot add as participant.`,
      );
    } else if (!entity) {
      throw new Error(
        `User entity ${entityId} not found, cannot add as participant.`,
      );
    }
    const participants = await this.adapter.getParticipantsForRoom(roomId);
    if (!participants.includes(entityId)) {
      // Add participant using the ID
      const added = await this.addParticipant(entityId, roomId);

      if (!added) {
        throw new Error(
          `Failed to add participant ${entityId} to room ${roomId}`,
        );
      }
      if (entityId === this.agentId) {
        this.logger.debug(
          { src: "agent", agentId: this.agentId, channelId: roomId },
          "Agent linked to room",
        );
      } else {
        this.logger.debug(
          { src: "agent", agentId: this.agentId, entityId, channelId: roomId },
          "User linked to room",
        );
      }
    }
  }

  async removeParticipant(entityId: UUID, roomId: UUID): Promise<boolean> {
    return await this.adapter.removeParticipant(entityId, roomId);
  }

  async getParticipantsForEntity(entityId: UUID): Promise<Participant[]> {
    return await this.adapter.getParticipantsForEntity(entityId);
  }

  async getParticipantsForRoom(roomId: UUID): Promise<UUID[]> {
    return await this.adapter.getParticipantsForRoom(roomId);
  }

  async isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean> {
    return await this.adapter.isRoomParticipant(roomId, entityId);
  }

  async addParticipant(entityId: UUID, roomId: UUID): Promise<boolean> {
    return await this.adapter.addParticipantsRoom([entityId], roomId);
  }

  async addParticipantsRoom(entityIds: UUID[], roomId: UUID): Promise<boolean> {
    return await this.adapter.addParticipantsRoom(entityIds, roomId);
  }

  /**
   * Ensure the existence of a world.
   */
  async ensureWorldExists({ id, name, messageServerId, metadata }: World) {
    const world = await this.getWorld(id);
    if (!world) {
      this.logger.debug(
        {
          src: "agent",
          agentId: this.agentId,
          worldId: id,
          name,
          messageServerId,
        },
        "Creating world",
      );
      await this.adapter.createWorld({
        id,
        name,
        agentId: this.agentId,
        messageServerId,
        metadata,
      });
      this.logger.debug(
        { src: "agent", agentId: this.agentId, worldId: id, messageServerId },
        "World created",
```