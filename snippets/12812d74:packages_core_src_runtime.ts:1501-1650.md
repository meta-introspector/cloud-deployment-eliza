# 12812d74:packages_core_src_runtime.ts:1501-1650

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:1501-1650
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
    const participants = await this.adapter.getParticipantsForRoom(roomId);
    if (!participants.includes(entityId)) {
      // Add participant using the ID
      const added = await this.addParticipant(entityId, roomId);

      if (!added) {
        throw new Error(`Failed to add participant ${entityId} to room ${roomId}`);
      }
      if (entityId === this.agentId) {
        this.logger.debug(
          { src: 'agent', agentId: this.agentId, channelId: roomId },
          'Agent linked to room'
        );
      } else {
        this.logger.debug(
          { src: 'agent', agentId: this.agentId, entityId, channelId: roomId },
          'User linked to room'
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
        { src: 'agent', agentId: this.agentId, worldId: id, name, messageServerId },
        'Creating world'
      );
      await this.adapter.createWorld({
        id,
        name,
        agentId: this.agentId,
        messageServerId,
        metadata,
      });
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, worldId: id, messageServerId },
        'World created'
      );
    }
  }

  async ensureRoomExists({
    id,
    name,
    source,
    type,
    channelId,
    messageServerId,
    worldId,
    metadata,
  }: Room) {
    if (!worldId) throw new Error('worldId is required');
    const room = await this.getRoom(id);
    if (!room) {
      await this.createRoom({
        id,
        name,
        agentId: this.agentId,
        source,
        type,
        channelId,
        messageServerId,
        worldId,
        metadata,
      });
      this.logger.debug({ src: 'agent', agentId: this.agentId, channelId: id }, 'Room created');
    }
  }

  async composeState(
    message: Memory,
    includeList: string[] | null = null,
    onlyInclude = false,
    skipCache = false
  ): Promise<State> {
    const filterList = onlyInclude ? includeList : null;
    const emptyObj = {
      values: {},
      data: {},
      text: '',
    } as State;
    const cachedState =
      skipCache || !message.id ? emptyObj : (await this.stateCache.get(message.id)) || emptyObj;
    const providerNames = new Set<string>();
    if (filterList && filterList.length > 0) {
      filterList.forEach((name) => providerNames.add(name));
    } else {
      this.providers
        .filter((p) => !p.private && !p.dynamic)
        .forEach((p) => providerNames.add(p.name));
    }
    if (!filterList && includeList && includeList.length > 0) {
      includeList.forEach((name) => providerNames.add(name));
    }
    const providersToGet = Array.from(
      new Set(this.providers.filter((p) => providerNames.has(p.name)))
    ).sort((a, b) => (a.position || 0) - (b.position || 0));
    const providerData = await Promise.all(
      providersToGet.map(async (provider) => {
        const start = Date.now();
        const result = await provider.get(this as IAgentRuntime, message, cachedState);
        const duration = Date.now() - start;

        // only need to inform if it's taking a long time
        if (duration > 100) {
          this.logger.debug(
            { src: 'agent', agentId: this.agentId, provider: provider.name, duration },
            'Slow provider'
          );
        }
        return {
          ...result,
          providerName: provider.name,
        };
      })
    );
    const currentProviderResults: Record<string, { text?: string; values?: Record<string, unknown>; providerName: string }> = { ...(cachedState.data?.providers as Record<string, { text?: string; values?: Record<string, unknown>; providerName: string }> || {}) };
    for (const freshResult of providerData) {
      currentProviderResults[freshResult.providerName] = freshResult;
    }
    const orderedTexts: string[] = [];
```