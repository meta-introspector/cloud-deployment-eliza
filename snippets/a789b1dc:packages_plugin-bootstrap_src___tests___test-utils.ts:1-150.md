# a789b1dc:packages_plugin-bootstrap_src___tests___test-utils.ts:1-150

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/test-utils.ts:1-150
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
import { mock } from 'bun:test';
import {
  Action,
  Character,
  ChannelType,
  Content,
  Evaluator,
  IDatabaseAdapter,
  IAgentRuntime,
  Memory,
  ModelType,
  Plugin,
  Provider,
  Route,
  Service,
  State,
  UUID,
} from '@elizaos/core';

/**
 * Creates a comprehensive mock of the IAgentRuntime interface with sensible defaults
 * that can be overridden as needed for specific tests.
 *
 * @param overrides - Optional overrides for the default mock methods and properties
 * @returns A mock runtime for testing
 */
export function createMockRuntime(overrides: Partial<MockRuntime> = {}): MockRuntime {
  // Create base mock runtime with defaults
  const mockRuntime: MockRuntime = {
    // Core properties
    agentId: 'test-agent-id' as UUID,
    initPromise: Promise.resolve(),
    character: {
      name: 'Test Agent',
      bio: 'This is a test agent for unit tests',
      tone: 'helpful',
      templates: {
        reflectionTemplate: 'Test reflection template {{recentMessages}}',
        messageHandlerTemplate: 'Test message handler template {{recentMessages}}',
        shouldRespondTemplate: 'Test should respond template {{recentMessages}}',
      },
    } as Character,
    providers: [],
    actions: [],
    evaluators: [],
    plugins: [],
    services: new Map(),
    events: new Map(),
    routes: [],
    logger: {
      debug: mock(),
      warn: mock(),
      error: mock(),
      info: mock(),
    },

    // Core methods
    registerPlugin: mock().mockResolvedValue(undefined),
    initialize: mock().mockResolvedValue(undefined),
    getKnowledge: mock().mockResolvedValue([]),
    addKnowledge: mock().mockResolvedValue(undefined),
    getService: mock().mockReturnValue(null),
    getAllServices: mock().mockReturnValue(new Map()),
    registerService: mock(),
    registerDatabaseAdapter: mock(),
    setSetting: mock(),
    getSetting: mock().mockReturnValue(null),
    getConversationLength: mock().mockReturnValue(10),
    processActions: mock().mockResolvedValue(undefined),
    evaluate: mock().mockResolvedValue([]),
    registerProvider: mock(),
    registerAction: mock(),
    registerEvaluator: mock(),
    ensureConnection: mock().mockResolvedValue(undefined),
    ensureParticipantInRoom: mock().mockResolvedValue(undefined),
    ensureWorldExists: mock().mockResolvedValue(undefined),
    ensureRoomExists: mock().mockResolvedValue(undefined),

    // Common database operations
    db: {},
    init: mock().mockResolvedValue(undefined),
    close: mock().mockResolvedValue(undefined),
    getAgent: mock().mockResolvedValue(null),
    getAgents: mock().mockResolvedValue([]),
    createAgent: mock().mockResolvedValue(true),
    updateAgent: mock().mockResolvedValue(true),
    deleteAgent: mock().mockResolvedValue(true),
    ensureAgentExists: mock().mockResolvedValue(undefined),
    ensureEmbeddingDimension: mock().mockResolvedValue(undefined),
    getEntityById: mock().mockResolvedValue(null),
    getEntitiesForRoom: mock().mockResolvedValue([]),
    createEntity: mock().mockResolvedValue(true),
    updateEntity: mock().mockResolvedValue(undefined),
    getComponent: mock().mockResolvedValue(null),
    getComponents: mock().mockResolvedValue([]),
    createComponent: mock().mockResolvedValue(true),
    updateComponent: mock().mockResolvedValue(undefined),
    deleteComponent: mock().mockResolvedValue(undefined),
    getMemories: mock().mockImplementation((params) => {
      // For facts provider tests
      if (params?.tableName === 'facts' && params?.entityId === 'test-entity-id') {
        return Promise.resolve([
          {
            id: 'memory-1' as UUID,
            entityId: 'entity-1' as UUID,
            agentId: 'agent-1' as UUID,
            roomId: 'room-1' as UUID,
            content: { text: 'User likes chocolate' },
            embedding: [0.1, 0.2, 0.3],
            createdAt: Date.now(),
          },
          {
            id: 'memory-2' as UUID,
            entityId: 'entity-1' as UUID,
            agentId: 'agent-1' as UUID,
            roomId: 'room-1' as UUID,
            content: { text: 'User dislikes spicy food' },
            embedding: [0.2, 0.3, 0.4],
            createdAt: Date.now(),
          },
        ]);
      }
      return Promise.resolve([]);
    }),
    getMemoryById: mock().mockResolvedValue(null),
    getMemoriesByIds: mock().mockResolvedValue([]),

    // Additional methods commonly used in tests
    useModel: mock().mockImplementation((modelType, _params) => {
      if (modelType === ModelType.OBJECT_LARGE) {
        return Promise.resolve({
          thought: 'I should respond in a friendly way',
          message: 'Hello there! How can I help you today?',
        });
      } else if (modelType === ModelType.TEXT_SMALL) {
        return Promise.resolve('yes');
      } else if (modelType === ModelType.TEXT_EMBEDDING) {
        return Promise.resolve([0.1, 0.2, 0.3, 0.4, 0.5]);
      } else if (modelType === ModelType.IMAGE_DESCRIPTION) {
        return Promise.resolve(`<response>
  <title>Test Image</title>
  <description>A test image description</description>
  <text>This is a test image description generated by the mock runtime.</text>
</response>`);
      }
      return Promise.resolve({});
    }),
    composePrompt: mock().mockReturnValue('Composed prompt'),
    composeState: mock().mockResolvedValue({ values: {}, data: {} }),
    createMemory: mock().mockResolvedValue('memory-id' as UUID),
```