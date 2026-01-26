# 12812d74:packages_core_src___tests___runtime.test.ts:1201-1350

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/__tests__/runtime.test.ts:1201-1350
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
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
        const mockHandler = mock().mockImplementation(() => {
          callCount++;
          const id = callCount;
          // Stream XML with <text> tags so XmlTextStreamExtractor can extract the content
          return Promise.resolve({
            textStream: (async function* () {
              yield `<response><text>ctx${id}-`;
              await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async delay
              yield `part1 ctx${id}-part2</text></response>`;
            })(),
            text: Promise.resolve(`<response><text>ctx${id}-part1 ctx${id}-part2</text></response>`),
            usage: Promise.resolve(undefined),
            finishReason: Promise.resolve('stop'),
          });
        });

        runtime.registerModel(ModelType.TEXT_LARGE, mockHandler, 'test-provider');

        // Run 3 streaming contexts in parallel
        const [result1, result2, result3] = await Promise.all([
          runWithStreamingContext(
            { onStreamChunk: async (chunk: string) => { context1Chunks.push(chunk); } },
            async () => runtime.useModel(ModelType.TEXT_LARGE, { prompt: 'Test 1' })
          ),
          runWithStreamingContext(
            { onStreamChunk: async (chunk: string) => { context2Chunks.push(chunk); } },
            async () => runtime.useModel(ModelType.TEXT_LARGE, { prompt: 'Test 2' })
          ),
          runWithStreamingContext(
            { onStreamChunk: async (chunk: string) => { context3Chunks.push(chunk); } },
            async () => runtime.useModel(ModelType.TEXT_LARGE, { prompt: 'Test 3' })
```