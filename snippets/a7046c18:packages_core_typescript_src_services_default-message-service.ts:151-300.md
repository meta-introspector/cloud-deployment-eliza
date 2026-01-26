# a7046c18:packages_core_typescript_src_services_default-message-service.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        "Message received",
      );

      // Track this response ID
      if (!latestResponseIds.has(runtime.agentId)) {
        latestResponseIds.set(runtime.agentId, new Map<string, string>());
      }
      const agentResponses = latestResponseIds.get(runtime.agentId);
      if (!agentResponses) throw new Error("Agent responses map not found");
      // After the check above, agentResponses is guaranteed to exist
      const agentResponsesMap = agentResponses;

      const previousResponseId = agentResponsesMap.get(message.roomId);
      if (previousResponseId) {
        logger.debug(
          {
            src: "service:message",
            roomId: message.roomId,
            previousResponseId,
            responseId,
          },
          "Updating response ID",
        );
      }
      agentResponsesMap.set(message.roomId, responseId);

      // Start run tracking with roomId for proper log association
      const runId: UUID = runtime.startRun(message.roomId)!;
      const startTime = Date.now();

      // Emit run started event
      await runtime.emitEvent(EventType.RUN_STARTED, {
        runtime,
        source: "messageHandler",
        runId,
        messageId: message.id,
        roomId: message.roomId,
        entityId: message.entityId,
        startTime,
        status: "started",
      } as RunEventPayload);

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(async () => {
          await runtime.emitEvent(EventType.RUN_TIMEOUT, {
            runtime,
            source: "messageHandler",
            runId,
            messageId: message.id,
            roomId: message.roomId,
            entityId: message.entityId,
            startTime,
            status: "timeout",
            endTime: Date.now(),
            duration: Date.now() - startTime,
            error: "Run exceeded timeout",
          } as RunEventPayload);
          reject(new Error("Run exceeded timeout"));
        }, opts.timeoutDuration);
      });

      // Wrap processing with streaming context for automatic streaming in useModel calls
      // Use ResponseStreamExtractor to filter XML and only stream <text> (if REPLY) or <message>
      let streamingContext:
        | {
            onStreamChunk: (chunk: string, messageId?: UUID) => Promise<void>;
            messageId?: UUID;
          }
        | undefined;
      if (opts.onStreamChunk) {
        const extractor = new ResponseStreamExtractor();
        const onStreamChunk = opts.onStreamChunk;
        streamingContext = {
          onStreamChunk: async (chunk: string, msgId?: UUID) => {
            if (extractor.done) return;
            const textToStream = extractor.push(chunk);
            if (textToStream) {
              await onStreamChunk(textToStream, msgId);
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
          opts,
        ),
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
    opts: ResolvedMessageOptions,
  ): Promise<MessageProcessingResult> {
    try {
      const agentResponses = latestResponseIds.get(runtime.agentId);
      if (!agentResponses) throw new Error("Agent responses map not found");

      // Skip messages from self
      if (message.entityId === runtime.agentId) {
        runtime.logger.debug(
          { src: "service:message", agentId: runtime.agentId },
          "Skipping message from self",
        );
        await this.emitRunEnded(runtime, runId, message, startTime, "self");
        return {
          didRespond: false,
          responseContent: null,
          responseMessages: [],
          state: { values: {}, data: {}, text: "" } as State,
          mode: "none",
        };
      }

      runtime.logger.debug(
        {
          src: "service:message",
          messagePreview: truncateToCompleteSentence(
            message.content.text || "",
            50,
          ),
        },
        "Processing message",
      );

```