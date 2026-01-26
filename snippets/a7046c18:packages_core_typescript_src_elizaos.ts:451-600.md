# a7046c18:packages_core_typescript_src_elizaos.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/elizaos.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @example
   * // Serverless mode with runtime directly (no registry lookup)
   * const [runtime] = await elizaOS.addAgents([config], { ephemeral: true, autoStart: true, returnRuntimes: true });
   * const result = await elizaOS.handleMessage(runtime, {
   *   entityId: user.id,
   *   roomId: room.id,
   *   content: { text: "Hello", source: 'web' }
   * });
   *
   * @example
   * // ASYNC mode (WebSocket, MessageBus)
   * await elizaOS.handleMessage(agentId, {
   *   entityId: user.id,
   *   roomId: room.id,
   *   content: { text: "Hello", source: 'websocket' }
   * }, {
   *   onResponse: async (response) => {
   *     await socket.emit('message', response.text);
   *   }
   * });
   */
  async handleMessage(
    target: UUID | IAgentRuntime,
    message: Partial<Memory> & {
      entityId: UUID;
      roomId: UUID;
      content: Content;
      worldId?: UUID;
    },
    options?: HandleMessageOptions,
  ): Promise<HandleMessageResult> {
    // 1. Resolve the runtime (UUID → lookup, runtime → direct)
    let runtime: IAgentRuntime | undefined;
    let agentId: UUID;

    if (typeof target === "string") {
      // Target is UUID, lookup in registry
      agentId = target as UUID;
      runtime = this.runtimes.get(agentId);
      if (!runtime) {
        throw new Error(`Agent ${agentId} not found in registry`);
      }
    } else {
      // Target is runtime instance (serverless pattern)
      runtime = target;
      agentId = runtime.agentId;
    }

    // 2. Verify messageService exists
    if (!runtime.messageService) {
      throw new Error("messageService is not initialized on runtime");
    }

    // 3. Auto-fill missing fields
    const messageId = message.id || (uuidv4() as UUID);
    const userMessage: Memory = {
      ...message,
      id: messageId,
      agentId: message.agentId || runtime.agentId,
      createdAt: message.createdAt || Date.now(),
      entityId: message.entityId,
      roomId: message.roomId,
      content: message.content,
    } as Memory;

    // 4. Ensure connection exists
    await runtime.ensureConnection({
      entityId: userMessage.entityId,
      roomId: userMessage.roomId,
      worldId: message.worldId || userMessage.roomId,
      source: userMessage.content.source || "unknown",
      channelId: userMessage.roomId,
    });

    // 5. Extract processing options (includes streaming callback)
    const processingOptions: MessageProcessingOptions = {
      maxRetries: options?.maxRetries,
      timeoutDuration: options?.timeoutDuration,
      useMultiStep: options?.useMultiStep,
      maxMultiStepIterations: options?.maxMultiStepIterations,
      onStreamChunk: options?.onStreamChunk,
    };

    // 6. Helper to wrap message handling with Entity RLS context if available
    const handleMessageWithEntityContext = async <T>(
      handler: () => Promise<T>,
    ): Promise<T> => {
      if (runtime.withEntityContext) {
        return await runtime.withEntityContext(userMessage.entityId, handler);
      } else {
        return await handler();
      }
    };

    // 7. Determine mode: async or sync
    const isAsyncMode = !!options?.onResponse;

    if (isAsyncMode) {
      // ========== ASYNC MODE ==========
      // Fire and forget with callback

      const callback = async (content: Content) => {
        try {
          if (options.onResponse) {
            await options.onResponse(content);
          }
        } catch (error) {
          if (options.onError) {
            await options.onError(
              error instanceof Error ? error : new Error(String(error)),
            );
          }
        }
        return [];
      };

      // Wrap message handling with Entity RLS context
      const messagePromise = runtime.messageService?.handleMessage(
        runtime,
        userMessage,
        callback,
        processingOptions,
      );
      if (!messagePromise) {
        throw new Error("Message service not available");
      }
      handleMessageWithEntityContext(() => messagePromise)
        .then(() => {
          if (options.onComplete) options.onComplete();
        })
        .catch((error: Error) => {
          if (options.onError) options.onError(error);
        });

      // Emit event for tracking
      this.dispatchEvent(
        new CustomEvent("message:sent", {
          detail: { agentId, messageId, mode: "async" },
        }),
      );

      return { messageId, userMessage };
    } else {
      // ========== SYNC MODE ==========
      // Wait for response

      const messagePromise = runtime.messageService?.handleMessage(
        runtime,
        userMessage,
        undefined,
```