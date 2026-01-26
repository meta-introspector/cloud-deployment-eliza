# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            return { type: "large" };
          },
        );

        // Register all models
        runtimeWithMixedSettings.registerModel(
          ModelType.TEXT_SMALL,
          mockTextSmallHandler,
          "test-provider",
        );
        runtimeWithMixedSettings.registerModel(
          ModelType.TEXT_LARGE,
          mockTextLargeHandler,
          "test-provider",
        );
        runtimeWithMixedSettings.registerModel(
          ModelType.OBJECT_SMALL,
          mockObjectSmallHandler,
          "test-provider",
        );
        runtimeWithMixedSettings.registerModel(
          ModelType.OBJECT_LARGE,
          mockObjectLargeHandler,
          "test-provider",
        );

        // Test 1: TEXT_SMALL - should use model-specific settings, fall back to defaults/legacy
        await runtimeWithMixedSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: "test text small",
        });

        expect(capturedTextSmall.temperature).toBe(0.5); // Model-specific
        expect(capturedTextSmall.maxTokens).toBe(1024); // Model-specific
        expect(capturedTextSmall.frequencyPenalty).toBe(0.7); // Legacy fallback
        expect(capturedTextSmall.presencePenalty).toBe(0.8); // Legacy fallback

        // Test 2: TEXT_LARGE - mixed model-specific and defaults
        await runtimeWithMixedSettings.useModel(ModelType.TEXT_LARGE, {
          prompt: "test text large",
        });

        expect(capturedTextLarge.temperature).toBe(0.8); // Model-specific
        expect(capturedTextLarge.maxTokens).toBe(2048); // Default fallback
        expect(capturedTextLarge.frequencyPenalty).toBe(0.5); // Model-specific
        expect(capturedTextLarge.presencePenalty).toBe(0.8); // Legacy fallback

        // Test 3: OBJECT_SMALL - some model-specific, rest from defaults/legacy
        await runtimeWithMixedSettings.useModel(ModelType.OBJECT_SMALL, {
          prompt: "test object small",
        });

        expect(capturedObjectSmall.temperature).toBe(0.3); // Model-specific
        expect(capturedObjectSmall.maxTokens).toBe(2048); // Default fallback
        expect(capturedObjectSmall.frequencyPenalty).toBe(0.7); // Legacy fallback
        expect(capturedObjectSmall.presencePenalty).toBe(0.8); // Legacy fallback

        // Test 4: OBJECT_LARGE - minimal model-specific settings
        await runtimeWithMixedSettings.useModel(ModelType.OBJECT_LARGE, {
          prompt: "test object large",
        });

        expect(capturedObjectLarge.temperature).toBe(0.7); // Default fallback
        expect(capturedObjectLarge.maxTokens).toBe(2048); // Default fallback
        expect(capturedObjectLarge.frequencyPenalty).toBe(0.7); // Legacy fallback
        expect(capturedObjectLarge.presencePenalty).toBe(0.6); // Model-specific
      });

      it("should allow direct params to override all configuration levels", async () => {
        const characterWithAllSettings: Character = {
          ...mockCharacter,
          settings: {
            // All levels of configuration
            DEFAULT_TEMPERATURE: 0.7,
            TEXT_SMALL_TEMPERATURE: 0.5,
            MODEL_TEMPERATURE: 0.9,
          },
        };

        const runtime = new AgentRuntime({
          character: characterWithAllSettings,
          adapter: mockDatabaseAdapter,
        });

        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(
          async (_runtime: any, params: any) => {
            capturedParams = params;
            return "response";
          },
        );

        runtime.registerModel(
          ModelType.TEXT_SMALL,
          mockHandler,
          "test-provider",
        );

        // Direct params should override everything
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: "test",
          temperature: 0.1, // This should win
        });

        expect(capturedParams.temperature).toBe(0.1);
      });

      it("should handle models without specific configuration support", async () => {
        const characterWithSettings: Character = {
          ...mockCharacter,
          settings: {
            DEFAULT_TEMPERATURE: 0.7,
            TEXT_SMALL_TEMPERATURE: 0.5,
            // No specific settings for TEXT_REASONING_SMALL
          },
        };

        const runtime = new AgentRuntime({
          character: characterWithSettings,
          adapter: mockDatabaseAdapter,
        });

        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(
          async (_runtime: any, params: any) => {
            capturedParams = params;
            return "response";
          },
        );

        // Register a model type that doesn't have specific configuration support
        runtime.registerModel(
          ModelType.TEXT_REASONING_SMALL,
          mockHandler,
          "test-provider",
        );

        await runtime.useModel(ModelType.TEXT_REASONING_SMALL, {
          prompt: "test reasoning",
        });

        // Should fall back to default settings
        expect(capturedParams.temperature).toBe(0.7);
        expect(capturedParams.maxTokens).toBeUndefined(); // No default for this
      });

      it("should validate and ignore invalid numeric values at all configuration levels", async () => {
        const characterWithInvalidSettings: Character = {
          ...mockCharacter,
          settings: {
            // Mix of valid and invalid values at different levels
```