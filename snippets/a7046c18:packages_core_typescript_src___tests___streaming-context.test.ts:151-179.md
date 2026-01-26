# a7046c18:packages_core_typescript_src___tests___streaming-context.test.ts:151-179

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/streaming-context.test.ts:151-179
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          expect(getStreamingContext()?.messageId).toBe("inner");
        });

        // Back to outer context
        expect(getStreamingContext()?.messageId).toBe("outer");
      });
    });
  });

  describe("NoopContextManager", () => {
    it("should return undefined when no manager is configured", () => {
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