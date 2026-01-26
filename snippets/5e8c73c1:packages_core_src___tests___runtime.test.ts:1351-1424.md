# 5e8c73c1:packages_core_src___tests___runtime.test.ts:1351-1424

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:1351-1424
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
              `<response><text>ctx${id}-part1 ctx${id}-part2</text></response>`
            ),
            usage: Promise.resolve(undefined),
            finishReason: Promise.resolve('stop'),
          });
        });

        runtime.registerModel(ModelType.TEXT_LARGE, mockHandler, 'test-provider');

        // Run 3 streaming contexts in parallel
        const [result1, result2, result3] = await Promise.all([
          runWithStreamingContext(
            {
              onStreamChunk: async (chunk: string) => {
                context1Chunks.push(chunk);
              },
            },
            async () => runtime.useModel(ModelType.TEXT_LARGE, { prompt: 'Test 1' })
          ),
          runWithStreamingContext(
            {
              onStreamChunk: async (chunk: string) => {
                context2Chunks.push(chunk);
              },
            },
            async () => runtime.useModel(ModelType.TEXT_LARGE, { prompt: 'Test 2' })
          ),
          runWithStreamingContext(
            {
              onStreamChunk: async (chunk: string) => {
                context3Chunks.push(chunk);
              },
            },
            async () => runtime.useModel(ModelType.TEXT_LARGE, { prompt: 'Test 3' })
          ),
        ]);

        // Each context should have received only its own chunks (extracted from <text> tags)
        const context1Text = context1Chunks.join('');
        const context2Text = context2Chunks.join('');
        const context3Text = context3Chunks.join('');

        // Verify each context got its own unique content
        expect(context1Text).toContain('ctx1-');
        expect(context1Text).not.toContain('ctx2-');
        expect(context1Text).not.toContain('ctx3-');

        expect(context2Text).toContain('ctx2-');
        expect(context2Text).not.toContain('ctx1-');
        expect(context2Text).not.toContain('ctx3-');

        expect(context3Text).toContain('ctx3-');
        expect(context3Text).not.toContain('ctx1-');
        expect(context3Text).not.toContain('ctx2-');

        // All results should be strings (full XML)
        expect(typeof result1).toBe('string');
        expect(typeof result2).toBe('string');
        expect(typeof result3).toBe('string');
      });
    });
  });
}); // End of main describe block
```