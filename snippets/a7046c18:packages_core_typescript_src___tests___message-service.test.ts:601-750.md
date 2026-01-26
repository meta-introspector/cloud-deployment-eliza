# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      };

      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        agentMessage,
        mockCallback,
      );

      // Should still process but might skip certain logic
      expect(result).toBeDefined();
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message memory by ID", async () => {
      const mockDeleteMemory = mock(async () => {});
      mockRuntime.deleteMemory = mockDeleteMemory;

      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174040" as UUID,
        content: { text: "Message to delete" } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      await messageService.deleteMessage(mockRuntime as IAgentRuntime, message);

      expect(mockDeleteMemory).toHaveBeenCalledWith(message.id);
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.info).toHaveBeenCalled();
      }
    });

    it("should handle missing message ID gracefully", async () => {
      const mockDeleteMemory = mock(async () => {});
      mockRuntime.deleteMemory = mockDeleteMemory;

      const messageWithoutId: Memory = {
        content: { text: "Message without ID" } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      } as Memory;

      await messageService.deleteMessage(
        mockRuntime as IAgentRuntime,
        messageWithoutId,
      );

      expect(mockDeleteMemory).not.toHaveBeenCalled();
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.error).toHaveBeenCalledWith(
          { src: "service:message", agentId: mockRuntime.agentId },
          "Cannot delete memory: message ID is missing",
        );
      }
    });

    it("should handle deletion errors and re-throw", async () => {
      const deleteError = new Error("Database deletion failed");
      const mockDeleteMemory = mock(async () => {
        throw deleteError;
      });
      mockRuntime.deleteMemory = mockDeleteMemory;

      const message: Memory = {
        id: "123e4567-e89b-12d3-a456-426614174041" as UUID,
        content: { text: "Message to delete" } as Content,
        entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
        roomId: "123e4567-e89b-12d3-a456-426614174002" as UUID,
        agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
        createdAt: Date.now(),
      };

      await expect(
        messageService.deleteMessage(mockRuntime as IAgentRuntime, message),
      ).rejects.toThrow("Database deletion failed");

      if (mockRuntime.logger) {
        expect(mockRuntime.logger.error).toHaveBeenCalled();
      }
    });
  });

  describe("clearChannel", () => {
    it("should clear all messages from a channel", async () => {
      const roomId = "123e4567-e89b-12d3-a456-426614174050" as UUID;
      const channelId = "test-channel-123";

      const mockMemories: Memory[] = [
        {
          id: "123e4567-e89b-12d3-a456-426614174051" as UUID,
          content: { text: "Message 1" } as Content,
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          createdAt: Date.now(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174052" as UUID,
          content: { text: "Message 2" } as Content,
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          createdAt: Date.now(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174053" as UUID,
          content: { text: "Message 3" } as Content,
          entityId: "123e4567-e89b-12d3-a456-426614174005" as UUID,
          roomId,
          agentId: "123e4567-e89b-12d3-a456-426614174001" as UUID,
          createdAt: Date.now(),
        },
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

      expect(mockGetMemories).toHaveBeenCalledWith({
        tableName: "messages",
        roomIds: [roomId],
      });
      expect(mockDeleteMemory).toHaveBeenCalledTimes(3);
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.info).toHaveBeenCalled();
      }
    });

    it("should handle empty channel gracefully", async () => {
      const roomId = "123e4567-e89b-12d3-a456-426614174060" as UUID;
      const channelId = "empty-channel";

      const mockGetMemories = mock(async () => []);
      const mockDeleteMemory = mock(async () => {});

      mockRuntime.getMemoriesByRoomIds = mockGetMemories;
      mockRuntime.deleteMemory = mockDeleteMemory;
```