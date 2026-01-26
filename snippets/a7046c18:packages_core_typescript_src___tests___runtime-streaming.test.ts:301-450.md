# a7046c18:packages_core_typescript_src___tests___runtime-streaming.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-streaming.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: "Test",
          onStreamChunk: (chunk: string) => {
            paramsChunks.push(chunk);
          },
        }),
      );

      // Should complete successfully despite error
      expect(result).toBe("ABC");
      // Params callback should receive all chunks
      expect(paramsChunks).toEqual(["A", "B", "C"]);
      // Context callback should receive A and C (B threw)
      expect(contextChunks).toEqual(["A", "C"]);
    });
  });

  describe("handler returns string (no streaming support)", () => {
    it("should return string directly when handler does not support streaming", async () => {
      const chunks: string[] = [];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async () => {
          return "Plain string response";
        },
        "test-provider",
      );

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test",
        onStreamChunk: (chunk: string) => {
          chunks.push(chunk);
        },
      });

      // Should still return the string
      expect(result).toBe("Plain string response");
      // No chunks because handler returned string, not TextStreamResult
      expect(chunks).toEqual([]);
    });
  });

  describe("abort signal", () => {
    it("should stop streaming when abort signal is triggered", async () => {
      const chunks: string[] = [];
      const mockChunks = ["A", "B", "C", "D", "E"];
      const abortController = new AbortController();

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          if (textParams.stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join("");
        },
        "test-provider",
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
          prompt: "Test",
        }),
      );

      // Should have stopped after 2 chunks due to abort
      expect(chunks.length).toBe(2);
      expect(chunks).toEqual(["A", "B"]);
      // Result should be partial (only chunks received before abort)
      expect(result).toBe("AB");
    });

    it("should not affect streaming when abort signal is not triggered", async () => {
      const chunks: string[] = [];
      const mockChunks = ["X", "Y", "Z"];
      const abortController = new AbortController();

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          if (textParams.stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join("");
        },
        "test-provider",
      );

      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          chunks.push(chunk);
        },
        abortSignal: abortController.signal,
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: "Test",
        }),
      );

      // Should receive all chunks since abort was never triggered
      expect(chunks).toEqual(["X", "Y", "Z"]);
      expect(result).toBe("XYZ");
    });
  });

  describe("database logging", () => {
    it("should log streaming model calls to database", async () => {
      const mockChunks = ["Hello", " ", "World"];
      const mockAdapter = createMockAdapter();

      const streamingRuntime = new AgentRuntime({
        agentId: stringToUuid("test-logging-agent"),
        character: mockCharacter,
        adapter: mockAdapter,
      });

      streamingRuntime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          if (textParams.stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join("");
        },
        "test-provider",
      );

      await streamingRuntime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test prompt",
        onStreamChunk: () => {},
```