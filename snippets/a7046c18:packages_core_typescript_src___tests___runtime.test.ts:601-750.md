# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Add tests for includeList, caching behavior
  });

  describe("Model Usage", () => {
    it("should call registered model handler", async () => {
      const modelHandler = mock().mockResolvedValue("success");
      const modelType = ModelType.TEXT_LARGE;

      runtime.registerModel(modelType, modelHandler, "test-provider");

      const params = { prompt: "test prompt", someOption: true };
      const result = await runtime.useModel(modelType, params);

      expect(modelHandler).toHaveBeenCalledTimes(1);
      // Check that handler was called with runtime and params (no runtime in params)
      expect(modelHandler).toHaveBeenCalledWith(
        runtime,
        expect.objectContaining(params),
      );
      expect(result).toEqual("success");
      // Check if log was called (part of useModel logic)
      expect(mockDatabaseAdapter.log).toHaveBeenCalledWith(
        expect.objectContaining({ type: `useModel:${modelType}` }),
      );
    });

    it("should throw if model type is not registered", async () => {
      const modelType = "UNREGISTERED_MODEL" as ModelTypeName;
      const params = { prompt: "test" };
      await expect(runtime.useModel(modelType, params)).rejects.toThrow(
        /No handler found/,
      );
    });
  });

  describe("Action Processing", () => {
    let mockActionHandler: ReturnType<typeof mock<Handler>>;
    let testAction: Action;
    let message: Memory;
    let responseMemory: Memory;

    beforeEach(() => {
      mockActionHandler = mock().mockResolvedValue(undefined);
      testAction = createMockAction("TestAction");
      testAction.handler = mockActionHandler; // Assign mock handler

      runtime.registerAction(testAction);

      message = createMockMemory(
        "user message",
        undefined,
        undefined,
        undefined,
        agentId,
      );
      responseMemory = createMockMemory(
        "agent response",
        undefined,
        undefined,
        message.roomId,
        agentId,
      ); // Same room
      responseMemory.content.actions = ["TestAction"]; // Specify action to run

      // Mock composeState as it's called within processActions
      spyOn(runtime, "composeState").mockResolvedValue(
        createMockState("composed state text"),
      );
    });

    it("should find and execute the correct action handler", async () => {
      await runtime.processActions(message, [responseMemory]);

      expect(runtime.composeState).toHaveBeenCalled(); // Verify state was composed
      expect(mockActionHandler).toHaveBeenCalledTimes(1);
      // Check arguments passed to the handler
      expect(mockActionHandler).toHaveBeenCalledWith(
        runtime, // runtime instance
        message, // original message
        expect.objectContaining({
          text: "composed state text",
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
        [responseMemory], // responses array
      );
      expect(mockDatabaseAdapter.log).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "action",
          body: expect.objectContaining({ action: "TestAction" }),
        }),
      );
    });

    // Add tests for action not found, simile matching, handler errors
    it("should not execute if no action name matches", async () => {
      responseMemory.content.actions = ["NonExistentAction"];
      await runtime.processActions(message, [responseMemory]);
      expect(mockActionHandler).not.toHaveBeenCalled();
      expect(mockDatabaseAdapter.log).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: "action" }),
      );
    });

    it("should prioritize exact action name matches over fuzzy matches", async () => {
      // Create two actions where one name is a substring of another
      const replyHandler = mock().mockResolvedValue(undefined);
      const replyWithImageHandler = mock().mockResolvedValue(undefined);

      const replyAction: Action = {
        name: "REPLY",
        description: "Simple reply action",
        similes: [],
        examples: [],
        handler: replyHandler,
        validate: mock().mockImplementation(async () => true),
      };

      const replyWithImageAction: Action = {
        name: "REPLY_WITH_IMAGE",
        description: "Reply with image action",
        similes: [],
        examples: [],
        handler: replyWithImageHandler,
        validate: mock().mockImplementation(async () => true),
      };

      // Register both actions
      runtime.registerAction(replyAction);
      runtime.registerAction(replyWithImageAction);

      // Test 1: When asking for 'REPLY', it should match REPLY exactly, not REPLY_WITH_IMAGE
      responseMemory.content.actions = ["REPLY"];
      await runtime.processActions(message, [responseMemory]);

      expect(replyHandler).toHaveBeenCalledTimes(1);
      expect(replyWithImageHandler).not.toHaveBeenCalled();

      // Reset mocks
      replyHandler.mockClear();
      replyWithImageHandler.mockClear();

      // Test 2: When asking for 'REPLY_WITH_IMAGE', it should match REPLY_WITH_IMAGE exactly
```