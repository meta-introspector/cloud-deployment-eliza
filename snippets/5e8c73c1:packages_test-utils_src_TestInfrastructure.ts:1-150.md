# 5e8c73c1:packages_test-utils_src_TestInfrastructure.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/TestInfrastructure.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type {
  IAgentRuntime,
  IDatabaseAdapter,
  UUID,
  Character,
  Memory,
  AgentRuntime,
} from '@elizaos/core';
import { createTestRuntime } from './realRuntime';
import { stringToUuid } from '@elizaos/core';
import { createUniqueUuid as _createUniqueUuid } from '@elizaos/core';

export interface TestEnvironmentConfig {
  /** Test isolation level */
  isolation: 'unit' | 'integration' | 'e2e';
  /** Use real database vs in-memory */
  useRealDatabase: boolean;
  /** Performance thresholds */
  performanceThresholds?: PerformanceThresholds;
  /** Test data configuration */
  testData?: TestDataConfig;
}

export interface PerformanceThresholds {
  actionExecution: number; // ms
  memoryRetrieval: number; // ms
  databaseQuery: number; // ms
  modelInference: number; // ms
}

export interface TestDataConfig {
  entities: number;
  memories: number;
  messages: number;
  relationships: number;
}

export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  actionExecution: 5000,
  memoryRetrieval: 1000,
  databaseQuery: 500,
  modelInference: 10000,
};

export const DEFAULT_TEST_DATA: TestDataConfig = {
  entities: 5,
  memories: 10,
  messages: 20,
  relationships: 3,
};

/**
 * Test environment manager - ensures proper setup/teardown
 */
export class TestEnvironment {
  private static activeEnvironments = new Map<string, TestEnvironment>();
  private runtime: IAgentRuntime | null = null;
  private databaseAdapter: IDatabaseAdapter | null = null;
  private testId: string;
  private config: TestEnvironmentConfig;

  constructor(testId: string, config: TestEnvironmentConfig) {
    this.testId = testId;
    this.config = config;
  }

  static async create(
    testId: string,
    config: Partial<TestEnvironmentConfig> = {}
  ): Promise<TestEnvironment> {
    const fullConfig: TestEnvironmentConfig = {
      isolation: 'integration',
      useRealDatabase: true,
      performanceThresholds: DEFAULT_PERFORMANCE_THRESHOLDS,
      testData: DEFAULT_TEST_DATA,
      ...config,
    };

    const env = new TestEnvironment(testId, fullConfig);
    await env.setup();

    TestEnvironment.activeEnvironments.set(testId, env);
    return env;
  }

  private async setup(): Promise<void> {
    // Force real database for integration tests
    if (this.config.useRealDatabase) {
      process.env.FORCE_MOCK_DB = 'false';
    }

    // Create runtime with isolated test character
    const testCharacter = this.createTestCharacter();
    const runtimeResult = await createTestRuntime({
      character: testCharacter,
      plugins: [],
      apiKeys: {},
      isolated: true,
    });
    this.runtime = runtimeResult.runtime;
    // AgentRuntime has a public adapter property
    this.databaseAdapter = (this.runtime as AgentRuntime).adapter;

    // Ensure database adapter is available
    if (!this.databaseAdapter) {
      throw new Error(`Database adapter not available in runtime for test ${this.testId}`);
    }

    // Verify we have a real database adapter
    if (this.config.useRealDatabase && this.databaseAdapter.constructor.name.includes('Mock')) {
      throw new Error(
        `Test ${this.testId} requires real database but got mock adapter: ${this.databaseAdapter.constructor.name}`
      );
    }

    // Seed test data if specified
    if (this.config.testData) {
      await this.seedTestData();
    }
  }

  private createTestCharacter(): Character {
    return {
      name: `TestAgent_${this.testId}`,
      bio: `Test agent for ${this.testId}`,
      system: 'You are a test agent for ElizaOS integration testing.',
      messageExamples: [],
      knowledge: [],
      plugins: [],
      settings: {
        testMode: true,
        testId: this.testId,
      },
    };
  }

  private async seedTestData(): Promise<void> {
    if (!this.runtime || !this.config.testData) {
      return;
    }

    const {
      entities,
      memories: _memories,
      messages: _messages,
      relationships: _relationships,
    } = this.config.testData;

    // Create test entities
    for (let i = 0; i < entities; i++) {
```