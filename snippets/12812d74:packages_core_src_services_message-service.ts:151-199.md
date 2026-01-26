# 12812d74:packages_core_src_services_message-service.ts:151-199

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/services/message-service.ts:151-199
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```

  /**
   * Determines whether the agent should respond to a message.
   * Uses simple rules for obvious cases (DM, mentions) and defers to LLM for ambiguous cases.
   *
   * @param runtime - The agent runtime instance
   * @param message - The message to evaluate
   * @param room - The room context (optional)
   * @param mentionContext - Platform mention/reply context (optional)
   * @returns Response decision with reasoning
   */
  shouldRespond(
    runtime: IAgentRuntime,
    message: Memory,
    room?: Room,
    mentionContext?: MentionContext
  ): ResponseDecision;

  /**
   * Processes attachments in a message (images, documents, etc.)
   * Generates descriptions for images and extracts text from documents.
   *
   * @param runtime - The agent runtime instance
   * @param attachments - Array of media attachments to process
   * @returns Promise resolving to processed attachments with descriptions
   */
  processAttachments?(runtime: IAgentRuntime, attachments: Media[]): Promise<Media[]>;

  /**
   * Deletes a message from the agent's memory.
   * This method handles the actual deletion logic that was previously in event handlers.
   *
   * @param runtime - The agent runtime instance
   * @param message - The message memory to delete
   * @returns Promise resolving when deletion is complete
   */
  deleteMessage(runtime: IAgentRuntime, message: Memory): Promise<void>;

  /**
   * Clears all messages from a channel/room.
   * This method handles bulk deletion of all message memories in a room.
   *
   * @param runtime - The agent runtime instance
   * @param roomId - The room ID to clear messages from
   * @param channelId - The original channel ID (for logging)
   * @returns Promise resolving when channel is cleared
   */
  clearChannel(runtime: IAgentRuntime, roomId: UUID, channelId: string): Promise<void>;
}
```