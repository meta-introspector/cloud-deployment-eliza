# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:1501-1606

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:1501-1606
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        expect(callArgs[1].stream).toBe(true);
      });

      it("should isolate streaming contexts in parallel calls (AsyncLocalStorage)", async () => {
        // Configure the streaming context manager for Node.js environment
        const { setStreamingContextManager } = await import(
          "../streaming-context"
        );
        const { createNodeStreamingContextManager } = await import(
          "../streaming-context.node"
        );
        setStreamingContextManager(createNodeStreamingContextManager());

        const { runWithStreamingContext } = await import(
          "../streaming-context"
        );

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
              await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async delay
              yield `part1 ctx${id}-part2</text></response>`;
            })(),
            text: Promise.resolve(
              `<response><text>ctx${id}-part1 ctx${id}-part2</text></response>`,
            ),
            usage: Promise.resolve(undefined),
            finishReason: Promise.resolve("stop"),
          });
        });

        runtime.registerModel(
          ModelType.TEXT_LARGE,
          mockHandler,
          "test-provider",
        );

        // Run 3 streaming contexts in parallel
        const [result1, result2, result3] = await Promise.all([
          runWithStreamingContext(
            {
              onStreamChunk: async (chunk: string) => {
                context1Chunks.push(chunk);
              },
            },
            async () =>
              runtime.useModel(ModelType.TEXT_LARGE, { prompt: "Test 1" }),
          ),
          runWithStreamingContext(
            {
              onStreamChunk: async (chunk: string) => {
                context2Chunks.push(chunk);
              },
            },
            async () =>
              runtime.useModel(ModelType.TEXT_LARGE, { prompt: "Test 2" }),
          ),
          runWithStreamingContext(
            {
              onStreamChunk: async (chunk: string) => {
                context3Chunks.push(chunk);
              },
            },
            async () =>
              runtime.useModel(ModelType.TEXT_LARGE, { prompt: "Test 3" }),
          ),
        ]);

        // Each context should have received only its own chunks (extracted from <text> tags)
        const context1Text = context1Chunks.join("");
        const context2Text = context2Chunks.join("");
        const context3Text = context3Chunks.join("");

        // Verify each context got its own unique content
        expect(context1Text).toContain("ctx1-");
        expect(context1Text).not.toContain("ctx2-");
        expect(context1Text).not.toContain("ctx3-");

        expect(context2Text).toContain("ctx2-");
        expect(context2Text).not.toContain("ctx1-");
        expect(context2Text).not.toContain("ctx3-");

        expect(context3Text).toContain("ctx3-");
        expect(context3Text).not.toContain("ctx1-");
        expect(context3Text).not.toContain("ctx2-");

        // All results should be strings (full XML)
        expect(typeof result1).toBe("string");
        expect(typeof result2).toBe("string");
        expect(typeof result3).toBe("string");
      });
    });
  });
}); // End of main describe block
```