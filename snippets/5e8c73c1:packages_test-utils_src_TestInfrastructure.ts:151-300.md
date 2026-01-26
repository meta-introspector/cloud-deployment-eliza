# 5e8c73c1:packages_test-utils_src_TestInfrastructure.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/TestInfrastructure.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      await TestDataBuilder.createEntity(this.runtime, {
        names: [`TestEntity_${this.testId}_${i}`],
        metadata: { testId: this.testId, index: i },
      });
    }

    // Create test memories, messages, relationships...
    // Implementation continues based on test data config
  }

  async teardown(): Promise<void> {
    if (this.runtime) {
      // Clean up test data
      await this.cleanupTestData();

      // Stop runtime
      if (typeof this.runtime.stop === 'function') {
        await this.runtime.stop();
      }
    }

    TestEnvironment.activeEnvironments.delete(this.testId);
  }

  private async cleanupTestData(): Promise<void> {
    if (!this.databaseAdapter) {
      return;
    }

    try {
      // Delete test-specific data based on testId in metadata
      // This requires implementing test data cleanup methods
      console.log(`Cleaning up test data for ${this.testId}`);
    } catch (error) {
      console.warn(`Failed to cleanup test data for ${this.testId}:`, error);
    }
  }

  static async teardownAll(): Promise<void> {
    const teardownPromises = Array.from(TestEnvironment.activeEnvironments.values()).map((env) =>
      env.teardown()
    );

    await Promise.all(teardownPromises);
    TestEnvironment.activeEnvironments.clear();
  }

  get testRuntime(): IAgentRuntime {
    if (!this.runtime) {
      throw new Error(`Test environment ${this.testId} not properly initialized`);
    }
    return this.runtime;
  }

  get testDatabase(): IDatabaseAdapter {
    if (!this.databaseAdapter) {
      throw new Error(`Test database ${this.testId} not properly initialized`);
    }
    return this.databaseAdapter;
  }

  /**
   * Performance monitoring wrapper
   */
  async measurePerformance<T>(
    operation: () => Promise<T>,
    threshold: keyof PerformanceThresholds,
    description: string
  ): Promise<T> {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;

    const expectedThreshold = this.config.performanceThresholds![threshold];
    if (duration > expectedThreshold) {
      console.warn(
        `Performance warning: ${description} took ${duration}ms (threshold: ${expectedThreshold}ms)`
      );
    }

    return result;
  }
}

/**
 * Test data builder for creating realistic test scenarios
 */
export class TestDataBuilder {
  static async createEntity(
    runtime: IAgentRuntime,
    data: {
      names: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<UUID> {
    const entityId = stringToUuid(`entity-${Date.now()}-${Math.random()}`);
    await runtime.createEntity({
      id: entityId,
      names: data.names,
      metadata: data.metadata || {},
      agentId: runtime.agentId,
    });
    return entityId;
  }

  static async createTestConversation(
    runtime: IAgentRuntime,
    participants: UUID[],
    messageCount: number = 5
  ) {
    // Create room
    const roomId = stringToUuid(`room-${Date.now()}-${Math.random()}`);

    // Add participants
    for (const participantId of participants) {
      await runtime.ensureParticipantInRoom(participantId, roomId);
    }

    // Create conversation messages
    const messages: Memory[] = [];
    for (let i = 0; i < messageCount; i++) {
      const message = {
        entityId: participants[i % participants.length],
        roomId,
        content: {
          text: `Test message ${i + 1} in conversation`,
          action: i % 3 === 0 ? 'RESPOND' : undefined,
        },
      };
      messages.push(message);
      await runtime.createMemory(message, 'messages');
    }

    return { roomId, messages };
  }

  static async createTestMemories(runtime: IAgentRuntime, roomId: UUID, count: number = 10) {
    const memories: Memory[] = [];
    for (let i = 0; i < count; i++) {
      const memory = {
        entityId: runtime.agentId,
        roomId,
        content: {
          text: `Test memory ${i + 1}`,
          type: 'fact',
          importance: Math.random(),
        },
        embedding: new Array(1536).fill(0).map(() => Math.random() - 0.5), // Mock embedding
      };
      await runtime.createMemory(memory, 'facts');
```