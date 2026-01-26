# e5b94879:packages_client_src_components_chat.tsx:1051-1200

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/chat.tsx:1051-1200
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
            ),
          });
        cleanupBlobUrls(blobUrls);
        if (!messageText.trim() && processedUiAttachments.length > 0)
          messageText = `Shared ${processedUiAttachments.length} file(s).`;
      }
      const mediaInfosFromText = parseMediaFromText(currentInputVal);
      const textMediaAttachments: Media[] = mediaInfosFromText.map(
        (media: MediaInfo, index: number): Media => ({
          id: `textmedia-${tempMessageId}-${index}`,
          url: media.url,
          title: media.type === 'image' ? 'Image' : media.type === 'video' ? 'Video' : 'Media Link',
          source: 'user_input_url',
          contentType:
            media.type === 'image'
              ? CoreContentType.IMAGE
              : media.type === 'video'
                ? CoreContentType.VIDEO
                : undefined,
        })
      );
      const finalAttachments = [...processedUiAttachments, ...textMediaAttachments];
      const finalTextContent =
        messageText || (finalAttachments.length > 0 ? `Shared content.` : '');
      if (!finalTextContent.trim() && finalAttachments.length === 0) {
        updateChatState({ inputDisabled: false });
        removeMessage(tempMessageId);
        return;
      }
      await sendMessage(finalTextContent, {
        attachments: finalAttachments.length > 0 ? finalAttachments : undefined,
        messageId: tempMessageId,
        source: chatType === ChannelType.DM ? CHAT_SOURCE : GROUP_CHAT_SOURCE,
        skipOptimisticUpdate: true,
        overrideChannelId: channelIdToUse,
      });
    } catch (error) {
      clientLogger.error('Error sending message or uploading files:', error);
      toast({
        title: 'Error Sending Message',
        description: error instanceof Error ? error.message : 'Could not send message.',
        variant: 'destructive',
      });
      updateMessage(tempMessageId, {
        isLoading: false,
        text: `${optimisticUiMessage.text || 'Attachment(s)'} (Failed to send)`,
      });
      // Re-enable input on error
      updateChatState({ inputDisabled: false });
    } finally {
      // Let the server control input state via control messages
      // Only focus the input, don't re-enable it
      inputRef.current?.focus();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!finalChannelIdForHooks || !messageId) return;
    const validMessageId = validateUuid(messageId);
    if (validMessageId) {
      // Immediately remove message from UI for optimistic update
      removeMessage(messageId as UUID);
      // Call server mutation to delete on backend
      deleteMessageCentral({ channelId: finalChannelIdForHooks, messageId: validMessageId });
    }
  };

  const handleRetryMessage = async (message: UiMessage) => {
    if (inputDisabledRef.current || (!message.text?.trim() && message.attachments?.length === 0)) {
      return;
    }
    updateChatState({ inputDisabled: true });
    const retryMessageId = randomUUID() as UUID;
    const finalTextContent =
      message.text?.trim() || `Shared ${message.attachments?.length} file(s).`;

    const optimisticUiMessage: UiMessage = {
      id: retryMessageId,
      text: message.text,
      name: USER_NAME,
      createdAt: Date.now(),
      senderId: currentClientEntityId,
      isAgent: false,
      isLoading: true,
      channelId: message.channelId,
      messageServerId: finalMessageServerIdForHooks,
      source: chatType === ChannelType.DM ? CHAT_SOURCE : GROUP_CHAT_SOURCE,
      attachments: message.attachments,
    };

    addMessage(optimisticUiMessage);
    safeScrollToBottom();

    // Guard against undefined IDs
    if (!finalMessageServerIdForHooks || !finalChannelIdForHooks) {
      clientLogger.error('Cannot retry message: missing server or channel ID');
      toast({
        title: 'Error Sending Message',
        description: 'Missing required channel information.',
        variant: 'destructive',
      });
      updateChatState({ inputDisabled: false });
      removeMessage(retryMessageId);
      return;
    }

    try {
      await sendMessage(finalTextContent, {
        attachments: message.attachments,
        messageId: retryMessageId,
        source: chatType === ChannelType.DM ? CHAT_SOURCE : GROUP_CHAT_SOURCE,
        skipOptimisticUpdate: true,
        overrideChannelId: finalChannelIdForHooks,
      });
    } catch (error) {
      clientLogger.error('Error sending message or uploading files:', error);
      toast({
        title: 'Error Sending Message',
        description: error instanceof Error ? error.message : 'Could not send message.',
        variant: 'destructive',
      });
      updateMessage(retryMessageId, {
        isLoading: false,
        text: `${optimisticUiMessage.text || 'Attachment(s)'} (Failed to send)`,
      });
      updateChatState({ inputDisabled: false });
    }
  };

  const handleClearChat = () => {
    if (!finalChannelIdForHooks) return;
    const confirmMessage =
      chatType === ChannelType.DM
        ? `Clear all messages in this chat with ${targetAgentData?.name}?`
        : 'Clear all messages in this group chat?';

    confirm(
      {
        title: 'Clear Chat',
        description: `${confirmMessage} This action cannot be undone.`,
        confirmText: 'Clear',
        variant: 'destructive',
      },
      () => {
        clearMessagesCentral(finalChannelIdForHooks);
      }
    );
  };

  // Handle mobile detection and window resize
```