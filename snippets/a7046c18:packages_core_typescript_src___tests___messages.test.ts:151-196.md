# a7046c18:packages_core_typescript_src___tests___messages.test.ts:151-196

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/messages.test.ts:151-196
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        },
      ];

      const formatted = formatMessages({
        messages: messagesWithUnknownUser,
        entities: mockEntities,
      });
      expect(formatted).toContain("Unknown User: Test message");
    });

    it("should handle messages with no action", () => {
      const messagesWithoutAction: Memory[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174016" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174009" as UUID,
          entityId: mockEntities[0].id as UUID,
          createdAt: Date.now(),
          content: { text: "Simple message" } as Content,
          agentId: "123e4567-e89b-12d3-a456-426614174001",
        },
      ];

      const formatted = formatMessages({
        messages: messagesWithoutAction,
        entities: mockEntities,
      });
      expect(formatted).not.toContain("()");
      expect(formatted).toContain("Simple message");
    });

    it("should handle empty messages array", () => {
      const formatted = formatMessages({
        messages: [],
        entities: mockEntities,
      });
      expect(formatted).toBe("");
    });
  });

  describe("formatTimestamp", () => {
    it("should handle exact time boundaries", () => {
      const now = Date.now();
      expect(formatTimestamp(now)).toContain("just now");
    });
  });
});
```