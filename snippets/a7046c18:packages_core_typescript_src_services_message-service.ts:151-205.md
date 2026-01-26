# a7046c18:packages_core_typescript_src_services_message-service.ts:151-205

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/message-service.ts:151-205
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

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
    mentionContext?: MentionContext,
  ): ResponseDecision;

  /**
   * Processes attachments in a message (images, documents, etc.)
   * Generates descriptions for images and extracts text from documents.
   *
   * @param runtime - The agent runtime instance
   * @param attachments - Array of media attachments to process
   * @returns Promise resolving to processed attachments with descriptions
   */
  processAttachments?(
    runtime: IAgentRuntime,
    attachments: Media[],
  ): Promise<Media[]>;

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
  clearChannel(
    runtime: IAgentRuntime,
    roomId: UUID,
    channelId: string,
  ): Promise<void>;
}
```