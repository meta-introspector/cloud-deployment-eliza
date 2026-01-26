# a789b1dc:packages_plugin-starter_src___tests___test-utils.ts:1-150

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-starter/src/__tests__/test-utils.ts:1-150
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
import { mock, spyOn } from 'bun:test';
import {
  type IAgentRuntime,
  type Memory,
  type Entity,
  type Room,
  type World,
  type State,
  type Content,
  type UUID,
  type Character,
  type Provider,
  type Action,
  type Evaluator,
  type Plugin,
  type Service,
  type ServiceTypeName,
  type Route,
  type HandlerCallback,
  type SendHandlerFunction,
  type TargetInfo,
  type ModelTypeName,
  type TaskWorker,
  type Component,
  type Relationship,
  ModelType,
  asUUID,
  logger,
} from '@elizaos/core';

/**
 * Creates a UUID for testing
 */
export function createUUID(): UUID {
  return asUUID(crypto.randomUUID());
}

/**
 * Creates a test character
 */
export function createTestCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: createUUID(),
    name: 'Test Character',
    username: 'test-character',
    bio: 'A test character for unit testing',
    system: 'You are a helpful assistant for testing.',
    plugins: [],
    settings: {},
    messageExamples: [],
    topics: [],
    adjectives: [],
    style: { all: [], chat: [], post: [] },
    secrets: {},
    ...overrides,
  };
}

/**
 * Creates a test memory
 */
export function createTestMemory(overrides: Partial<Memory> = {}): Memory {
  const now = Date.now();
  return {
    id: createUUID(),
    agentId: createUUID(),
    entityId: createUUID(),
    roomId: createUUID(),
    content: {
      text: 'Test message',
      source: 'test',
    },
    createdAt: now,
    ...overrides,
  };
}

/**
 * Creates a test state
 */
export function createTestState(overrides: Partial<State> = {}): State {
  return {
    agentId: createUUID(),
    roomId: createUUID(),
    userId: createUUID(),
    bio: 'Test bio',
    lore: 'Test lore',
    userName: 'Test User',
    userBio: 'Test user bio',
    actors: '',
    recentMessages: '',
    recentInteractions: '',
    goals: 'Test goals',
    image: '',
    messageDirections: '',
    values: {},
    data: {},
    text: '',
    ...overrides,
  };
}

/**
 * Helper to create a mock function
 */
function createMockFn<T extends (...args: any[]) => any>(
  implementation?: T
): ReturnType<typeof mock> {
  return mock(implementation || (() => {}));
}

/**
 * Creates a properly typed mock runtime
 */
export function createMockRuntime(overrides: Partial<IAgentRuntime> = {}): IAgentRuntime {
  const agentId = overrides.agentId || createUUID();
  const character = overrides.character || createTestCharacter();

  // Create base runtime object with all required properties
  const mockRuntime: IAgentRuntime = {
    // Properties
    agentId,
    initPromise: Promise.resolve(),
    character,
    providers: [],
    actions: [],
    evaluators: [],
    plugins: [],
    services: new Map<ServiceTypeName, Service[]>(),
    events: new Map(),
    fetch: null,
    routes: [],
    logger: {
      info: mock(() => {}),
      warn: mock(() => {}),
      error: mock(() => {}),
      debug: mock(() => {}),
    },
    db: {},

    // Database methods
    initialize: mock().mockResolvedValue(undefined),
    init: mock().mockResolvedValue(undefined),
    runMigrations: mock().mockResolvedValue(undefined),
    isReady: mock().mockResolvedValue(true),
    close: mock().mockResolvedValue(undefined),
    getConnection: mock().mockResolvedValue({}),

    // Agent methods
    getAgent: mock().mockResolvedValue(null),
```