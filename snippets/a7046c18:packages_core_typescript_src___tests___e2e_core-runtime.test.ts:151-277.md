# a7046c18:packages_core_typescript_src___tests___e2e_core-runtime.test.ts:151-277

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/e2e/core-runtime.test.ts:151-277
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        entityId,
        roomId,
        content: { text: "Test message for memory" },
      });

      const storedMemories: Memory[] = [userMessage];
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(
        storedMemories,
      );

      await messageService.handleMessage(
        runtime,
        userMessage,
        responseCallback,
      );

      const retrievedMemories = await runtime.adapter.getMemories({
        roomId,
        count: 10,
        tableName: "messages",
      });
      expect(retrievedMemories).toHaveLength(1);
      expect(getMemoryText(retrievedMemories[0])).toBe(
        "Test message for memory",
      );
    });

    it("should handle multi-turn conversation", async () => {
      const message1 = createMessageMemory({
        entityId,
        roomId,
        content: { text: "What is 2+2?" },
      });

      const message2 = createMessageMemory({
        entityId,
        roomId,
        content: { text: "What about 3+3?" },
      });

      const conversationHistory: Memory[] = [message1, message2];
      (
        mockAdapter.getMemoriesByRoomIds as ReturnType<typeof mock>
      ).mockResolvedValue(conversationHistory);
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(
        conversationHistory,
      );

      await messageService.handleMessage(runtime, message1, responseCallback);
      await messageService.handleMessage(runtime, message2, responseCallback);

      // Message service creates memories for both user messages and agent responses
      expect(mockAdapter.createMemory).toHaveBeenCalled();
      expect(
        (mockAdapter.createMemory as ReturnType<typeof mock>).mock.calls.length,
      ).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Character and Runtime Integration", () => {
    it("should parse character and initialize runtime correctly", () => {
      const parsed = parseCharacter(testCharacter);
      const newRuntime = new AgentRuntime({
        character: parsed,
        adapter: mockAdapter,
      });

      expect(newRuntime.character.name).toBe("TestAgent");
      expect(newRuntime.character.settings?.MODEL).toBe("gpt-4");
      expect(newRuntime.agentId).toBe(agentId);
    });
  });

  describe("Memory Operations Integration", () => {
    it("should create, store, and retrieve memories through runtime", async () => {
      const memory = createMessageMemory({
        entityId,
        roomId,
        agentId,
        content: { text: "Integration test memory" },
      });

      const memoryId = await runtime.createMemory(memory, "messages");
      expect(memoryId).toBeDefined();

      const storedMemories: Memory[] = [memory];
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(
        storedMemories,
      );

      const retrieved = await runtime.adapter.getMemories({
        roomId,
        count: 1,
        tableName: "messages",
      });
      expect(retrieved).toHaveLength(1);
      expect(getMemoryText(retrieved[0])).toBe("Integration test memory");
    });
  });

  describe("Message Service Integration", () => {
    it("should process message through complete service pipeline and generate response", async () => {
      const message = createMessageMemory({
        entityId,
        roomId,
        content: { text: "Hello, can you help me?" },
      });

      const result = await messageService.handleMessage(
        runtime,
        message,
        responseCallback,
      );

      expect(result).toBeDefined();
      expect(result.didRespond).toBeDefined();
      expect(result.responseContent).toBeDefined();
      expect(result.state).toBeDefined();
      expect(mockAdapter.createMemory).toHaveBeenCalled();

      // Verify the message was stored
      expect(
        (mockAdapter.createMemory as ReturnType<typeof mock>).mock.calls.length,
      ).toBeGreaterThan(0);
    });
  });
});
```