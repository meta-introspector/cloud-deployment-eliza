# 12812d74:packages_core_src_runtime.ts:1201-1350

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:1201-1350
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
      }
    }
  }

  getActionResults(messageId: UUID): ActionResult[] {
    const cachedState = this.stateCache?.get(`${messageId}_action_results`);
    return (cachedState?.data?.actionResults as ActionResult[]) || [];
  }

  async evaluate(
    message: Memory,
    state: State,
    didRespond?: boolean,
    callback?: HandlerCallback,
    responses?: Memory[]
  ) {
    const evaluatorPromises = this.evaluators.map(async (evaluator: Evaluator) => {
      if (!evaluator.handler) {
        return null;
      }
      if (!didRespond && !evaluator.alwaysRun) {
        return null;
      }
      const result = await evaluator.validate(this as IAgentRuntime, message, state);
      if (result) {
        return evaluator;
      }
      return null;
    });
    const evaluators = (await Promise.all(evaluatorPromises)).filter(Boolean) as Evaluator[];
    if (evaluators.length === 0) {
      return [];
    }
    state = await this.composeState(message, ['RECENT_MESSAGES', 'EVALUATORS']);
    await Promise.all(
      evaluators.map(async (evaluator) => {
        if (evaluator.handler) {
          await evaluator.handler(this as IAgentRuntime, message, state, {}, callback, responses);
          this.adapter.log({
            entityId: message.entityId,
            roomId: message.roomId,
            type: 'evaluator',
            body: {
              evaluator: evaluator.name,
              messageId: message.id,
              message: message.content.text,
              state,
              runId: this.getCurrentRunId(),
            },
          });
        }
      })
    );
    return evaluators;
  }

  // highly SQL optimized queries
  async ensureConnections(
    entities: Entity[],
    rooms: Room[],
    source: string,
    world: World
  ): Promise<void> {
    // guards
    if (!entities) {
      this.logger.error(
        { src: 'agent', agentId: this.agentId },
        'ensureConnections called without entities'
      );
      return;
    }
    if (!rooms || rooms.length === 0) {
      this.logger.error(
        { src: 'agent', agentId: this.agentId },
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
```