# a789b1dc:packages_plugin-bootstrap_src___tests___test-utils.ts:301-450

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/test-utils.ts:301-450
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    stateCache: {
      get: mock().mockReturnValue(null),
      set: mock().mockReturnValue(undefined),
    },
  };

  // Merge with overrides
  return { ...mockRuntime, ...overrides };
}

/**
 * Creates a mock Memory object for testing
 *
 * @param overrides - Optional overrides for the default memory properties
 * @returns A mock memory object
 */
export function createMockMemory(overrides: Partial<Memory> = {}): Partial<Memory> {
  return {
    id: 'test-message-id' as UUID,
    roomId: 'test-room-id' as UUID,
    entityId: 'test-entity-id' as UUID,
    agentId: 'test-agent-id' as UUID,
    content: {
      text: 'Test message',
      channelType: ChannelType.GROUP,
    } as Content,
    createdAt: Date.now(),
    ...overrides,
  };
}

/**
 * Creates a mock State object for testing
 *
 * @param overrides - Optional overrides for the default state properties
 * @returns A mock state object
 */
export function createMockState(overrides: Partial<State> = {}): Partial<State> {
  return {
    values: {
      agentName: 'Test Agent',
      recentMessages: 'User: Test message',
      ...overrides.values,
    },
    data: {
      room: {
        id: 'test-room-id',
        type: ChannelType.GROUP,
        worldId: 'test-world-id',
        serverId: 'test-server-id',
      },
      ...overrides.data,
    },
    ...overrides,
  };
}

/**
 * Creates a mock Service object for testing
 *
 * @param overrides - Optional overrides for the default service properties
 * @returns A mock service object
 */
export function createMockService(overrides: Partial<Record<string, any>> = {}): any {
  return {
    name: 'mock-service',
    type: 'mock',
    execute: mock().mockResolvedValue({}),
    init: mock().mockResolvedValue({}),
    ...overrides,
  };
}

/**
 * Creates a standardized setup for action tests with consistent mock objects
 * This replaces the setupActionTest function in actions.test.ts
 *
 * @param overrides - Optional overrides for default mock implementations
 * @returns An object containing mockRuntime, mockMessage, mockState, and callbackFn
 */
export function setupActionTest(options?: {
  runtimeOverrides?: Partial<MockRuntime>;
  messageOverrides?: Partial<Memory>;
  stateOverrides?: Partial<State>;
}) {
  const mockRuntime = createMockRuntime(options?.runtimeOverrides);
  const mockMessage = createMockMemory(options?.messageOverrides);
  const mockState = createMockState(options?.stateOverrides);
  const callbackFn = mock().mockResolvedValue([] as Memory[]); // Explicitly type the return value

  return {
    mockRuntime,
    mockMessage,
    mockState,
    callbackFn,
  };
}

/**
 * Type definition for the mock runtime to ensure type safety in tests
 */
export type MockRuntime = Partial<IAgentRuntime & IDatabaseAdapter> & {
  agentId: UUID;
  initPromise: Promise<void>;
  character: Character;
  providers: Provider[];
  actions: Action[];
  evaluators: Evaluator[];
  plugins: Plugin[];
  services: Map<string, Service>;
  events: Map<string, ((params: any) => Promise<void>)[]>;
  routes: Route[];
  logger: {
    debug: ReturnType<typeof mock>;
    warn: ReturnType<typeof mock>;
    error: ReturnType<typeof mock>;
    info: ReturnType<typeof mock>;
  };

  // Additional properties and methods commonly used in tests
  useModel: ReturnType<typeof mock>;
  getModel: ReturnType<typeof mock>;
  composePrompt: ReturnType<typeof mock>;
  composeState: ReturnType<typeof mock>;
  createMemory: ReturnType<typeof mock>;
  getRoom: ReturnType<typeof mock>;
  getRooms: ReturnType<typeof mock>;
  getRoomsByIds: ReturnType<typeof mock>;
  getWorld: ReturnType<typeof mock>;
  addEmbeddingToMemory: ReturnType<typeof mock>;
  createRelationship: ReturnType<typeof mock>;
  updateRelationship: ReturnType<typeof mock>;
  getRelationships: ReturnType<typeof mock>;
  addRelationship: ReturnType<typeof mock>;
  getTasks: ReturnType<typeof mock>;
  getTasksByName: ReturnType<typeof mock>;
  createTask: ReturnType<typeof mock>;
  updateTasks: ReturnType<typeof mock>;
  deleteTasks: ReturnType<typeof mock>;
  deleteTask: ReturnType<typeof mock>;
  emitEvent: ReturnType<typeof mock>;
  registerEvent: ReturnType<typeof mock>;
  getCache: ReturnType<typeof mock>;
  setCache: ReturnType<typeof mock>;

  // Knowledge methods
  getKnowledge: ReturnType<typeof mock>;
  addKnowledge: ReturnType<typeof mock>;

  // Task-related methods
```