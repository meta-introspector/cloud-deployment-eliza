# a7046c18:packages_ts-plugin-starter_src___tests___test-utils.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/test-utils.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { mock, spyOn } from "bun:test";
import {
  asUUID,
  type Character,
  type IAgentRuntime,
  logger,
  type Memory,
  ModelType,
  type ModelTypeName,
  type Service,
  type ServiceTypeName,
  type State,
  type UUID,
} from "@elizaos/core";

/**
 * Creates a UUID for testing
 */
export function createUUID(): UUID {
  return asUUID(crypto.randomUUID());
}

/**
 * Creates a test character
 */
export function createTestCharacter(
  overrides: Partial<Character> = {},
): Character {
  return {
    id: createUUID(),
    name: "Test Character",
    username: "test-character",
    bio: "A test character for unit testing",
    system: "You are a helpful assistant for testing.",
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
      text: "Test message",
      source: "test",
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
    bio: "Test bio",
    lore: "Test lore",
    userName: "Test User",
    userBio: "Test user bio",
    actors: "",
    recentMessages: "",
    recentInteractions: "",
    goals: "Test goals",
    image: "",
    messageDirections: "",
    values: {},
    data: {},
    text: "",
    ...overrides,
  };
}

/**
 * Helper to create a mock function
 */
function _createMockFn<T extends (...args: any[]) => any>(
  implementation?: T,
): ReturnType<typeof mock> {
  return mock(implementation || (() => {}));
}

/**
 * Creates a properly typed mock runtime
 */
export function createMockRuntime(
  overrides: Partial<IAgentRuntime> = {},
): IAgentRuntime {
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
    getAgents: mock().mockResolvedValue([]),
    createAgent: mock().mockResolvedValue(true),
    updateAgent: mock().mockResolvedValue(true),
    deleteAgent: mock().mockResolvedValue(true),

    // Memory methods
    createMemory: mock().mockImplementation(async (memory: Memory) => ({
      ...memory,
      id: memory.id || createUUID(),
    })),
    getMemories: mock().mockResolvedValue([]),
```