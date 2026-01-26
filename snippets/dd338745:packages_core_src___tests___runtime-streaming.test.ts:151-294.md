# dd338745:packages_core_src___tests___runtime-streaming.test.ts:151-294

**Commit:** dd338745cb075f0766fb7dc04df0f2cb018bd06e
**Author:** standujar
**Date:** Tue Dec 16 02:41:08 2025 +0100
**File:** packages/core/src/__tests__/runtime-streaming.test.ts:151-294
**Novelty Score:** 18.06
**Concepts:** rag-system, testing

```

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

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

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

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

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

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

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
      expect(contextChunks).toEqual(['A', 'C']);
    });
  });

  describe('handler returns string (no streaming support)', () => {
    it('should return string directly when handler does not support streaming', async () => {
      const chunks: string[] = [];

      runtime.registerModel(ModelType.TEXT_LARGE, async () => {
        return 'Plain string response';
      }, 'test-provider');

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: 'Test',
        onStreamChunk: (chunk: string) => {
          chunks.push(chunk);
        },
      });

      // Should still return the string
      expect(result).toBe('Plain string response');
      // No chunks because handler returned string, not TextStreamResult
      expect(chunks).toEqual([]);
    });
  });
});
```