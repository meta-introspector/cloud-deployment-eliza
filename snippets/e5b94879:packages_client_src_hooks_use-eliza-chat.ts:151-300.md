# e5b94879:packages_client_src_hooks_use-eliza-chat.ts:151-300

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-eliza-chat.ts:151-300
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```

  const handleClearMessages = useCallback(() => {
    internalClearMessages();
    onMessagesCleared?.();
  }, [internalClearMessages, onMessagesCleared]);

  const handleInputDisabledChange = useCallback(
    (disabled: boolean) => {
      setInputDisabled(disabled);
      onInputDisabledChange?.(disabled);
    },
    [onInputDisabledChange]
  );

  // Detect if agent is currently typing (streaming)
  const isTyping = useMemo(() => messages.some((m) => m.isStreaming), [messages]);

  // Derive contextId - agentId for DM, channelId for GROUP
  const contextId = agentId ?? channelId;

  // WebSocket transport
  const { sendMessage: socketSend } = useSocketChat({
    channelId,
    currentUserId,
    contextId,
    chatType,
    allAgents,
    messages,
    onAddMessage: handleAddMessage,
    onUpdateMessage: (id, updates) => handleUpdateMessage(id as UUID, updates),
    onDeleteMessage: (id) => handleRemoveMessage(id as UUID),
    onClearMessages: handleClearMessages,
    onInputDisabledChange: handleInputDisabledChange,
  });

  // SSE transport
  const {
    sendMessage: sseSend,
    isStreaming: sseIsStreaming,
    inputDisabled: sseInputDisabled,
    stopStreaming,
  } = useSSEChat({
    sessionId,
    agentId,
    serverId,
    channelId,
    onAddMessage: handleAddMessage,
    onUpdateMessage: (id, updates) => handleUpdateMessage(id as UUID, updates),
  });

  // HTTP transport
  const {
    sendMessage: httpSend,
    isLoading: httpIsLoading,
    inputDisabled: httpInputDisabled,
  } = useHTTPChat({
    sessionId,
    agentId,
    serverId,
    channelId,
    onAddMessage: handleAddMessage,
    onUpdateMessage: (id, updates) => handleUpdateMessage(id as UUID, updates),
  });

  /**
   * Send a message through the configured transport.
   *
   * @param text - Message text
   * @param options - Optional advanced options
   * @param options.attachments - Media attachments
   * @param options.messageId - Use existing message ID (skip optimistic update creation)
   * @param options.source - Message source identifier (default: 'client')
   * @param options.skipOptimisticUpdate - Don't create optimistic message (caller handles it)
   * @param options.overrideChannelId - Override the channel ID for this message
   */
  const sendMessage = useCallback(
    async (
      text: string,
      options?: {
        attachments?: Media[];
        messageId?: UUID;
        source?: string;
        skipOptimisticUpdate?: boolean;
        overrideChannelId?: UUID;
      }
    ) => {
      if (!text.trim() && !options?.attachments?.length) return;

      const {
        attachments,
        messageId,
        source = 'client',
        skipOptimisticUpdate = false,
        overrideChannelId,
      } = options || {};

      try {
        if (transport === 'sse') {
          if (!sessionId) {
            throw new Error('sessionId is required for SSE transport');
          }
          await sseSend(text, attachments);
        } else if (transport === 'http') {
          if (!sessionId) {
            throw new Error('sessionId is required for HTTP transport');
          }
          await httpSend(text, attachments);
        } else {
          // Default: websocket
          const targetChannelId = overrideChannelId ?? channelId;
          if (!targetChannelId) return;

          const tempId = messageId ?? randomUUID();

          // Optimistic UI update (unless caller handles it)
          if (!skipOptimisticUpdate && !messageId) {
            const optimisticMessage: UiMessage = {
              id: tempId,
              text,
              name: USER_NAME,
              senderId: currentUserId as UUID,
              isAgent: false,
              createdAt: Date.now(),
              channelId: targetChannelId,
              serverId,
              isLoading: true,
              attachments,
            };
            handleAddMessage(optimisticMessage);
          }

          // Send via socket
          await socketSend(text, serverId, source, attachments, tempId, undefined, targetChannelId);
        }
      } catch (error) {
        console.error('[useElizaChat] Error sending message:', error);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    },
    [
      transport,
      sessionId,
      channelId,
      serverId,
      currentUserId,
      socketSend,
      sseSend,
      httpSend,
      handleAddMessage,
      onError,
```