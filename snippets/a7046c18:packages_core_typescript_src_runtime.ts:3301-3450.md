# a7046c18:packages_core_typescript_src_runtime.ts:3301-3450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:3301-3450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
    this.eventHandlers.get(event)?.push(callback);
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
        { src: "agent", agentId: this.agentId, action, channelId: roomId },
        "Control message sent",
      );
    } catch (error: unknown) {
      this.logger.error(
        {
          src: "agent",
          agentId: this.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        "Control message failed",
      );
    }
  }
  registerSendHandler(source: string, handler: SendHandlerFunction): void {
    if (this.sendHandlers.has(source)) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId, handlerSource: source },
        "Send handler already registered, overwriting",
      );
    }
    this.sendHandlers.set(source, handler);
    this.logger.debug(
      { src: "agent", agentId: this.agentId, handlerSource: source },
```