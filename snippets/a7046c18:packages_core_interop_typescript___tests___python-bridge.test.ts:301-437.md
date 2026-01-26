# a7046c18:packages_core_interop_typescript___tests___python-bridge.test.ts:301-437

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/python-bridge.test.ts:301-437
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      expect(ids.size).toBe(100);
    });
  });

  describe("Timeout Handling", () => {
    test("should track pending requests", async () => {
      const pending = new Map<
        string,
        { resolve: Function; reject: Function }
      >();

      // Simulate request
      const requestId = "test-request";
      const promise = new Promise((resolve, reject) => {
        pending.set(requestId, { resolve, reject });
      });

      expect(pending.has(requestId)).toBe(true);

      // Simulate response
      const pendingReq = pending.get(requestId);
      pending.delete(requestId);
      pendingReq?.resolve({ success: true });

      expect(pending.has(requestId)).toBe(false);

      const result = await promise;
      expect(result).toEqual({ success: true });
    });
  });

  describe("Error Handling", () => {
    test("should handle malformed JSON", () => {
      const invalidJson = '{ type: "error", }';

      expect(() => JSON.parse(invalidJson)).toThrow();
    });

    test("should handle missing required fields", () => {
      const incompleteResponse = { type: "action.result" };
      // Missing id and result - should be validated at runtime

      expect(incompleteResponse.type).toBe("action.result");
      expect((incompleteResponse as any).result).toBeUndefined();
    });

    test("should format error responses correctly", () => {
      const errorResponse = {
        type: "error",
        id: "req-error",
        error: "Action failed",
        details: {
          traceback: "Line 1\nLine 2\n",
          exception_type: "ValueError",
        },
      };

      const json = JSON.stringify(errorResponse);
      const parsed = JSON.parse(json);

      expect(parsed.type).toBe("error");
      expect(parsed.error).toBe("Action failed");
      expect(parsed.details.exception_type).toBe("ValueError");
    });
  });

  describe("Complex Data Types", () => {
    test("should handle nested objects in memory", () => {
      const memory = {
        id: "mem-complex",
        content: {
          text: "Complex message",
          data: {
            nested: {
              deeply: {
                value: "found",
              },
            },
            array: [1, 2, 3, { key: "value" }],
          },
        },
      };

      const request: ActionInvokeRequest = {
        type: "action.invoke",
        id: "complex-req",
        action: "PROCESS",
        memory: memory as any,
        state: null,
        options: null,
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json);

      expect(parsed.memory.content.data.nested.deeply.value).toBe("found");
      expect(parsed.memory.content.data.array[3].key).toBe("value");
    });

    test("should handle Unicode in messages", () => {
      const request = {
        type: "action.invoke",
        id: "unicode-req",
        action: "GREET",
        memory: {
          content: {
            text: "Hello 世界! 🌍 مرحبا שָׁלוֹם",
          },
        },
        state: null,
        options: null,
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json);

      expect(parsed.memory.content.text).toBe("Hello 世界! 🌍 مرحبا שָׁלוֹם");
    });

    test("should handle large payloads", () => {
      const largeData = "x".repeat(100000);

      const request = {
        type: "action.invoke",
        action: "PROCESS_LARGE",
        memory: { content: { text: largeData } },
      };

      const json = JSON.stringify(request);
      expect(json.length).toBeGreaterThan(100000);

      const parsed = JSON.parse(json);
      expect(parsed.memory.content.text.length).toBe(100000);
    });
  });
});
```