# 5e8c73c1:packages_core_src_database.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/database.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
   * Counts the number of memories in a specific room.
   * @param roomId The UUID of the room for which to count memories.
   * @param unique Specifies whether to count only unique memories.
   * @param tableName Optional table name to count memories from.
   * @returns A Promise that resolves to the number of memories.
   */
  abstract countMemories(roomId: UUID, unique?: boolean, tableName?: string): Promise<number>;

  /**
   * Retrieves a world by its ID.
   * @param id The UUID of the world to retrieve.
   * @returns A Promise that resolves to the World object or null if not found.
   */
  abstract getWorld(id: UUID): Promise<World | null>;

  /**
   * Retrieves all worlds for an agent.
   * @returns A Promise that resolves to an array of World objects.
   */
  abstract getAllWorlds(): Promise<World[]>;

  /**
   * Creates a new world in the database.
   * @param world The world object to create.
   * @returns A Promise that resolves to the UUID of the created world.
   */
  abstract createWorld(world: World): Promise<UUID>;

  /**
   * Updates an existing world in the database.
   * @param world The world object with updated properties.
   * @returns A Promise that resolves when the world has been updated.
   */
  abstract updateWorld(world: World): Promise<void>;

  /**
   * Removes a specific world from the database.
   * @param id The UUID of the world to remove.
   * @returns A Promise that resolves when the world has been removed.
   */
  abstract removeWorld(id: UUID): Promise<void>;

  /**
   * Retrieves the room ID for a given room, if it exists.
   * @param roomIds The UUIDs of the rooms to retrieve.
   * @returns A Promise that resolves to the room ID or null if not found.
   */
  abstract getRoomsByIds(roomIds: UUID[]): Promise<Room[] | null>;

  /**
   * Retrieves all rooms for a given world.
   * @param worldId The UUID of the world to retrieve rooms for.
   * @returns A Promise that resolves to an array of Room objects.
   */
  abstract getRoomsByWorld(worldId: UUID): Promise<Room[]>;

  /**
   * Creates new rooms in the database.
   * @param rooms Array of Room objects to create.
   * @returns A Promise that resolves to the UUIDs of the created rooms.
   */
  abstract createRooms(rooms: Room[]): Promise<UUID[]>;

  /**
   * Updates a specific room in the database.
   * @param room The room object with updated properties.
   * @returns A Promise that resolves when the room has been updated.
   */
  abstract updateRoom(room: Room): Promise<void>;

  /**
   * Removes a specific room from the database.
   * @param roomId The UUID of the room to remove.
   * @returns A Promise that resolves when the room has been removed.
   */
  abstract deleteRoom(roomId: UUID): Promise<void>;

  /**
   * Retrieves room IDs for which a specific user is a participant.
   * @param entityId The UUID of the user.
   * @returns A Promise that resolves to an array of room IDs.
   */
  abstract getRoomsForParticipant(entityId: UUID): Promise<UUID[]>;

  /**
   * Retrieves room IDs for which specific users are participants.
   * @param userIds An array of UUIDs of the users.
   * @returns A Promise that resolves to an array of room IDs.
   */
  abstract getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]>;

  /**
   * Adds users as a participant to a specific room.
   * @param entityIds The UUIDs of the users to add as a participant.
   * @param roomId The UUID of the room to which the user will be added.
   * @returns A Promise that resolves to a boolean indicating success or failure.
   */
  abstract addParticipantsRoom(entityIds: UUID[], roomId: UUID): Promise<boolean>;

  /**
   * Removes a user as a participant from a specific room.
   * @param entityId The UUID of the user to remove as a participant.
   * @param roomId The UUID of the room from which the user will be removed.
   * @returns A Promise that resolves to a boolean indicating success or failure.
   */
  abstract removeParticipant(entityId: UUID, roomId: UUID): Promise<boolean>;

  /**
   * Retrieves participants associated with a specific account.
   * @param entityId The UUID of the account.
   * @returns A Promise that resolves to an array of Participant objects.
   */
  abstract getParticipantsForEntity(entityId: UUID): Promise<Participant[]>;

  /**
   * Retrieves participants for a specific room.
   * @param roomId The UUID of the room for which to retrieve participants.
   * @returns A Promise that resolves to an array of UUIDs representing the participants.
   */
  abstract getParticipantsForRoom(roomId: UUID): Promise<UUID[]>;

  /**
   * Check if an entity is a participant in a specific room.
   * More efficient than getParticipantsForRoom when only checking membership.
   * @param roomId The UUID of the room.
   * @param entityId The UUID of the entity to check.
   * @returns A Promise that resolves to a boolean indicating if the entity is a participant.
   */
  abstract isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean>;

  abstract getParticipantUserState(
    roomId: UUID,
    entityId: UUID
  ): Promise<'FOLLOWED' | 'MUTED' | null>;

  abstract setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: 'FOLLOWED' | 'MUTED' | null
  ): Promise<void>;

  /**
   * Creates a new relationship between two users.
   * @param params Object containing the relationship details including entity IDs, agent ID, optional tags and metadata
   * @returns A Promise that resolves to a boolean indicating success or failure of the creation.
   */
  abstract createRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
```