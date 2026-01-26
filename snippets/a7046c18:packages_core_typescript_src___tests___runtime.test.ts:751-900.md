# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      responseMemory.content.actions = ["REPLY_WITH_IMAGE"];
      await runtime.processActions(message, [responseMemory]);

      expect(replyWithImageHandler).toHaveBeenCalledTimes(1);
      expect(replyHandler).not.toHaveBeenCalled();
    });
  });

  // --- getActionResults Tests ---
  describe("getActionResults", () => {
    it("should return action results after processActions", async () => {
      const messageId = stringToUuid(uuidv4()) as UUID;
      const testAction: Action = {
        name: "TEST_ACTION",
        description: "Test action",
        similes: [],
        examples: [],
        handler: mock().mockResolvedValue({
          success: true,
          text: "Action completed",
          data: { result: "test data" },
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
        content: { text: "test message" },
        createdAt: Date.now(),
      };

      const responses: Memory[] = [
        {
          id: stringToUuid(uuidv4()) as UUID,
          entityId: agentId,
          agentId: agentId,
          roomId: memory.roomId,
          content: {
            text: "response",
            actions: ["TEST_ACTION"],
          },
          createdAt: Date.now(),
        },
      ];

      spyOn(runtime, "composeState").mockResolvedValue(
        createMockState("test state"),
      );

      await runtime.processActions(memory, responses);
      const results = runtime.getActionResults(messageId);

      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty("success", true);
      expect(results[0]).toHaveProperty("text", "Action completed");
      expect(results[0].data).toEqual({ result: "test data" });
      expect(results[0].values).toEqual({ testValue: 123 });
    });

    it("should return empty array for unknown messageId", () => {
      const unknownId = stringToUuid(uuidv4()) as UUID;
      const results = runtime.getActionResults(unknownId);
      expect(results).toEqual([]);
    });

    it("should return empty array when no actions were executed", async () => {
      const messageId = stringToUuid(uuidv4()) as UUID;
      const memory: Memory = {
        id: messageId,
        entityId: agentId,
        agentId: agentId,
        roomId: stringToUuid(uuidv4()) as UUID,
        content: { text: "test message" },
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
  describe("Adapter Passthrough", () => {
    it("createEntity should call adapter.createEntities", async () => {
      const entityData = {
        id: stringToUuid(uuidv4()),
        agentId: agentId,
        names: ["Test Entity"],
        metadata: {},
      };
      await runtime.createEntity(entityData);
      expect(mockDatabaseAdapter.createEntities).toHaveBeenCalledTimes(1);
      expect(mockDatabaseAdapter.createEntities).toHaveBeenCalledWith([
        entityData,
      ]);
    });

    it("getMemoryById should call adapter.getMemoryById", async () => {
      const memoryId = stringToUuid(uuidv4());
      await runtime.getMemoryById(memoryId);
      expect(mockDatabaseAdapter.getMemoryById).toHaveBeenCalledTimes(1);
      expect(mockDatabaseAdapter.getMemoryById).toHaveBeenCalledWith(memoryId);
    });
    // Add more tests for other adapter methods if full coverage is desired
  });

  // --- Event Emitter Tests ---
  describe("Event Emitter (on/emit/off)", () => {
    it("should register and emit events", () => {
      const handler = mock();
      const eventName = "testEvent";
      const eventData = { info: "data" };

      runtime.on(eventName, handler);
      runtime.emit(eventName, eventData);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(eventData);
    });

    it("should remove event handler with off", () => {
      const handler = mock();
      const eventName = "testEvent";

      runtime.on(eventName, handler);
      runtime.off(eventName, handler);
      runtime.emit(eventName, { info: "data" });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  // --- Tests from original suite ---
  describe("Original Suite Tests", () => {
    // Note: These might need slight adaptation if they relied on Jest specifics
    // or different mock setups.

    // Copied from your original suite:
    describe("model provider management", () => {
```