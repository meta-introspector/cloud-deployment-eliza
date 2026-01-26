# 12812d74:packages_core_src___tests___runtime.test.ts:451-600

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/__tests__/runtime.test.ts:451-600
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
    // Add more tests for initialize: existing entity, existing room, knowledge processing etc.
  });

  describe('State Composition', () => {
    it('should call provider get methods', async () => {
      const provider1Get = mock().mockResolvedValue({ text: 'p1_text', values: { p1_val: 1 } });
      const provider2Get = mock().mockResolvedValue({ text: 'p2_text', values: { p2_val: 2 } });
      const provider1: Provider = { name: 'P1', get: provider1Get };
      const provider2: Provider = { name: 'P2', get: provider2Get };

      runtime.registerProvider(provider1);
      runtime.registerProvider(provider2);

      const message = createMockMemory('test message', undefined, undefined, undefined, agentId);
      const state = await runtime.composeState(message);

      expect(provider1Get).toHaveBeenCalledTimes(1);
      // The cached state passed will be the initial empty-ish one
      expect(provider1Get).toHaveBeenCalledWith(runtime, message, {
        values: {},
        data: {},
        text: '',
      });
      expect(provider2Get).toHaveBeenCalledTimes(1);
      expect(provider2Get).toHaveBeenCalledWith(runtime, message, {
        values: {},
        data: {},
        text: '',
      });
      expect(state.text).toContain('p1_text');
      expect(state.text).toContain('p2_text');
      expect(state.values).toHaveProperty('p1_val', 1);
      expect(state.values).toHaveProperty('p2_val', 2);
      // Check combined values includes provider outputs
      expect(state.values).toHaveProperty('providers'); // Check if the combined text is stored
      expect(state.data?.providers?.P1?.values).toEqual({ p1_val: 1 }); // Check provider data cache
      expect(state.data?.providers?.P2?.values).toEqual({ p2_val: 2 });
    });

    it('should filter providers', async () => {
      const provider1Get = mock().mockResolvedValue({ text: 'p1_text' });
      const provider2Get = mock().mockResolvedValue({ text: 'p2_text' });
      const provider1: Provider = { name: 'P1', get: provider1Get };
      const provider2: Provider = { name: 'P2', get: provider2Get };

      runtime.registerProvider(provider1);
      runtime.registerProvider(provider2);

      const message = createMockMemory('test message', undefined, undefined, undefined, agentId);
      const state = await runtime.composeState(message, ['P1'], true); // Filter to only P1

      expect(provider1Get).toHaveBeenCalledTimes(1);
      expect(provider2Get).not.toHaveBeenCalled();
      expect(state.text).toBe('p1_text');
    });

    // Add tests for includeList, caching behavior
  });

  describe('Model Usage', () => {
    it('should call registered model handler', async () => {
      const modelHandler = mock().mockResolvedValue('success');
      const modelType = ModelType.TEXT_LARGE;

      runtime.registerModel(modelType, modelHandler, 'test-provider');

      const params = { prompt: 'test prompt', someOption: true };
      const result = await runtime.useModel(modelType, params);

      expect(modelHandler).toHaveBeenCalledTimes(1);
      // Check that handler was called with runtime and params (no runtime in params)
      expect(modelHandler).toHaveBeenCalledWith(runtime, expect.objectContaining(params));
      expect(result).toEqual('success');
      // Check if log was called (part of useModel logic)
      expect(mockDatabaseAdapter.log).toHaveBeenCalledWith(
        expect.objectContaining({ type: `useModel:${modelType}` })
      );
    });

    it('should throw if model type is not registered', async () => {
      const modelType = 'UNREGISTERED_MODEL' as ModelTypeName;
      const params = { prompt: 'test' };
      await expect(runtime.useModel(modelType, params)).rejects.toThrow(/No handler found/);
    });
  });

  describe('Action Processing', () => {
    let mockActionHandler: any; // Use 'any' or specific function type
    let testAction: Action;
    let message: Memory;
    let responseMemory: Memory;

    beforeEach(() => {
      mockActionHandler = mock().mockResolvedValue(undefined);
      testAction = createMockAction('TestAction');
      testAction.handler = mockActionHandler; // Assign mock handler

      runtime.registerAction(testAction);

      message = createMockMemory('user message', undefined, undefined, undefined, agentId);
      responseMemory = createMockMemory(
        'agent response',
        undefined,
        undefined,
        message.roomId,
        agentId
      ); // Same room
      responseMemory.content.actions = ['TestAction']; // Specify action to run

      // Mock composeState as it's called within processActions
      spyOn(runtime, 'composeState').mockResolvedValue(createMockState('composed state text'));
    });

    it('should find and execute the correct action handler', async () => {
      await runtime.processActions(message, [responseMemory]);

      expect(runtime.composeState).toHaveBeenCalled(); // Verify state was composed
      expect(mockActionHandler).toHaveBeenCalledTimes(1);
      // Check arguments passed to the handler
      expect(mockActionHandler).toHaveBeenCalledWith(
        runtime, // runtime instance
        message, // original message
        expect.objectContaining({
          text: 'composed state text',
          values: {},
          data: {},
        }), // accumulated state
        expect.objectContaining({
          actionContext: expect.objectContaining({
            previousResults: [],
            getPreviousResult: expect.any(Function),
          }),
        }), // options with actionContext
        expect.any(Function), // storage callback function
        [responseMemory] // responses array
      );
      expect(mockDatabaseAdapter.log).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'action',
          body: expect.objectContaining({ action: 'TestAction' }),
        })
      );
    });

    // Add tests for action not found, simile matching, handler errors
    it('should not execute if no action name matches', async () => {
      responseMemory.content.actions = ['NonExistentAction'];
      await runtime.processActions(message, [responseMemory]);
      expect(mockActionHandler).not.toHaveBeenCalled();
      expect(mockDatabaseAdapter.log).not.toHaveBeenCalledWith(
```