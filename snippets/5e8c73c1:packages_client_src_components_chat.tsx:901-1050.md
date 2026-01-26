# 5e8c73c1:packages_client_src_components_chat.tsx:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/chat.tsx:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

    if (!shouldUpdate) {
      return;
    }

    // Guard against undefined channel IDs
    if (!finalChannelIdForHooks || !chatState.currentDmChannelId) {
      clientLogger.warn('Cannot update chat title: missing channel ID');
      return;
    }

    const elizaClient = getElizaClient();
    const data = await elizaClient.messaging.generateChannelTitle(
      finalChannelIdForHooks,
      contextId
    );

    const title = data?.title;
    const participants = await elizaClient.messaging.getChannelParticipants(
      chatState.currentDmChannelId
    );
    if (title && participants) {
      // Handle different possible response formats for participants
      let participantIds = [];
      if (participants && Array.isArray(participants.participants)) {
        participantIds = participants.participants.map((p) => p.userId);
      } else if (participants && Array.isArray(participants)) {
        participantIds = participants.map((p) => p.userId || p.id || p);
      }

      await elizaClient.messaging.updateChannel(finalChannelIdForHooks, {
        name: title,
        participantCentralUserIds: participantIds,
      });

      const currentUserId = getEntityId();
      queryClient.invalidateQueries({
        queryKey: ['dmChannels', contextId, currentUserId],
      });
    }
  };

  const { sendMessage } = useSocketChat({
    channelId: finalChannelIdForHooks,
    currentUserId: currentClientEntityId,
    contextId,
    chatType,
    allAgents,
    messages,
    onAddMessage: (message: UiMessage) => {
      addMessage(message);
      updateChatTitle();
      if (message.isAgent) safeScrollToBottom();
    },
    onUpdateMessage: (messageId: string, updates: Partial<UiMessage>) => {
      updateMessage(messageId as UUID, updates);
      if (!updates.isLoading && updates.isLoading !== undefined) safeScrollToBottom();
    },
    onDeleteMessage: (messageId: string) => {
      removeMessage(messageId as UUID);
    },
    onClearMessages: () => {
      // Clear the local message list immediately for instant UI response
      clearMessages();
    },
    onInputDisabledChange: (disabled: boolean) => updateChatState({ inputDisabled: disabled }),
  });

  const {
    selectedFiles,
    handleFileChange,
    removeFile,
    createBlobUrls,
    uploadFiles,
    cleanupBlobUrls,
    clearFiles,
  } = useFileUpload({
    agentId: targetAgentData?.id,
    channelId: finalChannelIdForHooks,
    chatType,
  });

  // Handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    // For DM chats, ensure we have a channel before sending
    let channelIdToUse = finalChannelIdForHooks;
    if (chatType === ChannelType.DM && !channelIdToUse && targetAgentData?.id) {
      // If a DM channel is already being (auto) created, abort to prevent duplicate creations.
      if (chatState.isCreatingDM || createDmChannelMutation.isPending) {
        clientLogger.info(
          '[Chat] DM channel creation already in progress; will wait for it to finish instead of creating another.'
        );
        // Early return so the user can try sending again once the channel is ready.
        return;
      }

      clientLogger.info('[Chat] No DM channel selected, creating one before sending message');
      try {
        // Mark as auto-created so the effect doesn't attempt a duplicate.
        autoCreatedDmRef.current = true;

        const newChannel = await createDmChannelMutation.mutateAsync({
          agentId: targetAgentData.id,
          channelName: `Chat - ${moment().format('MMM D, HH:mm')}`,
          messageServerId: finalMessageServerIdForHooks,
        });
        updateChatState({ currentDmChannelId: newChannel.id });
        channelIdToUse = newChannel.id;
        // Wait a moment for state to propagate
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        clientLogger.error('[Chat] Failed to create DM channel before sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to create chat channel. Please try again.',
          variant: 'destructive',
        });
        updateChatState({ inputDisabled: false });
        return;
      }
    }

    if (
      (!chatState.input.trim() && selectedFiles.length === 0) ||
      inputDisabledRef.current ||
      !channelIdToUse ||
      !finalMessageServerIdForHooks ||
      !currentClientEntityId ||
      (chatType === ChannelType.DM && !targetAgentData?.id)
    )
      return;

    const tempMessageId = randomUUID() as UUID;
    let messageText = chatState.input.trim();
    const currentInputVal = chatState.input;
    updateChatState({ input: '', inputDisabled: true });
    const currentSelectedFiles = [...selectedFiles];
    clearFiles();
    formRef.current?.reset();
    const optimisticAttachments = createBlobUrls(currentSelectedFiles);
    const optimisticUiMessage: UiMessage = {
```