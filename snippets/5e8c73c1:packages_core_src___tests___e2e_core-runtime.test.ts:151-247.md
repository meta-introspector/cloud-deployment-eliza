# 5e8c73c1:packages_core_src___tests___e2e_core-runtime.test.ts:151-247

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/e2e/core-runtime.test.ts:151-247
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const retrievedMemories = await runtime.adapter.getMemories({
        roomId,
        count: 10,
        tableName: 'messages',
      });
      expect(retrievedMemories).toHaveLength(1);
      expect(getMemoryText(retrievedMemories[0])).toBe('Test message for memory');
    });

    it('should handle multi-turn conversation', async () => {
      const message1 = createMessageMemory({
        entityId,
        roomId,
        content: { text: 'What is 2+2?' },
      });

      const message2 = createMessageMemory({
        entityId,
        roomId,
        content: { text: 'What about 3+3?' },
      });

      const conversationHistory: Memory[] = [message1, message2];
      (mockAdapter.getMemoriesByRoomIds as ReturnType<typeof mock>).mockResolvedValue(
        conversationHistory
      );
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(conversationHistory);

      await messageService.handleMessage(runtime, message1, responseCallback);
      await messageService.handleMessage(runtime, message2, responseCallback);

      // Message service creates memories for both user messages and agent responses
      expect(mockAdapter.createMemory).toHaveBeenCalled();
      expect((mockAdapter.createMemory as any).mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Character and Runtime Integration', () => {
    it('should parse character and initialize runtime correctly', () => {
      const parsed = parseCharacter(testCharacter);
      const newRuntime = new AgentRuntime({
        character: parsed,
        adapter: mockAdapter,
      });

      expect(newRuntime.character.name).toBe('TestAgent');
      expect(newRuntime.character.settings?.MODEL).toBe('gpt-4');
      expect(newRuntime.agentId).toBe(agentId);
    });
  });

  describe('Memory Operations Integration', () => {
    it('should create, store, and retrieve memories through runtime', async () => {
      const memory = createMessageMemory({
        entityId,
        roomId,
        agentId,
        content: { text: 'Integration test memory' },
      });

      const memoryId = await runtime.createMemory(memory, 'messages');
      expect(memoryId).toBeDefined();

      const storedMemories: Memory[] = [memory];
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(storedMemories);

      const retrieved = await runtime.adapter.getMemories({
        roomId,
        count: 1,
        tableName: 'messages',
      });
      expect(retrieved).toHaveLength(1);
      expect(getMemoryText(retrieved[0])).toBe('Integration test memory');
    });
  });

  describe('Message Service Integration', () => {
    it('should process message through complete service pipeline and generate response', async () => {
      const message = createMessageMemory({
        entityId,
        roomId,
        content: { text: 'Hello, can you help me?' },
      });

      const result = await messageService.handleMessage(runtime, message, responseCallback);

      expect(result).toBeDefined();
      expect(result.didRespond).toBeDefined();
      expect(result.responseContent).toBeDefined();
      expect(result.state).toBeDefined();
      expect(mockAdapter.createMemory).toHaveBeenCalled();

      // Verify the message was stored
      expect((mockAdapter.createMemory as any).mock.calls.length).toBeGreaterThan(0);
    });
  });
});
```