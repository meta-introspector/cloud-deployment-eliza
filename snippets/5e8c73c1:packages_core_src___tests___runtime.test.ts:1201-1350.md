# 5e8c73c1:packages_core_src___tests___runtime.test.ts:1201-1350

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:1201-1350
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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

        await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: 'test invalid',
        });

        // Valid values should be used, invalid ones ignored
        expect(capturedParams.temperature).toBe(0.5); // Valid model-specific
        expect(capturedParams.maxTokens).toBe(2048); // Valid default (model-specific was invalid)
        expect(capturedParams.frequencyPenalty).toBe(0.5); // Valid model-specific
        expect(capturedParams.presencePenalty).toBe(0.8); // Valid legacy
      });
    });
  });

  describe('Streaming Support', () => {
    describe('isStreamableModelType', () => {
      it('should return true for TEXT_SMALL', () => {
        expect(isStreamableModelType(ModelType.TEXT_SMALL)).toBe(true);
      });

      it('should return true for TEXT_LARGE', () => {
        expect(isStreamableModelType(ModelType.TEXT_LARGE)).toBe(true);
      });

      it('should return false for TEXT_EMBEDDING', () => {
        expect(isStreamableModelType(ModelType.TEXT_EMBEDDING)).toBe(false);
      });

      it('should return false for OBJECT_SMALL', () => {
        expect(isStreamableModelType(ModelType.OBJECT_SMALL)).toBe(false);
      });

      it('should return false for IMAGE', () => {
        expect(isStreamableModelType(ModelType.IMAGE)).toBe(false);
      });
    });

    describe('useModel with streaming', () => {
      it('should return string when stream is false', async () => {
        const mockHandler = mock().mockResolvedValue('Non-streaming response');
        runtime.registerModel(ModelType.TEXT_LARGE, mockHandler, 'test-provider');

        const result = await runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test prompt',
          stream: false,
        });

        expect(typeof result).toBe('string');
        expect(result).toBe('Non-streaming response');
      });

      it('should return string without streaming context', async () => {
        const mockHandler = mock().mockResolvedValue('Direct response');
        runtime.registerModel(ModelType.TEXT_LARGE, mockHandler, 'test-provider');

        const result = await runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test prompt',
        });

        expect(typeof result).toBe('string');
        expect(result).toBe('Direct response');
      });

      it('should auto-stream when streaming context is active', async () => {
        // Configure the streaming context manager for Node.js environment
        const { setStreamingContextManager } = await import('../streaming-context');
        const { createNodeStreamingContextManager } = await import('../streaming-context.node');
        setStreamingContextManager(createNodeStreamingContextManager());

        const { runWithStreamingContext } = await import('../streaming-context');

        const chunks: string[] = [];
        const mockStreamResult: TextStreamResult = {
          textStream: (async function* () {
            yield 'Hello';
            yield ' World';
          })(),
          text: Promise.resolve('Hello World'),
          usage: Promise.resolve(undefined),
          finishReason: Promise.resolve('stop'),
        };

        const mockHandler = mock().mockResolvedValue(mockStreamResult);
        runtime.registerModel(ModelType.TEXT_LARGE, mockHandler, 'test-provider');

        const streamingContext = {
          onStreamChunk: async (chunk: string) => {
            chunks.push(chunk);
          },
        };

        const result = await runWithStreamingContext(streamingContext, async () => {
          return runtime.useModel(ModelType.TEXT_LARGE, {
            prompt: 'Test prompt',
          });
        });

        // Should return string (not TextStreamResult)
        expect(typeof result).toBe('string');
        // Handler should have been called with stream: true
        const callArgs = mockHandler.mock.calls[0];
        expect(callArgs[1].stream).toBe(true);
      });

      it('should isolate streaming contexts in parallel calls (AsyncLocalStorage)', async () => {
        // Configure the streaming context manager for Node.js environment
        const { setStreamingContextManager } = await import('../streaming-context');
        const { createNodeStreamingContextManager } = await import('../streaming-context.node');
        setStreamingContextManager(createNodeStreamingContextManager());

        const { runWithStreamingContext } = await import('../streaming-context');

        // Track chunks received by each context
        const context1Chunks: string[] = [];
        const context2Chunks: string[] = [];
        const context3Chunks: string[] = [];

        // Create mock handlers that return different streams for each call
        // Note: The runtime uses XmlTextStreamExtractor which extracts content from <text> tags
        let callCount = 0;
```