# 12812d74:packages_core_src___tests___runtime.test.ts:151-300

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/__tests__/runtime.test.ts:151-300
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
  entityId: entityId ?? stringToUuid(uuidv4()),
  agentId: agentId, // Pass agentId if needed
  roomId: roomId ?? stringToUuid(uuidv4()),
  content: { text }, // Assuming simple text content
  createdAt: Date.now(),
  metadata: { type: MemoryType.MESSAGE }, // Simple metadata
});

// Mock State creator
const createMockState = (text = '', values = {}, data = {}): State => ({
  values,
  data,
  text,
});

// Mock Character
const mockCharacter: Character = {
  id: stringToUuid(uuidv4()),
  name: 'Test Character',
  plugins: ['@elizaos/plugin-sql'],
  username: 'test',
  bio: ['Test bio'],
  messageExamples: [], // Ensure required fields are present
  postExamples: [],
  topics: [],
  adjectives: [],
  style: {
    all: [],
    chat: [],
    post: [],
  },
  // Add other fields if your runtime logic depends on them
};

// --- Test Suite ---

describe('AgentRuntime (Non-Instrumented Baseline)', () => {
  let runtime: AgentRuntime;
  let agentId: UUID;

  beforeEach(() => {
    mock.restore(); // Bun:test equivalent of clearAllMocks

    // Reset all mock call counts manually but keep return values
    Object.values(mockDatabaseAdapter).forEach((mockFn) => {
      if (mockFn && typeof mockFn.mockClear === 'function') {
        mockFn.mockClear();
      }
    });

    // Reset readiness state between tests
    adapterReady = false;

    agentId = mockCharacter.id!; // Use character's ID

    // Instantiate runtime correctly, passing adapter in options object
    runtime = new AgentRuntime({
      character: mockCharacter,
      agentId: agentId,
      adapter: mockDatabaseAdapter, // Correct way to pass adapter
      // No plugins passed here by default, tests can pass them if needed
    });
  });

  it('should construct without errors', () => {
    expect(runtime).toBeInstanceOf(AgentRuntime);
    expect(runtime.agentId).toEqual(agentId);
    expect(runtime.character).toEqual(mockCharacter);
    expect(runtime.adapter).toBe(mockDatabaseAdapter);
  });

  it('should register database adapter via constructor', () => {
    // This is implicitly tested by the constructor test above
    expect(runtime.adapter).toBeDefined();
    expect(runtime.adapter).toEqual(mockDatabaseAdapter);
  });

  describe('Plugin Registration', () => {
    it('should register a simple plugin', async () => {
      const mockPlugin: Plugin = { name: 'TestPlugin', description: 'A test plugin' };
      await runtime.registerPlugin(mockPlugin);
      console.log('runtime.plugins', runtime.plugins);
      // Check if the plugin is added to the internal list
      expect(runtime.plugins.some((p) => p.name === 'TestPlugin')).toBe(true);
    });

    it('should call plugin init function', async () => {
      const initMock = mock().mockResolvedValue(undefined);
      const mockPlugin: Plugin = {
        name: 'InitPlugin',
        description: 'Plugin with init',
        init: initMock,
      };
      await runtime.registerPlugin(mockPlugin);
      expect(initMock).toHaveBeenCalledTimes(1);
      expect(initMock).toHaveBeenCalledWith(expect.anything(), runtime); // Check if called with config and runtime
    });

    it('should register plugin features (actions, providers, models) when initialized', async () => {
      const actionHandler = mock();
      const providerGet = mock().mockResolvedValue({ text: 'provider_text' });
      const modelHandler = mock().mockResolvedValue('model_result');

      const mockPlugin: Plugin = {
        name: 'FeaturesPlugin',
        description: 'Plugin with features',
        actions: [
          {
            name: 'TestAction',
            description: 'Test action',
            handler: actionHandler,
            validate: async () => true,
          },
        ],
        providers: [{ name: 'TestProvider', get: providerGet }],
        models: { [ModelType.TEXT_SMALL]: modelHandler },
      };

      // Re-create runtime passing plugin in constructor
      runtime = new AgentRuntime({
        character: mockCharacter,
        agentId: agentId,
        adapter: mockDatabaseAdapter,
        plugins: [mockPlugin], // Pass plugin during construction
      });

      // Mock adapter calls needed for initialize
      const ensureAgentExistsSpy = spyOn(
        AgentRuntime.prototype,
        'ensureAgentExists'
      ).mockResolvedValue({
        ...mockCharacter,
        id: agentId, // ensureAgentExists should return the agent
        createdAt: Date.now(),
        updatedAt: Date.now(),
        enabled: true,
      });

      (mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<IDatabaseAdapter['getEntitiesByIds']>).mockResolvedValue([
        {
          id: agentId,
          agentId: agentId,
          names: [mockCharacter.name],
          metadata: {},
        },
      ]);
      (mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<IDatabaseAdapter['getEntitiesByIds']>).mockResolvedValue([
        {
          id: agentId,
          agentId: agentId,
```