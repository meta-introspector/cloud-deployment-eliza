# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          async (_runtime: IAgentRuntime, params: GenerateTextParams) => {
            capturedParams = params;
            return "test response";
          },
        );

        runtime.registerModel(
          ModelType.TEXT_SMALL,
          mockHandler,
          "test-provider",
        );

        // Test: Explicitly set user to empty string should be preserved
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: "test prompt",
          user: "",
        });

        expect(capturedParams.user).toBe("");
        expect(capturedParams.prompt).toBe("test prompt");
      });

      it("should preserve explicitly provided null for user parameter in useModel", async () => {
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

        runtime.registerModel(
          ModelType.TEXT_SMALL,
          mockHandler,
          "test-provider",
        );

        // Test: Explicitly set user to null should be preserved
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: "test prompt",
          user: null,
        });

        expect(capturedParams.user).toBeNull();
        expect(capturedParams.prompt).toBe("test prompt");
      });

      it("should auto-populate user from character name when not provided in useModel", async () => {
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

        runtime.registerModel(
          ModelType.TEXT_SMALL,
          mockHandler,
          "test-provider",
        );

        // Test: When user is undefined, should auto-populate from character name
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: "test prompt",
        });

        expect(capturedParams.user).toBe("Test Character");
        expect(capturedParams.prompt).toBe("test prompt");
      });
    });

    describe("model settings from character configuration", () => {
      it("should support per-model-type configuration with proper fallback chain", async () => {
        // Create character with mixed settings: defaults, model-specific, and legacy
        const characterWithMixedSettings: Character = {
          ...mockCharacter,
          settings: {
            // Default settings (apply to all models)
            DEFAULT_TEMPERATURE: 0.7,
            DEFAULT_MAX_TOKENS: 2048,

            // Model-specific settings (override defaults)
            TEXT_SMALL_TEMPERATURE: 0.5,
            TEXT_SMALL_MAX_TOKENS: 1024,
            TEXT_LARGE_TEMPERATURE: 0.8,
            TEXT_LARGE_FREQUENCY_PENALTY: 0.5,
            OBJECT_SMALL_TEMPERATURE: 0.3,
            OBJECT_LARGE_PRESENCE_PENALTY: 0.6,

            // Legacy settings (should be lowest priority)
            MODEL_TEMPERATURE: 0.9,
            MODEL_MAX_TOKEN: 4096,
            MODEL_FREQ_PENALTY: 0.7,
            MODEL_PRESENCE_PENALTY: 0.8,
          },
        };

        const runtimeWithMixedSettings = new AgentRuntime({
          character: characterWithMixedSettings,
          adapter: mockDatabaseAdapter,
        });

        // Mock handlers to capture params
        let capturedTextSmall: GenerateTextParams | null = null;
        let capturedTextLarge: GenerateTextParams | null = null;
        let capturedObjectSmall: ObjectGenerationParams | null = null;
        let capturedObjectLarge: ObjectGenerationParams | null = null;

        const mockTextSmallHandler = mock<
          ModelHandler<GenerateTextParams, string>["handler"]
        >().mockImplementation(
          async (_runtime: IAgentRuntime, params: GenerateTextParams) => {
            capturedTextSmall = params;
            return "text small response";
          },
        );
        const mockTextLargeHandler = mock<
          ModelHandler<GenerateTextParams, string>["handler"]
        >().mockImplementation(
          async (_runtime: IAgentRuntime, params: GenerateTextParams) => {
            capturedTextLarge = params;
            return "text large response";
          },
        );
        const mockObjectSmallHandler = mock<
          ModelHandler<
            ObjectGenerationParams,
            Record<string, unknown>
          >["handler"]
        >().mockImplementation(
          async (_runtime: IAgentRuntime, params: ObjectGenerationParams) => {
            capturedObjectSmall = params;
            return { type: "small" };
          },
        );
        const mockObjectLargeHandler = mock<
          ModelHandler<
            ObjectGenerationParams,
            Record<string, unknown>
          >["handler"]
        >().mockImplementation(
          async (_runtime: IAgentRuntime, params: ObjectGenerationParams) => {
            capturedObjectLarge = params;
```