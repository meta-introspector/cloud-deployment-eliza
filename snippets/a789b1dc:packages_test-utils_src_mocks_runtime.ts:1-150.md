# a789b1dc:packages_test-utils_src_mocks_runtime.ts:1-150

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/test-utils/src/mocks/runtime.ts:1-150
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
/**
 * @fileoverview Mock implementations for IAgentRuntime and related interfaces
 *
 * This module provides comprehensive mock implementations for the core runtime interfaces,
 * designed to support both unit testing and integration testing scenarios.
 */

import type {
  Character,
  IAgentRuntime,
  IDatabaseAdapter,
  Memory,
  State,
  ActionResult,
  UUID,
  Logger,
} from '@elizaos/core';
import { mock } from './mockUtils';

/**
 * Type representing overrides for IAgentRuntime mock creation
 */
export type MockRuntimeOverrides = Partial<IAgentRuntime & IDatabaseAdapter>;

/**
 * Create a comprehensive mock of IAgentRuntime with intelligent defaults
 *
 * This function provides a fully-featured mock that implements both IAgentRuntime
 * and IDatabaseAdapter interfaces, ensuring compatibility with all test scenarios.
 *
 * @param overrides - Partial object to override specific methods or properties
 * @returns Complete mock implementation of IAgentRuntime
 *
 * @deprecated Use real runtime testing instead: import { createTestRuntime } from '@elizaos/core/test-utils'
 *
 * @example Legacy Mock Testing (Deprecated)
 * ```typescript
 * import { createMockRuntime } from '@elizaos/core/test-utils';
 *
 * const mockRuntime = createMockRuntime({
 *   getSetting: () => 'test-api-key',
 *   useModel: () => Promise.resolve('mock response')
 * });
 * ```
 */
export function createMockRuntime(overrides: MockRuntimeOverrides = {}): IAgentRuntime {
  // Mock character with sensible defaults
  const defaultCharacter: Character = {
    id: 'test-character-id' as UUID,
    name: 'Test Character',
    username: 'test_character',
    system: 'You are a helpful test assistant.',
    bio: ['A character designed for testing purposes'],
    messageExamples: [],
    postExamples: [],
    topics: ['testing', 'development'],
    knowledge: [],
    plugins: [],
    settings: {
      model: 'gpt-4',
      secrets: {},
    },
    style: {
      all: ['be helpful', 'be concise'],
      chat: ['respond quickly'],
      post: ['be engaging'],
    },
  };

  // Mock database connection
  const mockDb = {
    execute: mock().mockResolvedValue([]),
    query: mock().mockResolvedValue([]),
    run: mock().mockResolvedValue({ changes: 1 }),
    all: mock().mockResolvedValue([]),
    get: mock().mockResolvedValue(null),
  };

  // Shared state cache reference for methods that read from cache
  const stateCache: Map<string, any> = (overrides.stateCache as Map<string, any>) || new Map();

  // Create base runtime mock
  const baseRuntime: IAgentRuntime = {
    // Core Properties
    agentId: 'test-agent-id' as UUID,
    initPromise: overrides.initPromise || Promise.resolve(),
    character: overrides.character || defaultCharacter,
    messageService: overrides.messageService ?? null,
    providers: overrides.providers || [],
    actions: overrides.actions || [],
    evaluators: overrides.evaluators || [],
    plugins: overrides.plugins || [],
    services: overrides.services || new Map(),
    events: overrides.events || {},
    fetch: overrides.fetch || null,
    routes: overrides.routes || [],
    logger: overrides.logger || {
      level: 'info',
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      fatal: () => {},
      success: () => {},
      progress: () => {},
      log: () => {},
      clear: () => {},
      child: () =>
        ({
          level: 'info',
          trace: () => {},
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
          fatal: () => {},
          success: () => {},
          progress: () => {},
          log: () => {},
          clear: () => {},
          child: () => ({}) as Logger,
        }) as Logger,
    },
    stateCache,

    // Database Properties
    db: overrides.db || mockDb,

    // Core Runtime Methods
    registerPlugin: mock().mockResolvedValue(undefined),
    initialize: mock().mockResolvedValue(undefined),
    getConnection: mock().mockResolvedValue(mockDb),
    getService: mock().mockReturnValue(null),
    getServicesByType: mock().mockReturnValue([]),
    getAllServices: mock().mockReturnValue(new Map()),
    registerService: mock().mockResolvedValue(undefined),
    getServiceLoadPromise: mock().mockResolvedValue(null),
    getRegisteredServiceTypes: mock().mockReturnValue([]),
    hasService: mock().mockReturnValue(false),
    hasElizaOS(): this is IAgentRuntime & { elizaOS: any } {
      return false;
    },
    registerDatabaseAdapter: mock(),
    setSetting: mock(),
    getSetting: mock((key: string) => {
      const defaultSettings: Record<string, any> = {
        TEST_API_KEY: 'test-api-key',
        ...overrides.character?.settings,
      };
```