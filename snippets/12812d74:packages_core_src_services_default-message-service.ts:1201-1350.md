# 12812d74:packages_core_src_services_default-message-service.ts:1201-1350

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:1201-1350
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```

    if (iterationCount >= opts.maxMultiStepIterations) {
      runtime.logger.warn(
        { src: 'service:message', maxIterations: opts.maxMultiStepIterations },
        'Reached maximum iterations, forcing completion'
      );
    }

    accumulatedState = (await runtime.composeState(message, [
      'RECENT_MESSAGES',
      'ACTION_STATE',
    ])) as MultiStepState;
    const summaryPrompt = composePromptFromState({
      state: accumulatedState,
      template: runtime.character.templates?.multiStepSummaryTemplate || multiStepSummaryTemplate,
    });

    // Generate response message ID for the response
    const responseMessageId = asUUID(v4());

    const finalOutput = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt: summaryPrompt,
    });
    const summary = parseKeyValueXml(finalOutput);

    let responseContent: Content | null = null;
    const summaryText = summary?.text;
    if (typeof summaryText === 'string' && summaryText) {
      responseContent = {
        actions: ['MULTI_STEP_SUMMARY'],
        text: summaryText,
        thought: (typeof summary.thought === 'string' ? summary.thought : 'Final user-facing message after task completion.') || 'Final user-facing message after task completion.',
        simple: true,
        messageId: responseMessageId,
      };
    }

    const responseMessages: Memory[] = responseContent
      ? [
          {
            id: responseMessageId,
            entityId: runtime.agentId,
            agentId: runtime.agentId,
            content: responseContent,
            roomId: message.roomId,
            createdAt: Date.now(),
          },
        ]
      : [];

    return {
      responseContent,
      responseMessages,
      state: accumulatedState,
      mode: responseContent ? 'simple' : 'none',
    };
  }

  /**
   * Helper to emit run ended events
   */
  private async emitRunEnded(
    runtime: IAgentRuntime,
    runId: UUID,
    message: Memory,
    startTime: number,
    status: string
  ): Promise<void> {
    await runtime.emitEvent(EventType.RUN_ENDED, {
      runtime,
      source: 'messageHandler',
      runId,
      messageId: message.id,
      roomId: message.roomId,
      entityId: message.entityId,
      startTime,
      status: status as 'completed' | 'timeout',
      endTime: Date.now(),
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
          { src: 'service:message', agentId: runtime.agentId },
          'Cannot delete memory: message ID is missing'
        );
        return;
      }

      runtime.logger.info(
        {
          src: 'service:message',
          agentId: runtime.agentId,
          messageId: message.id,
          roomId: message.roomId,
        },
        'Deleting memory'
      );
      await runtime.deleteMemory(message.id);
      runtime.logger.debug(
        { src: 'service:message', messageId: message.id },
        'Successfully deleted memory'
      );
    } catch (error: unknown) {
      runtime.logger.error(
        { src: 'service:message', agentId: runtime.agentId, error },
        'Error in deleteMessage'
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
  async clearChannel(runtime: IAgentRuntime, roomId: UUID, channelId: string): Promise<void> {
    try {
      runtime.logger.info(
        { src: 'service:message', agentId: runtime.agentId, channelId, roomId },
        'Clearing message memories from channel'
      );

      // Get all message memories for this room
      const memories = await runtime.getMemoriesByRoomIds({
        tableName: 'messages',
        roomIds: [roomId],
      });

      runtime.logger.debug(
        { src: 'service:message', channelId, count: memories.length },
        'Found message memories to delete'
      );

```