# a7046c18:packages_core_typescript_src___tests___messaging-types.test.ts:151-179

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/messaging-types.test.ts:151-179
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      });
    });
  });

  describe("Type safety", () => {
    it("should distinguish between event types", () => {
      // Test that event names can be used as discriminators
      type EventMap = {
        [MESSAGE_STREAM_EVENT.messageStreamChunk]: MessageStreamChunkPayload;
        [MESSAGE_STREAM_EVENT.messageStreamError]: MessageStreamErrorPayload;
      };

      const chunkEvent: keyof EventMap =
        MESSAGE_STREAM_EVENT.messageStreamChunk;
      const errorEvent: keyof EventMap =
        MESSAGE_STREAM_EVENT.messageStreamError;

      expect(chunkEvent).not.toBe(errorEvent);
    });

    it("should allow iteration over event types", () => {
      const eventTypes = Object.values(MESSAGE_STREAM_EVENT);
      expect(eventTypes).toContain("messageStreamChunk");
      expect(eventTypes).toContain("messageStreamError");
      expect(eventTypes).toContain("messageBroadcast");
      expect(eventTypes.length).toBe(3);
    });
  });
});
```