# a69475c0:packages_core_src_runtime.ts:3001-3043

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:3001-3043
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
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