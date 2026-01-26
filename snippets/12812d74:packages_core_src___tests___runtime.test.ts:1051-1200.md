# 12812d74:packages_core_src___tests___runtime.test.ts:1051-1200

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/__tests__/runtime.test.ts:1051-1200
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
          ModelType.TEXT_LARGE,
          mockTextLargeHandler,
          'test-provider'
        );
        runtimeWithMixedSettings.registerModel(
          ModelType.OBJECT_SMALL,
          mockObjectSmallHandler,
          'test-provider'
        );
        runtimeWithMixedSettings.registerModel(
          ModelType.OBJECT_LARGE,
          mockObjectLargeHandler,
          'test-provider'
        );

        // Test 1: TEXT_SMALL - should use model-specific settings, fall back to defaults/legacy
        await runtimeWithMixedSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test text small',
        });

        expect(capturedTextSmall.temperature).toBe(0.5); // Model-specific
        expect(capturedTextSmall.maxTokens).toBe(1024); // Model-specific
        expect(capturedTextSmall.frequencyPenalty).toBe(0.7); // Legacy fallback
        expect(capturedTextSmall.presencePenalty).toBe(0.8); // Legacy fallback

        // Test 2: TEXT_LARGE - mixed model-specific and defaults
        await runtimeWithMixedSettings.useModel(ModelType.TEXT_LARGE, {
          prompt: 'test text large',
        });

        expect(capturedTextLarge.temperature).toBe(0.8); // Model-specific
        expect(capturedTextLarge.maxTokens).toBe(2048); // Default fallback
        expect(capturedTextLarge.frequencyPenalty).toBe(0.5); // Model-specific
        expect(capturedTextLarge.presencePenalty).toBe(0.8); // Legacy fallback

        // Test 3: OBJECT_SMALL - some model-specific, rest from defaults/legacy
        await runtimeWithMixedSettings.useModel(ModelType.OBJECT_SMALL, {
          prompt: 'test object small',
        });

        expect(capturedObjectSmall.temperature).toBe(0.3); // Model-specific
        expect(capturedObjectSmall.maxTokens).toBe(2048); // Default fallback
        expect(capturedObjectSmall.frequencyPenalty).toBe(0.7); // Legacy fallback
        expect(capturedObjectSmall.presencePenalty).toBe(0.8); // Legacy fallback

        // Test 4: OBJECT_LARGE - minimal model-specific settings
        await runtimeWithMixedSettings.useModel(ModelType.OBJECT_LARGE, {
          prompt: 'test object large',
        });

        expect(capturedObjectLarge.temperature).toBe(0.7); // Default fallback
        expect(capturedObjectLarge.maxTokens).toBe(2048); // Default fallback
        expect(capturedObjectLarge.frequencyPenalty).toBe(0.7); // Legacy fallback
        expect(capturedObjectLarge.presencePenalty).toBe(0.6); // Model-specific
      });

      it('should allow direct params to override all configuration levels', async () => {
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
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'response';
        });

        runtime.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

        // Direct params should override everything
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test',
          temperature: 0.1, // This should win
        });

        expect(capturedParams.temperature).toBe(0.1);
      });

      it('should handle models without specific configuration support', async () => {
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
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'response';
        });

        // Register a model type that doesn't have specific configuration support
        runtime.registerModel(ModelType.TEXT_REASONING_SMALL, mockHandler, 'test-provider');

        await runtime.useModel(ModelType.TEXT_REASONING_SMALL, {
          prompt: 'test reasoning',
        });

        // Should fall back to default settings
        expect(capturedParams.temperature).toBe(0.7);
        expect(capturedParams.maxTokens).toBeUndefined(); // No default for this
      });

      it('should validate and ignore invalid numeric values at all configuration levels', async () => {
        const characterWithInvalidSettings: Character = {
          ...mockCharacter,
          settings: {
            // Mix of valid and invalid values at different levels
            DEFAULT_TEMPERATURE: 'not-a-number',
            DEFAULT_MAX_TOKENS: 2048,
            TEXT_SMALL_TEMPERATURE: 0.5,
            TEXT_SMALL_MAX_TOKENS: 'invalid',
            TEXT_SMALL_FREQUENCY_PENALTY: 0.5,
            MODEL_TEMPERATURE: 0.8,
            MODEL_PRESENCE_PENALTY: 0.8,
          },
        };

        const runtime = new AgentRuntime({
          character: characterWithInvalidSettings,
          adapter: mockDatabaseAdapter,
        });

        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'response';
        });

        runtime.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

```