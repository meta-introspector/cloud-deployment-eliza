# 5e8c73c1:packages_core_src___tests___runtime.test.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        content: { text: 'test message' },
        createdAt: Date.now(),
      };

      // Empty responses array - no actions to execute
      const responses: Memory[] = [];

      await runtime.processActions(memory, responses);
      const results = runtime.getActionResults(messageId);

      expect(results).toEqual([]);
    });
  });

  // --- Adapter Passthrough Tests ---
  describe('Adapter Passthrough', () => {
    it('createEntity should call adapter.createEntities', async () => {
      const entityData = {
        id: stringToUuid(uuidv4()),
        agentId: agentId,
        names: ['Test Entity'],
        metadata: {},
      };
      await runtime.createEntity(entityData);
      expect(mockDatabaseAdapter.createEntities).toHaveBeenCalledTimes(1);
      expect(mockDatabaseAdapter.createEntities).toHaveBeenCalledWith([entityData]);
    });

    it('getMemoryById should call adapter.getMemoryById', async () => {
      const memoryId = stringToUuid(uuidv4());
      await runtime.getMemoryById(memoryId);
      expect(mockDatabaseAdapter.getMemoryById).toHaveBeenCalledTimes(1);
      expect(mockDatabaseAdapter.getMemoryById).toHaveBeenCalledWith(memoryId);
    });
    // Add more tests for other adapter methods if full coverage is desired
  });

  // --- Event Emitter Tests ---
  describe('Event Emitter (on/emit/off)', () => {
    it('should register and emit events', () => {
      const handler = mock();
      const eventName = 'testEvent';
      const eventData = { info: 'data' };

      runtime.on(eventName, handler);
      runtime.emit(eventName, eventData);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(eventData);
    });

    it('should remove event handler with off', () => {
      const handler = mock();
      const eventName = 'testEvent';

      runtime.on(eventName, handler);
      runtime.off(eventName, handler);
      runtime.emit(eventName, { info: 'data' });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  // --- Tests from original suite ---
  describe('Original Suite Tests', () => {
    // Note: These might need slight adaptation if they relied on Jest specifics
    // or different mock setups.

    // Copied from your original suite:
    describe('model provider management', () => {
      it('should provide access to the configured model provider', () => {
        // In this refactored structure, 'provider' likely refers to the runtime instance itself
        // which acts as the primary interface.
        const provider = runtime; // The runtime instance manages models
        expect(provider).toBeDefined();
        // You might add more specific checks here, e.g., ensuring getModel exists
        expect(runtime.getModel).toBeInstanceOf(Function);
      });
    });

    // Copied from your original suite:
    describe('state management', () => {
      it('should compose state with additional keys', async () => {
        // Use the helper function for consistency
        const message: Memory = createMockMemory(
          'test message',
          stringToUuid('11111111-e89b-12d3-a456-426614174003'), // Use valid UUIDs
          stringToUuid('22222222-e89b-12d3-a456-426614174004'),
          stringToUuid('33333333-e89b-12d3-a456-426614174003'), // Room ID
          agentId
        );

        // Mock provider needed by composeState
        const providerGet = mock().mockResolvedValue({ text: 'provider text' });
        runtime.registerProvider({ name: 'TestProvider', get: providerGet });

        const state = await runtime.composeState(message);
        expect(state).toHaveProperty('values');
        expect(state).toHaveProperty('text');
        expect(state).toHaveProperty('data');
        // Add more specific state checks if needed
        expect(state.text).toContain('provider text'); // Check provider text is included
      });
    });

    // Copied from your original suite:
    describe('action management', () => {
      it('should register an action', () => {
        const action = createMockAction('testAction');
        runtime.registerAction(action);
        expect(runtime.actions).toContain(action);
      });

      it('should allow registering multiple actions', () => {
        const action1 = createMockAction('testAction1');
        const action2 = createMockAction('testAction2');
        runtime.registerAction(action1);
        runtime.registerAction(action2);
        expect(runtime.actions).toContain(action1);
        expect(runtime.actions).toContain(action2);
      });
    });

    describe('model settings from character configuration', () => {
      it('should apply character model settings as defaults and allow overrides', async () => {
        // Create character with model settings
        const characterWithSettings: Character = {
          ...mockCharacter,
          settings: {
            MODEL_MAX_TOKEN: 4096,
            MODEL_TEMPERATURE: 0.5,
            MODEL_FREQ_PENALTY: 0.8,
            MODEL_PRESENCE_PENALTY: 0.9,
            // Test invalid values that should be ignored
            MODEL_INVALID: 'not-a-number',
          },
        };

        // Create runtime with character settings
        const runtimeWithSettings = new AgentRuntime({
          character: characterWithSettings,
          adapter: mockDatabaseAdapter,
        });

        // Mock a model handler to capture params
        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'test response';
        });
```