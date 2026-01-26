# a7046c18:packages_core_typescript_src_services_default-message-service.ts:1651-1761

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:1651-1761
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      duration: Date.now() - startTime,
    } as RunEventPayload);
  }

  /**
   * Deletes a message from the agent's memory.
   * This method handles the actual deletion logic that was previously in event handlers.
   *
   * @param runtime - The agent runtime instance
   * @param message - The message memory to delete
   * @returns Promise resolving when deletion is complete
   */
  async deleteMessage(runtime: IAgentRuntime, message: Memory): Promise<void> {
    try {
      if (!message.id) {
        runtime.logger.error(
          { src: "service:message", agentId: runtime.agentId },
          "Cannot delete memory: message ID is missing",
        );
        return;
      }

      runtime.logger.info(
        {
          src: "service:message",
          agentId: runtime.agentId,
          messageId: message.id,
          roomId: message.roomId,
        },
        "Deleting memory",
      );
      await runtime.deleteMemory(message.id);
      runtime.logger.debug(
        { src: "service:message", messageId: message.id },
        "Successfully deleted memory",
      );
    } catch (error: unknown) {
      runtime.logger.error(
        { src: "service:message", agentId: runtime.agentId, error },
        "Error in deleteMessage",
      );
      throw error;
    }
  }

  /**
   * Clears all messages from a channel/room.
   * This method handles bulk deletion of all message memories in a room.
   *
   * @param runtime - The agent runtime instance
   * @param roomId - The room ID to clear messages from
   * @param channelId - The original channel ID (for logging)
   * @returns Promise resolving when channel is cleared
   */
  async clearChannel(
    runtime: IAgentRuntime,
    roomId: UUID,
    channelId: string,
  ): Promise<void> {
    try {
      runtime.logger.info(
        { src: "service:message", agentId: runtime.agentId, channelId, roomId },
        "Clearing message memories from channel",
      );

      // Get all message memories for this room
      const memories = await runtime.getMemoriesByRoomIds({
        tableName: "messages",
        roomIds: [roomId],
      });

      runtime.logger.debug(
        { src: "service:message", channelId, count: memories.length },
        "Found message memories to delete",
      );

      // Delete each message memory
      let deletedCount = 0;
      for (const memory of memories) {
        if (memory.id) {
          try {
            await runtime.deleteMemory(memory.id);
            deletedCount++;
          } catch (error) {
            runtime.logger.warn(
              { src: "service:message", error, memoryId: memory.id },
              "Failed to delete message memory",
            );
          }
        }
      }

      runtime.logger.info(
        {
          src: "service:message",
          agentId: runtime.agentId,
          channelId,
          deletedCount,
          totalCount: memories.length,
        },
        "Cleared message memories from channel",
      );
    } catch (error: unknown) {
      runtime.logger.error(
        { src: "service:message", agentId: runtime.agentId, error },
        "Error in clearChannel",
      );
      throw error;
    }
  }
}
```