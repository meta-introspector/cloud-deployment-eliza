# a7046c18:packages_core_typescript_src___tests___utils.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        "(Attachments: [att-1 - Image (http://example.com/img.jpg)], [att-2 - Document (http://example.com/doc.pdf)])",
      );
    });

    it("should filter out messages without entityId", () => {
      // Testing edge case: malformed memory with null entityId
      interface MalformedMemory extends Omit<Memory, "entityId"> {
        entityId: null;
      }
      const malformedMessage: MalformedMemory = {
        id: stringToUuid("msg-1"),
        entityId: null,
        roomId: stringToUuid("room-1"),
        createdAt: Date.now(),
        content: { text: "Should be filtered", source: "chat" } as Content,
      };

      const messages: Memory[] = [
        malformedMessage as Memory,
        {
          id: stringToUuid("msg-2"),
          entityId: stringToUuid("entity-1"),
          roomId: stringToUuid("room-1"),
          createdAt: Date.now(),
          content: { text: "Should appear", source: "chat" } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).not.toContain("Should be filtered");
      expect(result).toContain("Should appear");
    });
  });

  describe("formatPosts", () => {
    const mockEntities: Entity[] = [
      {
        id: stringToUuid("entity-1"),
        names: ["Alice"],
        metadata: {},
        agentId: stringToUuid("agent-1"),
      },
    ];

    it("should format posts grouped by room", () => {
      const roomId = stringToUuid("room-1");
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId: stringToUuid("entity-1"),
          roomId,
          createdAt: Date.now() - 3600000,
          content: {
            text: "First message",
            source: "twitter",
          } as Content,
        },
        {
          id: stringToUuid("msg-2"),
          entityId: stringToUuid("entity-1"),
          roomId,
          createdAt: Date.now(),
          content: {
            text: "Second message",
            source: "twitter",
          } as Content,
        },
      ];

      const result = formatPosts({ messages, entities: mockEntities });

      // formatPosts uses roomId.slice(-5) to show only last 5 chars
      expect(result).toContain(`Conversation: ${roomId.slice(-5)}`);
      expect(result).toContain("Name: Alice");
      expect(result).toContain("First message");
      expect(result).toContain("Second message");
      expect(result).toContain("Source: twitter");
    });

    it("should include reply information", () => {
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId: stringToUuid("entity-1"),
          roomId: stringToUuid("room-1"),
          createdAt: Date.now(),
          content: {
            text: "Reply message",
            inReplyTo: stringToUuid("12345678-1234-1234-1234-123456789012"),
            source: "chat",
          } as Content,
        },
      ];

      const result = formatPosts({ messages, entities: mockEntities });

      expect(result).toContain(
        "In reply to: 12345678-1234-1234-1234-123456789012",
      );
    });

    it("should format without conversation header when specified", () => {
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId: stringToUuid("entity-1"),
          roomId: stringToUuid("room-1"),
          createdAt: Date.now(),
          content: { text: "Message", source: "chat" } as Content,
        },
      ];

      const result = formatPosts({
        messages,
        entities: mockEntities,
        conversationHeader: false,
      });

      expect(result).not.toContain("Conversation:");
    });

    it("should handle missing entity with warning", () => {
      // This tests line 209 - logger.warn when entity not found
      const unknownEntityId = stringToUuid("non-existent-entity");
      const messages: Memory[] = [
        {
          id: stringToUuid("msg-1"),
          entityId: unknownEntityId,
          roomId: stringToUuid("room-1"),
          createdAt: Date.now(),
          content: {
            text: "Message from unknown entity",
            source: "chat",
          } as Content,
        },
      ];

      // Empty entities array to ensure entity is not found
      const result = formatPosts({ messages, entities: [] });

      // Should use "Unknown User" when entity not found
      expect(result).toContain("Unknown User");
      expect(result).toContain("unknown");
      expect(result).toContain(unknownEntityId);
    });

    it("should handle messages without roomId", () => {
      // Testing edge case: malformed memory with null roomId
      interface MalformedMemory extends Omit<Memory, "roomId"> {
```