# 5e8c73c1:packages_core_src___tests___runtime-streaming.test.ts:301-406

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime-streaming.test.ts:301-406
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      expect(contextChunks).toEqual(['A', 'C']);
    });
  });

  describe('handler returns string (no streaming support)', () => {
    it('should return string directly when handler does not support streaming', async () => {
      const chunks: string[] = [];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async () => {
          return 'Plain string response';
        },
        'test-provider'
      );

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

  describe('abort signal', () => {
    it('should stop streaming when abort signal is triggered', async () => {
      const chunks: string[] = [];
      const mockChunks = ['A', 'B', 'C', 'D', 'E'];
      const abortController = new AbortController();

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
          chunks.push(chunk);
          // Abort after receiving 2 chunks
          if (chunks.length === 2) {
            abortController.abort();
          }
        },
        abortSignal: abortController.signal,
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test',
        })
      );

      // Should have stopped after 2 chunks due to abort
      expect(chunks.length).toBe(2);
      expect(chunks).toEqual(['A', 'B']);
      // Result should be partial (only chunks received before abort)
      expect(result).toBe('AB');
    });

    it('should not affect streaming when abort signal is not triggered', async () => {
      const chunks: string[] = [];
      const mockChunks = ['X', 'Y', 'Z'];
      const abortController = new AbortController();

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
          chunks.push(chunk);
        },
        abortSignal: abortController.signal,
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: 'Test',
        })
      );

      // Should receive all chunks since abort was never triggered
      expect(chunks).toEqual(['X', 'Y', 'Z']);
      expect(result).toBe('XYZ');
    });
  });
});
```