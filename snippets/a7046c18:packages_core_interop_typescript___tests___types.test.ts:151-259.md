# a7046c18:packages_core_interop_typescript___tests___types.test.ts:151-259

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/types.test.ts:151-259
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          values: { count: 1 },
        },
      };

      expect(response.type).toBe("action.result");
      expect(response.result.success).toBe(true);
      expect(response.result.text).toBe("Action completed");
    });

    test("should create valid ProviderGetRequest", () => {
      const request: ProviderGetRequest = {
        type: "provider.get",
        id: "req-456",
        provider: "TEST_PROVIDER",
        memory: {
          id: "mem-2",
          content: { text: "Query" },
        } as any,
        state: {
          text: "State",
          values: {},
        } as any,
      };

      expect(request.type).toBe("provider.get");
      expect(request.provider).toBe("TEST_PROVIDER");
    });

    test("should create valid ProviderResultResponse", () => {
      const response: ProviderResultResponse = {
        type: "provider.result",
        id: "req-456",
        result: {
          text: "Provider context",
          values: { key: "value" },
          data: { nested: { data: true } },
        },
      };

      expect(response.type).toBe("provider.result");
      expect(response.result.text).toBe("Provider context");
    });

    test("should serialize IPC messages to JSON", () => {
      const request: ActionInvokeRequest = {
        type: "action.invoke",
        id: "req-789",
        action: "SERIALIZE_TEST",
        memory: { content: { text: "test" } } as any,
        state: null,
        options: null,
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json) as ActionInvokeRequest;

      expect(parsed.type).toBe("action.invoke");
      expect(parsed.action).toBe("SERIALIZE_TEST");
      expect(parsed.id).toBe("req-789");
    });
  });

  describe("ActionManifest", () => {
    test("should validate action with examples", () => {
      const action: ActionManifest = {
        name: "EXAMPLE_ACTION",
        description: "An action with examples",
        similes: ["DO_THING", "PERFORM_ACTION"],
        examples: [
          [
            {
              name: "user",
              content: {
                text: "Do the thing",
              },
            },
            {
              name: "agent",
              content: {
                text: "Done!",
                actions: ["EXAMPLE_ACTION"],
              },
            },
          ],
        ],
      };

      expect(action.name).toBe("EXAMPLE_ACTION");
      expect(action.examples && action.examples.length).toBe(1);
      expect(action.examples && action.examples[0] && action.examples[0].length).toBe(2);
    });
  });

  describe("ProviderManifest", () => {
    test("should validate provider with all options", () => {
      const provider: ProviderManifest = {
        name: "FULL_PROVIDER",
        description: "A provider with all options",
        dynamic: true,
        position: 5,
        private: true,
      };

      expect(provider.dynamic).toBe(true);
      expect(provider.position).toBe(5);
      expect(provider.private).toBe(true);
    });
  });
});
```