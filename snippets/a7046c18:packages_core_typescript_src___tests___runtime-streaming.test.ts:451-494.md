# a7046c18:packages_core_typescript_src___tests___runtime-streaming.test.ts:451-494

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-streaming.test.ts:451-494
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      });

      // Verify adapter.log was called
      const logCalls = (mockAdapter.log as ReturnType<typeof mock>).mock.calls;
      expect(logCalls.length).toBeGreaterThan(0);

      // Verify the log contains correct model info
      const logCall = logCalls[0][0];
      expect(logCall.type).toBe("useModel:TEXT_LARGE");
      expect(logCall.body.modelKey).toBe("TEXT_LARGE");
      expect(logCall.body.response).toBe("Hello World");
    });

    it("should log non-streaming model calls to database", async () => {
      const mockAdapter = createMockAdapter();

      const nonStreamingRuntime = new AgentRuntime({
        agentId: stringToUuid("test-logging-agent-2"),
        character: mockCharacter,
        adapter: mockAdapter,
      });

      nonStreamingRuntime.registerModel(
        ModelType.TEXT_LARGE,
        async () => "Non-streamed response",
        "test-provider",
      );

      await nonStreamingRuntime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test prompt",
      });

      // Verify adapter.log was called
      const logCalls = (mockAdapter.log as ReturnType<typeof mock>).mock.calls;
      expect(logCalls.length).toBeGreaterThan(0);

      // Verify the log contains correct model info
      const logCall = logCalls[0][0];
      expect(logCall.type).toBe("useModel:TEXT_LARGE");
      expect(logCall.body.modelKey).toBe("TEXT_LARGE");
      expect(logCall.body.response).toBe("Non-streamed response");
    });
  });
});
```