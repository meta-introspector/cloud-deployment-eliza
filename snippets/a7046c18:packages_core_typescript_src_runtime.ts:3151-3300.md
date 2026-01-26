# a7046c18:packages_core_typescript_src_runtime.ts:3151-3300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:3151-3300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      return rerankedMemories;
    }
    return memories;
  }
  async rerankMemories(query: string, memories: Memory[]): Promise<Memory[]> {
    const docs = memories.map((memory) => ({
      title: memory.id,
      content: memory.content.text,
    }));
    const bm25 = new BM25(docs);
    const results = bm25.search(query, memories.length);
    return results.map((result) => memories[result.index]);
  }
  async createMemory(
    memory: Memory,
    tableName: string,
    unique?: boolean,
  ): Promise<UUID> {
    if (unique !== undefined) memory.unique = unique;
    return await this.adapter.createMemory(memory, tableName, unique);
  }
  async updateMemory(
    memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata },
  ): Promise<boolean> {
    return await this.adapter.updateMemory(memory);
  }
  async deleteMemory(memoryId: UUID): Promise<void> {
    await this.adapter.deleteMemory(memoryId);
  }
  async deleteManyMemories(memoryIds: UUID[]): Promise<void> {
    await this.adapter.deleteManyMemories(memoryIds);
  }
  async clearAllAgentMemories(): Promise<void> {
    this.logger.info(
      { src: "agent", agentId: this.agentId },
      "Clearing all memories",
    );

    const allMemories = await this.getAllMemories();
    const memoryIds = allMemories
      .map((memory) => memory.id)
      .filter((id): id is UUID => id !== undefined);

    if (memoryIds.length === 0) {
      this.logger.debug(
        { src: "agent", agentId: this.agentId },
        "No memories to delete",
      );
      return;
    }

    await this.adapter.deleteManyMemories(memoryIds);
    this.logger.info(
      { src: "agent", agentId: this.agentId, count: memoryIds.length },
      "Memories cleared",
    );
  }
  async deleteAllMemories(roomId: UUID, tableName: string): Promise<void> {
    await this.adapter.deleteAllMemories(roomId, tableName);
  }
  async countMemories(
    roomId: UUID,
    unique?: boolean,
    tableName?: string,
  ): Promise<number> {
    return await this.adapter.countMemories(roomId, unique, tableName);
  }
  async getLogs(params: {
    entityId?: UUID;
    roomId?: UUID;
    type?: string;
    count?: number;
    offset?: number;
  }): Promise<Log[]> {
    return await this.adapter.getLogs(params);
  }
  async deleteLog(logId: UUID): Promise<void> {
    await this.adapter.deleteLog(logId);
  }
  async createWorld(world: World): Promise<UUID> {
    return await this.adapter.createWorld(world);
  }
  async getWorld(id: UUID): Promise<World | null> {
    return await this.adapter.getWorld(id);
  }
  async removeWorld(worldId: UUID): Promise<void> {
    await this.adapter.removeWorld(worldId);
  }
  async getAllWorlds(): Promise<World[]> {
    return await this.adapter.getAllWorlds();
  }
  async updateWorld(world: World): Promise<void> {
    await this.adapter.updateWorld(world);
  }
  async getRoom(roomId: UUID): Promise<Room | null> {
    const rooms = await this.adapter.getRoomsByIds([roomId]);
    if (!rooms?.length) return null;
    return rooms[0];
  }

  async getRoomsByIds(roomIds: UUID[]): Promise<Room[] | null> {
    return await this.adapter.getRoomsByIds(roomIds);
  }
  async createRoom({
    id,
    name,
    source,
    type,
    channelId,
    messageServerId,
    worldId,
  }: Room): Promise<UUID> {
    if (!worldId) throw new Error("worldId is required");
    const res = await this.adapter.createRooms([
      {
        id,
        name,
        source,
        type,
        channelId,
        messageServerId,
        worldId,
      },
    ]);
    if (!res.length) throw new Error("Failed to create room");
    return res[0];
  }

  async createRooms(rooms: Room[]): Promise<UUID[]> {
    return await this.adapter.createRooms(rooms);
  }

  async deleteRoom(roomId: UUID): Promise<void> {
    await this.adapter.deleteRoom(roomId);
  }
  async deleteRoomsByWorldId(worldId: UUID): Promise<void> {
    await this.adapter.deleteRoomsByWorldId(worldId);
  }
  async updateRoom(room: Room): Promise<void> {
    await this.adapter.updateRoom(room);
  }
  async getRoomsForParticipant(entityId: UUID): Promise<UUID[]> {
    return await this.adapter.getRoomsForParticipant(entityId);
  }
  async getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]> {
    return await this.adapter.getRoomsForParticipants(userIds);
  }

  // deprecate this one
  async getRooms(worldId: UUID): Promise<Room[]> {
```