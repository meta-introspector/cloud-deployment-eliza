# feb2b8d1:packages_core_typescript_src_runtime.ts:3451-3534

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:3451-3534
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
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
      "Send handler registered",
    );
  }
  async sendMessageToTarget(
    target: TargetInfo,
    content: Content,
  ): Promise<void> {
    const handler = this.sendHandlers.get(target.source);
    if (!handler) {
      const errorMsg = `No send handler registered for source: ${target.source}`;
      this.logger.error(
        { src: "agent", agentId: this.agentId, handlerSource: target.source },
        "Send handler not found",
      );
      throw new Error(errorMsg);
    }
    try {
      await handler(this, target, content);
    } catch (error: unknown) {
      this.logger.error(
        {
          src: "agent",
          agentId: this.agentId,
          handlerSource: target.source,
          error: error instanceof Error ? error.message : String(error),
        },
        "Send handler failed",
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
    if (this.adapter && this.adapter.runMigrations) {
      await this.adapter.runMigrations(migrationsPaths);
    } else {
      this.logger.warn(
        { src: "agent", agentId: this.agentId },
        "Database adapter does not support migrations",
      );
    }
  }

  async isReady(): Promise<boolean> {
    if (!this.adapter) {
      throw new Error("Database adapter not registered");
    }
    return await this.adapter.isReady();
  }

  hasElizaOS(): this is IAgentRuntime & { elizaOS: IElizaOS } {
    return this.elizaOS !== undefined;
  }
}
```