# 12812d74:packages_core_src_runtime.ts:2851-2999

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:2851-2999
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
  }
  async deleteCache(key: string): Promise<boolean> {
    return await this.adapter.deleteCache(key);
  }
  async createTask(task: Task): Promise<UUID> {
    return await this.adapter.createTask(task);
  }
  async getTasks(params: { roomId?: UUID; tags?: string[]; entityId?: UUID }): Promise<Task[]> {
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
    const handlers = this.eventHandlers.get(event)!;
    const index = handlers.indexOf(callback);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }
  emit(event: string, data: unknown): void {
    if (!this.eventHandlers.has(event)) {
      return;
    }
    for (const handler of this.eventHandlers.get(event)!) {
      handler(data);
    }
  }
  async sendControlMessage(params: {
    roomId: UUID;
    action: 'enable_input' | 'disable_input';
    target?: string;
  }): Promise<void> {
    const { roomId, action, target } = params;
    const controlMessage: ControlMessage = {
      type: 'control',
      payload: {
        action,
        target,
      },
      roomId,
    };
    try {
      await this.emitEvent('CONTROL_MESSAGE', {
        runtime: this,
        message: controlMessage,
        source: 'agent',
      });

      this.logger.debug(
        { src: 'agent', agentId: this.agentId, action, channelId: roomId },
        'Control message sent'
      );
    } catch (error: unknown) {
      this.logger.error(
        {
          src: 'agent',
          agentId: this.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Control message failed'
      );
    }
  }
  registerSendHandler(source: string, handler: SendHandlerFunction): void {
    if (this.sendHandlers.has(source)) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId, handlerSource: source },
        'Send handler already registered, overwriting'
      );
    }
    this.sendHandlers.set(source, handler);
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, handlerSource: source },
      'Send handler registered'
    );
  }
  async sendMessageToTarget(target: TargetInfo, content: Content): Promise<void> {
    const handler = this.sendHandlers.get(target.source);
    if (!handler) {
      const errorMsg = `No send handler registered for source: ${target.source}`;
      this.logger.error(
        { src: 'agent', agentId: this.agentId, handlerSource: target.source },
        'Send handler not found'
      );
      throw new Error(errorMsg);
    }
    try {
      await handler(this, target, content);
    } catch (error: unknown) {
      this.logger.error(
        {
          src: 'agent',
          agentId: this.agentId,
          handlerSource: target.source,
          error: error instanceof Error ? error.message : String(error),
        },
        'Send handler failed'
      );
      throw error;
    }
  }
  async getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]> {
    return await this.adapter.getMemoriesByWorldId(params);
  }
  async runMigrations(migrationsPaths?: string[]): Promise<void> {
    if (this.adapter?.runMigrations) {
      await this.adapter.runMigrations(migrationsPaths);
    } else {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId },
        'Database adapter does not support migrations'
      );
    }
  }

  async isReady(): Promise<boolean> {
    if (!this.adapter) {
      throw new Error('Database adapter not registered');
    }
    return await this.adapter.isReady();
  }

  hasElizaOS(): this is IAgentRuntime & { elizaOS: IElizaOS } {
    return this.elizaOS !== undefined;
  }
}
```