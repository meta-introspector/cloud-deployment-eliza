# 5e8c73c1:packages_core_src___tests___database.test.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/database.test.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
    throw new Error('Method not implemented.');
  }
  /**
   * Removes a room with the given ID.
   *
   * @param {_roomId: UUID} _roomId - The ID of the room to remove.
   * @returns {Promise<void>} - A promise that resolves when the room is successfully removed.
   */
  removeRoom(_roomId: UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /**
   * Retrieve a list of room IDs for a given participant.
   * @param {UUID} _entityId - The ID of the participant
   * @returns {Promise<UUID[]>} - A promise that resolves with an array of room IDs
   */
  getRoomsForParticipant(_entityId: UUID): Promise<UUID[]> {
    throw new Error('Method not implemented.');
  }
  /**
   * Retrieves the rooms for the specified participants.
   *
   * @param {UUID[]} _entityIds - An array of UUIDs representing the participants whose rooms need to be retrieved.
   * @returns {Promise<UUID[]>} - A promise that resolves to an array of UUIDs representing the rooms for the specified participants.
   * @throws {Error} - If the method is not implemented.
   */
  getRoomsForParticipants(_entityIds: UUID[]): Promise<UUID[]> {
    throw new Error('Method not implemented.');
  }
  /**
   * Add a participant to a room.
   *
   * @param {UUID} _entityId - The ID of the user to add to the room.
   * @param {UUID} _roomId - The ID of the room to add the user to.
   * @returns {Promise<boolean>} - A promise that resolves to true if the user was successfully added to the room, otherwise false.
   */
  addParticipant(_entityId: UUID, _roomId: UUID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  /**
   * Remove a participant from a room.
   *
   * @param {_entityId} UUID - The ID of the user to remove from the room.
   * @param {_roomId} UUID - The ID of the room from which to remove the participant.
   * @returns {Promise<boolean>} A promise that resolves to true if the participant was successfully removed, otherwise false.
   */
  removeParticipant(_entityId: UUID, _roomId: UUID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isRoomParticipant(_roomId: UUID, _entityId: UUID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getConnection(): Promise<Record<string, unknown>> {
    throw new Error('Method not implemented.');
  }

  getEntitiesByIds(_entityIds: UUID[]): Promise<Entity[]> {
    throw new Error('Method not implemented.');
  }

  createEntities(_entities: Entity[]): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  updateMemory(_memory: Partial<Memory> & { id: UUID }): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getMemoriesByWorldId(_params: { worldId: UUID; tableName?: string }): Promise<Memory[]> {
    throw new Error('Method not implemented.');
  }

  getMemoriesByEntities(_params: { entityIds: UUID[]; tableName?: string }): Promise<Memory[]> {
    throw new Error('Method not implemented.');
  }

  searchMemoriesByEmbedding(
    _embedding: number[],
    _params?: {
      tableName?: string;
      roomId?: UUID;
      match_threshold?: number;
      match_count?: number;
      unique?: boolean;
    }
  ): Promise<Memory[]> {
    throw new Error('Method not implemented.');
  }

  deleteEntity(_entityId: UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getRoomsByIds(_roomIds: UUID[]): Promise<Room[]> {
    throw new Error('Method not implemented.');
  }

  getRoomsByWorld(_worldId: UUID): Promise<Room[]> {
    throw new Error('Method not implemented.');
  }

  createRooms(_rooms: Room[]): Promise<UUID[]> {
    throw new Error('Method not implemented.');
  }

  addParticipantsRoom(_entityIds: UUID[], _roomId: UUID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  deleteRoomsByWorldId(_worldId: UUID): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /**
   * Retrieve a list of participants associated with the specified account user ID.
   *
   * @param {UUID} entityId - The unique identifier of the account user.
   * @returns {Promise<Participant[]>} - A promise that resolves to an array of Participant objects.
   */
  getParticipantsForAccount(entityId: UUID): Promise<Participant[]>;
  /**
   * Retrieves the participants associated with a specific user account.
   *
   * @param {unknown} _entityId - The ID of the user account to retrieve participants for.
   * @returns {Promise<import("../src/types.ts").Participant[]>} A Promise that resolves to an array of participants.
   */
  getParticipantsForAccount(_entityId: unknown): Promise<Participant[]> {
    throw new Error('Method not implemented.');
```