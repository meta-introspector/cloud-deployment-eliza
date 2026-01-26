# 5e8c73c1:packages_core_src___tests___runtime-streaming.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime-streaming.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        },
      });

      expect(result).toBe('Non-streamed result');
      expect(streamRequested).toBe(false);
      expect(chunks).toEqual([]); // No chunks received
    });

    it('should not stream when stream: false even with context callback', async () => {
      let streamRequested = false;
      const contextChunks: string[] = [];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          streamRequested = (params as any).stream === true;
          return 'Non-streamed result';
        },
        'test-provider'
      );

      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          contextChunks.push(chunk);
        },
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test',
          stream: false,
        })
      );

      expect(result).toBe('Non-streamed result');
      expect(streamRequested).toBe(false);
      expect(contextChunks).toEqual([]);
    });
  });

  describe('context streaming', () => {
    it('should stream to context callback when inside runWithStreamingContext', async () => {
      const contextChunks: string[] = [];
      const mockChunks = ['Context', ' ', 'streaming'];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          if ((params as any).stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join('');
        },
        'test-provider'
      );

      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          contextChunks.push(chunk);
        },
        messageId: stringToUuid('test-msg'),
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test',
        })
      );

      expect(result).toBe('Context streaming');
      expect(contextChunks).toEqual(mockChunks);
    });
  });

  describe('broadcast to both callbacks', () => {
    it('should send chunks to both params and context callbacks', async () => {
      const paramsChunks: string[] = [];
      const contextChunks: string[] = [];
      const mockChunks = ['Broadcast', ' ', 'test'];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          if ((params as any).stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join('');
        },
        'test-provider'
      );

      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          contextChunks.push(chunk);
        },
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test',
          onStreamChunk: (chunk: string) => {
            paramsChunks.push(chunk);
          },
        })
      );

      expect(result).toBe('Broadcast test');
      expect(paramsChunks).toEqual(mockChunks);
      expect(contextChunks).toEqual(mockChunks);
    });

    it('should continue streaming if one callback throws', async () => {
      const paramsChunks: string[] = [];
      const contextChunks: string[] = [];
      const mockChunks = ['A', 'B', 'C'];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          if ((params as any).stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join('');
        },
        'test-provider'
      );

      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          if (chunk === 'B') {
            throw new Error('Context callback error');
          }
          contextChunks.push(chunk);
        },
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test',
          onStreamChunk: (chunk: string) => {
            paramsChunks.push(chunk);
          },
        })
      );

      // Should complete successfully despite error
      expect(result).toBe('ABC');
      // Params callback should receive all chunks
      expect(paramsChunks).toEqual(['A', 'B', 'C']);
      // Context callback should receive A and C (B threw)
```