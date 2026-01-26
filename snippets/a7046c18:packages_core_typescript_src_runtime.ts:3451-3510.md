# a7046c18:packages_core_typescript_src_runtime.ts:3451-3510

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:3451-3510
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
    if (this.adapter?.runMigrations) {
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