# 5e8c73c1:packages_cli_src_commands_scenario_src_MockEngine.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/MockEngine.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { IAgentRuntime, Service } from '@elizaos/core';
import { Scenario } from './schema';
// @ts-ignore - lodash types not available
import _ from 'lodash';

type MockDefinition = NonNullable<NonNullable<Scenario['setup']>['mocks']>[0];

interface MockExecutionHistory {
  service: string;
  method: string;
  args: unknown[];
  matchedMock: MockDefinition;
  timestamp: Date;
  executionTime: number;
}

export class MockEngine {
  private originalGetService: IAgentRuntime['getService'];
  private mockRegistry: Map<string, MockDefinition[]> = new Map();
  private mockHistory: MockExecutionHistory[] = [];
  private logger: {
    info: (msg: string) => void;
    debug: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };

  constructor(private runtime: IAgentRuntime) {
    this.originalGetService = this.runtime.getService.bind(this.runtime);
    this.logger = runtime.logger || console;
  }

  public applyMocks(mocks: MockDefinition[] = []) {
    if (mocks.length === 0) return;

    // Build mock registry for efficient lookup
    this.mockRegistry.clear();
    for (const mock of mocks) {
      const key = `${mock.service}.${mock.method}`;
      if (!this.mockRegistry.has(key)) {
        this.mockRegistry.set(key, []);
      }
      this.mockRegistry.get(key)!.push(mock);
    }

    // Replace the original getService with our mocked version
    this.runtime.getService = <T extends Service = Service>(name: string): T | null => {
      const originalService = this.originalGetService<T>(name);

      if (!originalService) {
        return null;
      }

      // Return a proxy for the service that intercepts all method calls
      // The Proxy preserves the service interface while intercepting method calls
      const proxiedService = new Proxy(originalService as object, {
        get: (target, prop: string, receiver) => {
          const key = `${name}.${prop}`;

          if (!this.mockRegistry.has(key)) {
            // No mock for this method, return the original
            return Reflect.get(target, prop, receiver);
          }

          // Return a new function that will perform the mock logic
          return async (...args: unknown[]) => {
            const potentialMocks = this.mockRegistry.get(key)!;

            // Find the best matching mock using enhanced matching strategies
            const matchedMock = await this.findBestMatchingMock(potentialMocks, args);

            if (matchedMock) {
              const startTime = Date.now();
              const result = await this.executeMock(matchedMock, args);
              const executionTime = Date.now() - startTime;

              // Record mock execution
              this.recordMockExecution(key, args, matchedMock, executionTime);

              return result;
            }

            // No matching mock found, call the original method
            return Reflect.get(target, prop, receiver)(...args);
          };
        },
      });
      // Type assertion: Proxy preserves the service interface
      return proxiedService as T;
    };
  }

  public revertMocks() {
    // Restore the original getService method to clean up
    this.runtime.getService = this.originalGetService;
    this.mockRegistry.clear();
  }

  public getMockRegistry() {
    return this.mockRegistry;
  }

  /**
   * Find the best matching mock using enhanced matching strategies
   */
  private async findBestMatchingMock(
    mocks: MockDefinition[],
    args: unknown[]
  ): Promise<MockDefinition | null> {
    // Sort mocks by specificity (more specific conditions first)
    const sortedMocks = this.sortMocksBySpecificity(mocks);

    for (const mock of sortedMocks) {
      if (await this.matchesCondition(mock, args)) {
        return mock;
      }
    }

    return null;
  }

  /**
   * Execute a mock with enhanced features
   */
  private async executeMock(mock: MockDefinition, args: unknown[]): Promise<unknown> {
    // Handle metadata (delay, probability)
    if (mock.metadata?.delay) {
      await new Promise((resolve) => setTimeout(resolve, mock.metadata!.delay));
    }

    if (mock.metadata?.probability && Math.random() < mock.metadata.probability) {
      throw new Error('Random mock failure');
    }

    // Handle error simulation
    if (mock.error) {
      const error = new Error(`${mock.error.code}: ${mock.error.message}`);
      (error as Error & { status?: number }).status = mock.error.status;
      throw error;
    }

    // Handle dynamic response template (SECURITY FIX: No more arbitrary code execution)
    if (mock.responseFn) {
      const input = this.extractInputFromArgs(args);
      const context = this.buildRequestContext(args);
      return this.parseResponseTemplate(mock.responseFn, { args, input, context });
    }

    // Return static response
    return mock.response;
```