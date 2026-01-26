# feb2b8d1:packages_core_typescript_src_runtime.ts:3301-3450

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:3301-3450
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
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
    return await this.adapter.getRoomsByWorld(worldId);
  }

  async getRoomsByWorld(worldId: UUID): Promise<Room[]> {
    return await this.adapter.getRoomsByWorld(worldId);
  }
  async getParticipantUserState(
    roomId: UUID,
    entityId: UUID,
  ): Promise<"FOLLOWED" | "MUTED" | null> {
    return await this.adapter.getParticipantUserState(roomId, entityId);
  }
  async setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: "FOLLOWED" | "MUTED" | null,
  ): Promise<void> {
    await this.adapter.setParticipantUserState(roomId, entityId, state);
  }
  async createRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
    metadata?: { [key: string]: unknown };
  }): Promise<boolean> {
    return await this.adapter.createRelationship(params);
  }
  async updateRelationship(relationship: Relationship): Promise<void> {
    await this.adapter.updateRelationship(relationship);
  }
  async getRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
  }): Promise<Relationship | null> {
    return await this.adapter.getRelationship(params);
  }
  async getRelationships(params: {
    entityId: UUID;
    tags?: string[];
  }): Promise<Relationship[]> {
    return await this.adapter.getRelationships(params);
  }
  async getCache<T>(key: string): Promise<T | undefined> {
    return await this.adapter.getCache<T>(key);
  }
  async setCache<T>(key: string, value: T): Promise<boolean> {
    return await this.adapter.setCache<T>(key, value);
  }
  async deleteCache(key: string): Promise<boolean> {
    return await this.adapter.deleteCache(key);
  }
  async createTask(task: Task): Promise<UUID> {
    return await this.adapter.createTask(task);
  }
  async getTasks(params: {
    roomId?: UUID;
    tags?: string[];
    entityId?: UUID;
  }): Promise<Task[]> {
    return await this.adapter.getTasks(params);
  }
  async getTask(id: UUID): Promise<Task | null> {
    return await this.adapter.getTask(id);
  }
  async getTasksByName(name: string): Promise<Task[]> {
    return await this.adapter.getTasksByName(name);
  }
  async updateTask(id: UUID, task: Partial<Task>): Promise<void> {
    await this.adapter.updateTask(id, task);
  }
  async deleteTask(id: UUID): Promise<void> {
    await this.adapter.deleteTask(id);
  }
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.push(callback);
    }
  }
  off(event: string, callback: (data: unknown) => void): void {
    if (!this.eventHandlers.has(event)) {
      return;
    }
    const handlers = this.eventHandlers.get(event);
    if (!handlers) {
      return;
    }
    const index = handlers.indexOf(callback);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }
  emit(event: string, data: unknown): void {
    if (!this.eventHandlers.has(event)) {
      return;
    }
    const handlers = this.eventHandlers.get(event);
    if (!handlers) {
      return;
    }
    for (const handler of handlers) {
      handler(data);
    }
  }
  async sendControlMessage(params: {
    roomId: UUID;
    action: "enable_input" | "disable_input";
    target?: string;
  }): Promise<void> {
    const { roomId, action, target } = params;
    const controlMessage: ControlMessage = {
      type: "control",
      payload: {
        action,
        target,
      },
      roomId,
    };
    try {
      await this.emitEvent("CONTROL_MESSAGE", {
        runtime: this,
        message: controlMessage,
        source: "agent",
      });

      this.logger.debug(
```