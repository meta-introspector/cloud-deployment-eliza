# a7046c18:packages_core_typescript_src___tests___runtime-streaming.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-streaming.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          const textParams = params as GenerateTextParams;
          streamRequested = textParams.stream === true;
          return "Non-streamed result";
        },
        "test-provider",
      );

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test",
        stream: false,
        onStreamChunk: (chunk: string) => {
          chunks.push(chunk);
        },
      });

      expect(result).toBe("Non-streamed result");
      expect(streamRequested).toBe(false);
      expect(chunks).toEqual([]); // No chunks received
    });

    it("should not stream when stream: false even with context callback", async () => {
      let streamRequested = false;
      const contextChunks: string[] = [];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          streamRequested = textParams.stream === true;
          return "Non-streamed result";
        },
        "test-provider",
      );

      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          contextChunks.push(chunk);
        },
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: "Test",
          stream: false,
        }),
      );

      expect(result).toBe("Non-streamed result");
      expect(streamRequested).toBe(false);
      expect(contextChunks).toEqual([]);
    });
  });

  describe("context streaming", () => {
    it("should stream to context callback when inside runWithStreamingContext", async () => {
      const contextChunks: string[] = [];
      const mockChunks = ["Context", " ", "streaming"];

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
          contextChunks.push(chunk);
        },
        messageId: stringToUuid("test-msg"),
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: "Test",
        }),
      );

      expect(result).toBe("Context streaming");
      expect(contextChunks).toEqual(mockChunks);
    });
  });

  describe("broadcast to both callbacks", () => {
    it("should send chunks to both params and context callbacks", async () => {
      const paramsChunks: string[] = [];
      const contextChunks: string[] = [];
      const mockChunks = ["Broadcast", " ", "test"];

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
          contextChunks.push(chunk);
        },
      };

      const result = await runWithStreamingContext(context, () =>
        runtime.useModel(ModelType.TEXT_LARGE, {
          prompt: "Test",
          onStreamChunk: (chunk: string) => {
            paramsChunks.push(chunk);
          },
        }),
      );

      expect(result).toBe("Broadcast test");
      expect(paramsChunks).toEqual(mockChunks);
      expect(contextChunks).toEqual(mockChunks);
    });

    it("should continue streaming if one callback throws", async () => {
      const paramsChunks: string[] = [];
      const contextChunks: string[] = [];
      const mockChunks = ["A", "B", "C"];

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
          if (chunk === "B") {
            throw new Error("Context callback error");
          }
          contextChunks.push(chunk);
        },
```