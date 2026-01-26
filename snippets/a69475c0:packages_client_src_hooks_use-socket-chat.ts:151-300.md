# a69475c0:packages_client_src_hooks_use-socket-chat.ts:151-300

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/client/src/hooks/use-socket-chat.ts:151-300
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
          isLoading: false,
          createdAt:
            typeof data.createdAt === 'number' ? data.createdAt : Date.parse(data.createdAt),
          text: data.text,
          attachments: data.attachments,
          isAgent: false,
        });
      } else {
        const streamingMessages = streamingMessagesRef.current;

        // Check if this message was being streamed
        if (data.id && streamingMessages.has(data.id)) {
          clientLogger.info('[useSocketChat] Completing streamed message by ID:', data.id);
          streamingMessages.delete(data.id);
          // Clear timeout since stream completed normally
          const streamTimeouts = streamTimeoutsRef.current;
          const timeout = streamTimeouts.get(data.id);
          if (timeout) {
            clearTimeout(timeout);
            streamTimeouts.delete(data.id);
          }
          onUpdateMessage(data.id, {
            text: data.text,
            thought: data.thought,
            actions: data.actions,
            attachments: data.attachments,
            isStreaming: false,
            prompt: data.prompt,
            rawMessage: data.rawMessage,
          });
          return;
        }

        // Add new message from other participants
        const messageId = data.id || randomUUID();
        const newUiMsg: UiMessage = {
          id: messageId as UUID,
          text: data.text,
          name: data.senderName,
          senderId: data.senderId as UUID,
          isAgent: isTargetAgent,
          createdAt:
            typeof data.createdAt === 'number' ? data.createdAt : Date.parse(data.createdAt),
          channelId: (data.channelId || data.roomId) as UUID,
          serverId: data.serverId as UUID | undefined,
          source: data.source,
          attachments: data.attachments,
          thought: data.thought,
          actions: data.actions,
          isLoading: false,
          prompt: data.prompt,
          rawMessage: data.rawMessage,
        };

        // Use ref to track seen message IDs (avoids stale closure with React state)
        const seenIds = seenMessageIdsRef.current;
        const alreadySeen = seenIds.has(messageId);

        clientLogger.info('[useSocketChat] Processing message:', messageId, 'alreadySeen:', alreadySeen, 'source:', data.source);

        if (data.source === 'agent_action' && data.id) {
          // For action messages, we receive multiple broadcasts (executing -> completed)
          if (alreadySeen) {
            // Update existing action message with new status
            clientLogger.info('[useSocketChat] Updating action message:', data.id, 'actionStatus:', (data.rawMessage as { actionStatus?: string })?.actionStatus);
            onUpdateMessage(data.id, {
              text: data.text,
              thought: data.thought,
              actions: data.actions,
              attachments: data.attachments,
              rawMessage: data.rawMessage,
            });
          } else {
            // First time seeing this action message
            clientLogger.info('[useSocketChat] Adding new action message:', data.id);
            seenIds.add(messageId);
            onAddMessage(newUiMsg);
          }
        } else {
          // Regular messages - only add if not seen
          if (!alreadySeen) {
            clientLogger.info('[useSocketChat] Adding new message:', messageId);
            seenIds.add(messageId);
            onAddMessage(newUiMsg);
          }
        }
      }
    };

    const handleMessageComplete = (data: MessageCompleteData) => {
      const completeChannelId = data.channelId || data.roomId;
      if (completeChannelId === channelId) onInputDisabledChange(false);
    };

    const handleControlMessage = (data: ControlMessageData) => {
      const ctrlChannelId = data.channelId || data.roomId;
      if (ctrlChannelId === channelId) {
        if (data.action === 'disable_input') onInputDisabledChange(true);
        else if (data.action === 'enable_input') onInputDisabledChange(false);
      }
    };

    const handleMessageDeleted = (data: MessageDeletedData) => {
      const deletedChannelId = data.channelId || data.roomId;
      if (deletedChannelId === channelId && data.messageId) {
        onDeleteMessage(data.messageId);
      }
    };

    const handleChannelCleared = (data: ChannelClearedData) => {
      const clearedChannelId = data.channelId || data.roomId;
      if (clearedChannelId === channelId) {
        onClearMessages();
      }
    };

    const handleChannelDeleted = (data: ChannelDeletedData) => {
      const deletedChannelId = data.channelId || data.roomId;
      if (deletedChannelId === channelId) {
        onClearMessages();
      }
    };

    const handleStreamChunk = (data: StreamChunkData) => {
      if (data.channelId !== channelId) return;

      const { messageId, chunk, agentId } = data;
      const streamingMessages = streamingMessagesRef.current;
      const streamTimeouts = streamTimeoutsRef.current;

      // Clear existing timeout for this message and set a new one
      const existingTimeout = streamTimeouts.get(messageId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set timeout to mark stream as complete if no more chunks arrive
      const timeout = setTimeout(() => {
        clientLogger.warn(`[useSocketChat] Stream timeout for message ${messageId}`);
        streamingMessages.delete(messageId);
        streamTimeouts.delete(messageId);
        onUpdateMessage(messageId, { isStreaming: false });
      }, STREAM_TIMEOUT_MS);
      streamTimeouts.set(messageId, timeout);

      // Check if we already have this message being streamed
      const existingText = streamingMessages.get(messageId);

      if (existingText === undefined) {
        // First chunk - create placeholder message
```