# 5e8c73c1:packages_core_src___tests___runtime.test.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

        // Register the mock model
        runtimeWithSettings.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

        // Test 1: Model settings are applied as defaults
        await runtimeWithSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test prompt',
        });

        expect(capturedParams.maxTokens).toBe(4096);
        expect(capturedParams.temperature).toBe(0.5);
        expect(capturedParams.frequencyPenalty).toBe(0.8);
        expect(capturedParams.presencePenalty).toBe(0.9);
        expect(capturedParams.prompt).toBe('test prompt');

        // Test 2: Explicit parameters override character defaults
        await runtimeWithSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test prompt 2',
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
          name: 'TestAgentNoSettings',
        };
        const runtimeNoSettings = new AgentRuntime({
          character: characterNoSettings,
          adapter: mockDatabaseAdapter,
        });

        // Use same mockHandler for the second test
        mockHandler.mockClear();
        runtimeNoSettings.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

        await runtimeNoSettings.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test prompt 3',
          temperature: 0.7,
        });

        expect(capturedParams.temperature).toBe(0.7);
        expect(capturedParams.maxTokens).toBeUndefined();
        expect(capturedParams.frequencyPenalty).toBeUndefined();
        expect(capturedParams.presencePenalty).toBeUndefined();
      });

      it('should preserve explicitly provided empty string for user parameter in useModel', async () => {
        // Mock a model handler to capture params
        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'test response';
        });

        runtime.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

        // Test: Explicitly set user to empty string should be preserved
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test prompt',
          user: '',
        });

        expect(capturedParams.user).toBe('');
        expect(capturedParams.prompt).toBe('test prompt');
      });

      it('should preserve explicitly provided null for user parameter in useModel', async () => {
        // Mock a model handler to capture params
        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'test response';
        });

        runtime.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

        // Test: Explicitly set user to null should be preserved
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test prompt',
          user: null,
        });

        expect(capturedParams.user).toBeNull();
        expect(capturedParams.prompt).toBe('test prompt');
      });

      it('should auto-populate user from character name when not provided in useModel', async () => {
        // Mock a model handler to capture params
        let capturedParams: any = null;
        const mockHandler = mock().mockImplementation(async (_runtime: any, params: any) => {
          capturedParams = params;
          return 'test response';
        });

        runtime.registerModel(ModelType.TEXT_SMALL, mockHandler, 'test-provider');

        // Test: When user is undefined, should auto-populate from character name
        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test prompt',
        });

        expect(capturedParams.user).toBe('Test Character');
        expect(capturedParams.prompt).toBe('test prompt');
      });
    });

    describe('model settings from character configuration', () => {
      it('should support per-model-type configuration with proper fallback chain', async () => {
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
        let capturedTextSmall: any = null;
        let capturedTextLarge: any = null;
        let capturedObjectSmall: any = null;
        let capturedObjectLarge: any = null;

        const mockTextSmallHandler = mock().mockImplementation(
```