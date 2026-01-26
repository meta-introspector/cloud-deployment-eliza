# a7046c18:packages_core_typescript_src_database.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/database.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

  /**
   * Removes multiple memories from the database in a single batch operation.
   * @param memoryIds An array of UUIDs of the memories to remove.
   * @returns A Promise that resolves when all memories have been removed.
   */
  abstract deleteManyMemories(memoryIds: UUID[]): Promise<void>;

  /**
   * Removes all memories associated with a specific room.
   * @param roomId The UUID of the room whose memories should be removed.
   * @param tableName The table from which the memories should be removed.
   * @returns A Promise that resolves when all memories have been removed.
   */
  abstract deleteAllMemories(roomId: UUID, tableName: string): Promise<void>;

  /**
   * Counts the number of memories in a specific room.
   * @param roomId The UUID of the room for which to count memories.
   * @param unique Specifies whether to count only unique memories.
   * @param tableName Optional table name to count memories from.
   * @returns A Promise that resolves to the number of memories.
   */
  abstract countMemories(
    roomId: UUID,
    unique?: boolean,
    tableName?: string,
  ): Promise<number>;

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
  abstract addParticipantsRoom(
    entityIds: UUID[],
    roomId: UUID,
  ): Promise<boolean>;

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
```