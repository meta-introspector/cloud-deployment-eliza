# a7046c18:packages_core_typescript_src___tests___database.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/database.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param {boolean} [_unique] - Flag to indicate if only unique memories should be counted.
   * @param {string} [_tableName] - The name of the table to count memories from.
   * @return {Promise<number>} - A Promise that resolves to the number of memories.
   */
  countMemories(
    _roomId: UUID,
    _unique?: boolean,
    _tableName?: string,
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
  /**
   * Retrieve the room data for a specific room and agent.
   *
   * @param {_roomId} UUID - The unique identifier of the room.
   * @param {_agentId} UUID - The unique identifier of the agent.
   * @returns {Promise<Room | null>} - The room data if found, otherwise null.
   */
  getRoom(_roomId: UUID): Promise<Room | null> {
    throw new Error("Method not implemented.");
  }
  /**
   * Creates a room with the given parameters.
   *
   * @param {Object} _params - The parameters for creating the room.
   * @param {UUID} _params.id - The ID of the room.
   * @param {UUID} _params.agentId - The ID of the agent associated with the room.
   * @param {string} _params.source - The source of the room.
   * @param {ChannelType} _params.type - The type of channel.
   * @param {string} [_params.channelId] - Optional channel ID.
   * @param {string} [_params.serverId] - Optional server ID.
   * @param {UUID} [_params.worldId] - Optional world ID.
   * @returns {Promise<UUID>} - A promise that resolves with the ID of the created room.
   */
  createRoom(_params: {
    id: UUID;
    agentId: UUID;
    source: string;
    type: ChannelType;
    channelId?: string;
    serverId?: string;
    worldId?: UUID;
  }): Promise<UUID> {
    throw new Error("Method not implemented.");
  }
  /**
   * Removes a room with the given ID.
   *
   * @param {_roomId: UUID} _roomId - The ID of the room to remove.
   * @returns {Promise<void>} - A promise that resolves when the room is successfully removed.
   */
  removeRoom(_roomId: UUID): Promise<void> {
    throw new Error("Method not implemented.");
  }
  /**
   * Retrieve a list of room IDs for a given participant.
   * @param {UUID} _entityId - The ID of the participant
   * @returns {Promise<UUID[]>} - A promise that resolves with an array of room IDs
   */
  getRoomsForParticipant(_entityId: UUID): Promise<UUID[]> {
    throw new Error("Method not implemented.");
  }
  /**
   * Retrieves the rooms for the specified participants.
   *
   * @param {UUID[]} _entityIds - An array of UUIDs representing the participants whose rooms need to be retrieved.
   * @returns {Promise<UUID[]>} - A promise that resolves to an array of UUIDs representing the rooms for the specified participants.
   * @throws {Error} - If the method is not implemented.
   */
  getRoomsForParticipants(_entityIds: UUID[]): Promise<UUID[]> {
    throw new Error("Method not implemented.");
  }
  /**
   * Add a participant to a room.
   *
   * @param {UUID} _entityId - The ID of the user to add to the room.
   * @param {UUID} _roomId - The ID of the room to add the user to.
   * @returns {Promise<boolean>} - A promise that resolves to true if the user was successfully added to the room, otherwise false.
   */
  addParticipant(_entityId: UUID, _roomId: UUID): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  /**
   * Remove a participant from a room.
   *
   * @param {_entityId} UUID - The ID of the user to remove from the room.
   * @param {_roomId} UUID - The ID of the room from which to remove the participant.
   * @returns {Promise<boolean>} A promise that resolves to true if the participant was successfully removed, otherwise false.
   */
  removeParticipant(_entityId: UUID, _roomId: UUID): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isRoomParticipant(_roomId: UUID, _entityId: UUID): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getConnection(): Promise<Record<string, unknown>> {
    throw new Error("Method not implemented.");
  }

  getEntitiesByIds(_entityIds: UUID[]): Promise<Entity[]> {
    throw new Error("Method not implemented.");
  }

  createEntities(_entities: Entity[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  updateMemory(_memory: Partial<Memory> & { id: UUID }): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getMemoriesByWorldId(_params: {
    worldId: UUID;
    tableName?: string;
  }): Promise<Memory[]> {
    throw new Error("Method not implemented.");
  }

  getMemoriesByEntities(_params: {
    entityIds: UUID[];
    tableName?: string;
  }): Promise<Memory[]> {
    throw new Error("Method not implemented.");
  }

  searchMemoriesByEmbedding(
    _embedding: number[],
    _params?: {
      tableName?: string;
      roomId?: UUID;
      match_threshold?: number;
      match_count?: number;
      unique?: boolean;
    },
  ): Promise<Memory[]> {
    throw new Error("Method not implemented.");
  }

  deleteEntity(_entityId: UUID): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getRoomsByIds(_roomIds: UUID[]): Promise<Room[]> {
    throw new Error("Method not implemented.");
  }

  getRoomsByWorld(_worldId: UUID): Promise<Room[]> {
    throw new Error("Method not implemented.");
  }
```