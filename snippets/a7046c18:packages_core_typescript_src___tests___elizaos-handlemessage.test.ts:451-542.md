# a7046c18:packages_core_typescript_src___tests___elizaos-handlemessage.test.ts:451-542

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos-handlemessage.test.ts:451-542
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Test",
          // No source provided
        },
      });

      const callArgs = ensureConnectionMock.mock.calls[0][0];
      expect(callArgs.source).toBe("unknown");
    });

    it("should handle metadata in message", async () => {
      const result = await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Test",
          source: "discord",
        },
        metadata: {
          type: "message",
          customField: "custom value",
        },
      });

      expect(result.userMessage.metadata).toBeDefined();
      expect((result.userMessage.metadata as any).customField).toBe(
        "custom value",
      );
    });

    it("should throw error if agent not found", async () => {
      const fakeAgentId = "999e4567-e89b-12d3-a456-426614174999" as UUID;

      await expect(
        elizaOS.handleMessage(fakeAgentId, {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Test",
            source: "test",
          },
        }),
      ).rejects.toThrow("Agent 999e4567-e89b-12d3-a456-426614174999 not found");
    });

    it("should throw error if messageService is not initialized", async () => {
      const runtime = elizaOS.getAgent(agentId);
      if (runtime) {
        runtime.messageService = null;
      }

      await expect(
        elizaOS.handleMessage(agentId, {
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
          content: {
            text: "Test",
            source: "test",
          },
        }),
      ).rejects.toThrow("messageService is not initialized on runtime");
    });

    it("should preserve content structure with attachments", async () => {
      const result = await elizaOS.handleMessage(agentId, {
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        content: {
          text: "Check this image",
          source: "discord",
          attachments: [
            {
              id: "image.png",
              url: "https://example.com/image.png",
              contentType: "image/png" as any,
              title: "Test Image",
            },
          ],
        },
      });

      expect(result.userMessage.content.attachments).toBeDefined();
      expect(result.userMessage.content.attachments).toHaveLength(1);
      expect(result.userMessage.content.attachments?.[0].url).toBe(
        "https://example.com/image.png",
      );
    });
  });
});
```