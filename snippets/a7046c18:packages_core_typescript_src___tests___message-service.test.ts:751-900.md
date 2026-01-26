# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      await messageService.clearChannel(
        mockRuntime as IAgentRuntime,
        roomId,
        channelId,
      );

      expect(mockGetMemories).toHaveBeenCalled();
      expect(mockDeleteMemory).not.toHaveBeenCalled();
    });

    it("should continue clearing even if individual deletions fail", async () => {
      const roomId = "123e4567-e89b-12d3-a456-426614174070" as UUID;
      const channelId = "partial-fail-channel";

      const mockMemories: Memory[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174071" as UUID,
          content: { text: "Message 1" } as Content,
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          createdAt: Date.now(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174072" as UUID,
          content: { text: "Message 2" } as Content,
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          createdAt: Date.now(),
        },
      ];

      let callCount = 0;
      const mockDeleteMemory = mock(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error("First deletion failed");
        }
      });

      mockRuntime.getMemoriesByRoomIds = mock(async () => mockMemories);
      mockRuntime.deleteMemory = mockDeleteMemory;

      await messageService.clearChannel(
        mockRuntime as IAgentRuntime,
        roomId,
        channelId,
      );

      // Should have attempted to delete both messages
      expect(mockDeleteMemory).toHaveBeenCalledTimes(2);
      // Should have logged warning for the failed deletion
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.warn).toHaveBeenCalled();
        // Should have logged success for partial completion
        expect(mockRuntime.logger.info).toHaveBeenCalled();
      }
    });

    it("should skip memories without IDs", async () => {
      const roomId = "123e4567-e89b-12d3-a456-426614174080" as UUID;
      const channelId = "no-id-channel";

      const mockMemories: Memory[] = [
        {
          content: { text: "Message without ID" } as Content,
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          createdAt: Date.now(),
        } as Memory,
      ];

      const mockGetMemories = mock(async () => mockMemories);
      const mockDeleteMemory = mock(async () => {});

      mockRuntime.getMemoriesByRoomIds = mockGetMemories;
      mockRuntime.deleteMemory = mockDeleteMemory;

      await messageService.clearChannel(
        mockRuntime as IAgentRuntime,
        roomId,
        channelId,
      );

      // Should not attempt to delete memories without IDs
      expect(mockDeleteMemory).not.toHaveBeenCalled();
    });
  });

  describe("parsedXml type safety", () => {
    it("should handle non-string thought/text values in logging without crashing", async () => {
      // Setup a message
      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174200" as UUID,
        content: {
          text: "Test message",
          source: "test",
          channelType: ChannelType.API,
        } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        createdAt: Date.now(),
      };

      // Mock useModel to return XML where thought/text are objects (empty tags become {})
      (mockRuntime.useModel = mock(
        async (
          modelType: (typeof ModelType)[keyof typeof ModelType],
          params: unknown,
        ) => {
          if (modelType === ModelType.TEXT_SMALL) {
            return "<response><action>REPLY</action><reason>User asked a question</reason></response>";
          }
          // Return XML with empty tags that parseKeyValueXml will parse as {} instead of strings
          const responseText =
            "<response><thought></thought><actions>REPLY</actions><text></text></response>";
          const textParams = params as GenerateTextParams;
          if (textParams?.stream) {
            return {
              textStream: (async function* () {
                yield responseText;
              })(),
              text: Promise.resolve(responseText),
              usage: Promise.resolve({
                promptTokens: 10,
                completionTokens: 5,
                totalTokens: 15,
              }),
            };
          }
          return responseText;
        },
      )),
        // Add required mocks for the message processing flow
        (mockRuntime.emitEvent = mock(async () => {}));
      mockRuntime.getRoom = mock(async () => ({
        id: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        name: "Test Room",
        source: "test",
        type: ChannelType.API,
        channelId: "test-channel",
        worldId: "123e4567-e89b-12d3-a456-426614174099" as UUID,
      }));

      // The test passes if no error is thrown during message processing
      // This validates that the type guards prevent .substring() from being called on non-strings
```