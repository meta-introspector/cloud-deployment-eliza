# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      it("should provide access to the configured model provider", () => {
        // In this refactored structure, 'provider' likely refers to the runtime instance itself
        // which acts as the primary interface.
        const provider = runtime; // The runtime instance manages models
        expect(provider).toBeDefined();
        // You might add more specific checks here, e.g., ensuring getModel exists
        expect(runtime.getModel).toBeInstanceOf(Function);
      });
    });

    // Copied from your original suite:
    describe("state management", () => {
      it("should compose state with additional keys", async () => {
        // Use the helper function for consistency
        const message: Memory = createMockMemory(
          "test message",
          stringToUuid("11111111-e89b-12d3-a456-426614174003"), // Use valid UUIDs
          stringToUuid("22222222-e89b-12d3-a456-426614174004"),
          stringToUuid("33333333-e89b-12d3-a456-426614174003"), // Room ID
          agentId,
        );

        // Mock provider needed by composeState
        const providerGet = mock().mockResolvedValue({ text: "provider text" });
        runtime.registerProvider({ name: "TestProvider", get: providerGet });

        const state = await runtime.composeState(message);
        expect(state).toHaveProperty("values");
        expect(state).toHaveProperty("text");
        expect(state).toHaveProperty("data");
        // Add more specific state checks if needed
        expect(state.text).toContain("provider text"); // Check provider text is included
      });
    });

    // Copied from your original suite:
    describe("action management", () => {
      it("should register an action", () => {
        const action = createMockAction("testAction");
        runtime.registerAction(action);
        expect(runtime.actions).toContain(action);
      });

      it("should allow registering multiple actions", () => {
        const action1 = createMockAction("testAction1");
        const action2 = createMockAction("testAction2");
        runtime.registerAction(action1);
        runtime.registerAction(action2);
        expect(runtime.actions).toContain(action1);
        expect(runtime.actions).toContain(action2);
      });
    });

    describe("model settings from character configuration", () => {
      it("should apply character model settings as defaults and allow overrides", async () => {
        // Create character with model settings
        const characterWithSettings: Character = {
          ...mockCharacter,
          settings: {
            MODEL_MAX_TOKEN: 4096,
            MODEL_TEMPERATURE: 0.5,
            MODEL_FREQ_PENALTY: 0.8,
            MODEL_PRESENCE_PENALTY: 0.9,
            // Test invalid values that should be ignored
            MODEL_INVALID: "not-a-number",
          },
        };

        // Create runtime with character settings
        const runtimeWithSettings = new AgentRuntime({
          character: characterWithSettings,
          adapter: mockDatabaseAdapter,
        });

        // Mock a model handler to capture params
        let capturedParams: GenerateTextParams | null = null;
        const mockHandler = mock<
          ModelHandler<GenerateTextParams, string>["handler"]
        >().mockImplementation(
          async (_runtime: IAgentRuntime, params: GenerateTextParams) => {
            capturedParams = params;
            return "test response";
          },
        );

        // Register the mock model
        runtimeWithSettings.registerModel(
          ModelType.TEXT_SMALL,
          mockHandler,
          "test-provider",
        );

        // Test 1: Model settings are applied as defaults
        await runtimeWithSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: "test prompt",
        });

        expect(capturedParams.maxTokens).toBe(4096);
        expect(capturedParams.temperature).toBe(0.5);
        expect(capturedParams.frequencyPenalty).toBe(0.8);
        expect(capturedParams.presencePenalty).toBe(0.9);
        expect(capturedParams.prompt).toBe("test prompt");

        // Test 2: Explicit parameters override character defaults
        await runtimeWithSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: "test prompt 2",
          temperature: 0.2,
          maxTokens: 2048,
        });

        expect(capturedParams.temperature).toBe(0.2);
        expect(capturedParams.maxTokens).toBe(2048);
        expect(capturedParams.frequencyPenalty).toBe(0.8); // Still from character
        expect(capturedParams.presencePenalty).toBe(0.9); // Still from character

        // Test 3: No settings configured - use only provided params
        const characterNoSettings: Character = {
          ...mockCharacter,
          name: "TestAgentNoSettings",
        };
        const runtimeNoSettings = new AgentRuntime({
          character: characterNoSettings,
          adapter: mockDatabaseAdapter,
        });

        // Use same mockHandler for the second test
        mockHandler.mockClear();
        runtimeNoSettings.registerModel(
          ModelType.TEXT_SMALL,
          mockHandler,
          "test-provider",
        );

        await runtimeNoSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: "test prompt 3",
          temperature: 0.7,
        });

        expect(capturedParams.temperature).toBe(0.7);
        expect(capturedParams.maxTokens).toBeUndefined();
        expect(capturedParams.frequencyPenalty).toBeUndefined();
        expect(capturedParams.presencePenalty).toBeUndefined();
      });

      it("should preserve explicitly provided empty string for user parameter in useModel", async () => {
        // Mock a model handler to capture params
        let capturedParams: GenerateTextParams | null = null;
        const mockHandler = mock<
          ModelHandler<GenerateTextParams, string>["handler"]
        >().mockImplementation(
```