# a69475c0:packages_core_src___tests___runtime-streaming.test.ts:301-362

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/__tests__/runtime-streaming.test.ts:301-362
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

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

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

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