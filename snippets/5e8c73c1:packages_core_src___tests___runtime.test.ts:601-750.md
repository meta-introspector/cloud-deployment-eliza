# 5e8c73c1:packages_core_src___tests___runtime.test.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
        expect.objectContaining({ type: 'action' })
      );
    });

    it('should prioritize exact action name matches over fuzzy matches', async () => {
      // Create two actions where one name is a substring of another
      const replyHandler = mock().mockResolvedValue(undefined);
      const replyWithImageHandler = mock().mockResolvedValue(undefined);

      const replyAction: Action = {
        name: 'REPLY',
        description: 'Simple reply action',
        similes: [],
        examples: [],
        handler: replyHandler,
        validate: mock().mockImplementation(async () => true),
      };

      const replyWithImageAction: Action = {
        name: 'REPLY_WITH_IMAGE',
        description: 'Reply with image action',
        similes: [],
        examples: [],
        handler: replyWithImageHandler,
        validate: mock().mockImplementation(async () => true),
      };

      // Register both actions
      runtime.registerAction(replyAction);
      runtime.registerAction(replyWithImageAction);

      // Test 1: When asking for 'REPLY', it should match REPLY exactly, not REPLY_WITH_IMAGE
      responseMemory.content.actions = ['REPLY'];
      await runtime.processActions(message, [responseMemory]);

      expect(replyHandler).toHaveBeenCalledTimes(1);
      expect(replyWithImageHandler).not.toHaveBeenCalled();

      // Reset mocks
      replyHandler.mockClear();
      replyWithImageHandler.mockClear();

      // Test 2: When asking for 'REPLY_WITH_IMAGE', it should match REPLY_WITH_IMAGE exactly
      responseMemory.content.actions = ['REPLY_WITH_IMAGE'];
      await runtime.processActions(message, [responseMemory]);

      expect(replyWithImageHandler).toHaveBeenCalledTimes(1);
      expect(replyHandler).not.toHaveBeenCalled();
    });
  });

  // --- getActionResults Tests ---
  describe('getActionResults', () => {
    it('should return action results after processActions', async () => {
      const messageId = stringToUuid(uuidv4()) as UUID;
      const testAction: Action = {
        name: 'TEST_ACTION',
        description: 'Test action',
        similes: [],
        examples: [],
        handler: mock().mockResolvedValue({
          success: true,
          text: 'Action completed',
          data: { result: 'test data' },
          values: { testValue: 123 },
        }),
        validate: mock().mockResolvedValue(true),
      };

      runtime.registerAction(testAction);

      const memory: Memory = {
        id: messageId,
        entityId: agentId,
        agentId: agentId,
        roomId: stringToUuid(uuidv4()) as UUID,
        content: { text: 'test message' },
        createdAt: Date.now(),
      };

      const responses: Memory[] = [
        {
          id: stringToUuid(uuidv4()) as UUID,
          entityId: agentId,
          agentId: agentId,
          roomId: memory.roomId,
          content: {
            text: 'response',
            actions: ['TEST_ACTION'],
          },
          createdAt: Date.now(),
        },
      ];

      spyOn(runtime, 'composeState').mockResolvedValue(createMockState('test state'));

      await runtime.processActions(memory, responses);
      const results = runtime.getActionResults(messageId);

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('success', true);
      expect(results[0]).toHaveProperty('text', 'Action completed');
      expect(results[0].data).toEqual({ result: 'test data' });
      expect(results[0].values).toEqual({ testValue: 123 });
    });

    it('should return empty array for unknown messageId', () => {
      const unknownId = stringToUuid(uuidv4()) as UUID;
      const results = runtime.getActionResults(unknownId);
      expect(results).toEqual([]);
    });

    it('should return empty array when no actions were executed', async () => {
      const messageId = stringToUuid(uuidv4()) as UUID;
      const memory: Memory = {
        id: messageId,
        entityId: agentId,
        agentId: agentId,
        roomId: stringToUuid(uuidv4()) as UUID,
```