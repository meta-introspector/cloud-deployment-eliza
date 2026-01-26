# dd338745:packages_core_src___tests___streaming-context.test.ts:151-178

**Commit:** dd338745cb075f0766fb7dc04df0f2cb018bd06e
**Author:** standujar
**Date:** Tue Dec 16 02:41:08 2025 +0100
**File:** packages/core/src/__tests__/streaming-context.test.ts:151-178
**Novelty Score:** 18.06
**Concepts:** rag-system, testing

```
        });

        // Back to outer context
        expect(getStreamingContext()?.messageId).toBe('outer');
      });
    });
  });

  describe('NoopContextManager', () => {
    it('should return undefined when no manager is configured', () => {
      // Use a noop manager
      const noopManager: IStreamingContextManager = {
        run: <T>(_ctx: StreamingContext | undefined, fn: () => T) => fn(),
        active: () => undefined,
      };
      setStreamingContextManager(noopManager);

      const context: StreamingContext = {
        onStreamChunk: async () => {},
      };

      runWithStreamingContext(context, () => {
        // Even with context passed, noop manager returns undefined
        expect(getStreamingContext()).toBeUndefined();
      });
    });
  });
});
```