# a69475c0:packages_core_src_services_default-message-service.ts:151-300

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:151-300
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      }
      const agentResponses = latestResponseIds.get(runtime.agentId);
      if (!agentResponses) throw new Error('Agent responses map not found');

      const previousResponseId = agentResponses.get(message.roomId);
      if (previousResponseId) {
        logger.debug(
          { src: 'service:message', roomId: message.roomId, previousResponseId, responseId },
          'Updating response ID'
        );
      }
      agentResponses.set(message.roomId, responseId);

      // Start run tracking with roomId for proper log association
      const runId: UUID = runtime.startRun(message.roomId)!;
      const startTime = Date.now();

      // Emit run started event
      await runtime.emitEvent(EventType.RUN_STARTED, {
        runtime,
        source: 'messageHandler',
        runId,
        messageId: message.id,
        roomId: message.roomId,
        entityId: message.entityId,
        startTime,
        status: 'started',
      } as RunEventPayload);

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(async () => {
          await runtime.emitEvent(EventType.RUN_TIMEOUT, {
            runtime,
            source: 'messageHandler',
            runId,
            messageId: message.id,
            roomId: message.roomId,
            entityId: message.entityId,
            startTime,
            status: 'timeout',
            endTime: Date.now(),
            duration: Date.now() - startTime,
            error: 'Run exceeded timeout',
          } as RunEventPayload);
          reject(new Error('Run exceeded timeout'));
        }, opts.timeoutDuration);
      });

      // Wrap processing with streaming context for automatic streaming in useModel calls
      // Use ResponseStreamExtractor to filter XML and only stream <text> (if REPLY) or <message>
      let streamingContext: { onStreamChunk: (chunk: string, messageId?: UUID) => Promise<void>; messageId?: UUID } | undefined;
      if (opts.onStreamChunk) {
        const extractor = new ResponseStreamExtractor();
        streamingContext = {
          onStreamChunk: async (chunk: string, msgId?: UUID) => {
            if (extractor.done) return;
            const textToStream = extractor.push(chunk);
            if (textToStream) {
              await opts.onStreamChunk!(textToStream, msgId);
            }
          },
          messageId: responseId,
        };
      }

      const processingPromise = runWithStreamingContext(streamingContext, () =>
        this.processMessage(
          runtime,
          message,
          callback,
          responseId,
          runId,
          startTime,
          opts
        )
      );

      const result = await Promise.race([processingPromise, timeoutPromise]);

      // Clean up timeout
      clearTimeout(timeoutId);

      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Internal message processing implementation
   */
  private async processMessage(
    runtime: IAgentRuntime,
    message: Memory,
    callback: HandlerCallback | undefined,
    responseId: UUID,
    runId: UUID,
    startTime: number,
    opts: ResolvedMessageOptions
  ): Promise<MessageProcessingResult> {
    try {
      const agentResponses = latestResponseIds.get(runtime.agentId);
      if (!agentResponses) throw new Error('Agent responses map not found');

      // Skip messages from self
      if (message.entityId === runtime.agentId) {
        runtime.logger.debug(
          { src: 'service:message', agentId: runtime.agentId },
          'Skipping message from self'
        );
        await this.emitRunEnded(runtime, runId, message, startTime, 'self');
        return {
          didRespond: false,
          responseContent: null,
          responseMessages: [],
          state: { values: {}, data: {}, text: '' } as State,
          mode: 'none',
        };
      }

      runtime.logger.debug(
        {
          src: 'service:message',
          messagePreview: truncateToCompleteSentence(message.content.text || '', 50),
        },
        'Processing message'
      );

      // Save the incoming message to memory
      runtime.logger.debug({ src: 'service:message' }, 'Saving message to memory');
      let memoryToQueue: Memory;

      if (message.id) {
        const existingMemory = await runtime.getMemoryById(message.id);
        if (existingMemory) {
          runtime.logger.debug(
            { src: 'service:message' },
            'Memory already exists, skipping creation'
          );
          memoryToQueue = existingMemory;
        } else {
          const createdMemoryId = await runtime.createMemory(message, 'messages');
          memoryToQueue = { ...message, id: createdMemoryId };
        }
        await runtime.queueEmbeddingGeneration(memoryToQueue, 'high');
      } else {
        const memoryId = await runtime.createMemory(message, 'messages');
        message.id = memoryId;
        memoryToQueue = { ...message, id: memoryId };
        await runtime.queueEmbeddingGeneration(memoryToQueue, 'normal');
```