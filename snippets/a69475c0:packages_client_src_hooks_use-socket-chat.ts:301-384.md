# a69475c0:packages_client_src_hooks_use-socket-chat.ts:301-384

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/client/src/hooks/use-socket-chat.ts:301-384
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
        const agent = allAgents.find((a) => a.id === agentId);
        const newUiMsg: UiMessage = {
          id: messageId as UUID,
          text: chunk,
          name: agent?.name || 'Agent',
          senderId: agentId as UUID,
          isAgent: true,
          createdAt: Date.now(),
          channelId: channelId as UUID,
          source: 'streaming',
          isLoading: false,
          isStreaming: true,
        };
        streamingMessages.set(messageId, chunk);
        onAddMessage(newUiMsg);
      } else {
        // Subsequent chunk - update existing message
        const newText = existingText + chunk;
        streamingMessages.set(messageId, newText);
        onUpdateMessage(messageId, { text: newText });
      }
    };

    const msgSub = socketIOManager.evtMessageBroadcast.attach(
      (d: MessageBroadcastData) => (d.channelId || d.roomId) === channelId,
      handleMessageBroadcasting
    );
    const completeSub = socketIOManager.evtMessageComplete.attach(
      (d: MessageCompleteData) => (d.channelId || d.roomId) === channelId,
      handleMessageComplete
    );
    const controlSub = socketIOManager.evtControlMessage.attach(
      (d: ControlMessageData) => (d.channelId || d.roomId) === channelId,
      handleControlMessage
    );
    const deleteSub = socketIOManager.evtMessageDeleted.attach(
      (d: MessageDeletedData) => (d.channelId || d.roomId) === channelId,
      handleMessageDeleted
    );
    const clearSub = socketIOManager.evtChannelCleared.attach(
      (d: ChannelClearedData) => (d.channelId || d.roomId) === channelId,
      handleChannelCleared
    );
    const deletedSub = socketIOManager.evtChannelDeleted.attach(
      (d: ChannelDeletedData) => (d.channelId || d.roomId) === channelId,
      handleChannelDeleted
    );
    const streamSub = socketIOManager.evtMessageStreamChunk.attach(
      (d: StreamChunkData) => d.channelId === channelId,
      handleStreamChunk
    );

    return () => {
      if (channelId) {
        clientLogger.info(
          `[useSocketChat] useEffect cleanup: Leaving channel ${channelId}. Current joinedChannelRef: ${joinedChannelRef.current}`
        );
        socketIOManager.leaveChannel(channelId);
        // Reset ref when component unmounts or channelId changes leading to cleanup
        if (channelId === joinedChannelRef.current) {
          joinedChannelRef.current = null;
          clientLogger.info(
            `[useSocketChat] useEffect cleanup: Reset joinedChannelRef for ${channelId}`
          );
        }
        // Clear streaming state, timeouts, and seen IDs for this channel
        streamingMessagesRef.current.clear();
        // Clear all pending timeouts to prevent memory leaks
        streamTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        streamTimeoutsRef.current.clear();
        seenMessageIdsRef.current.clear();
      }
      detachSubscriptions([msgSub, completeSub, controlSub, deleteSub, clearSub, deletedSub, streamSub]);
    };

    function detachSubscriptions(subscriptions: Array<{ detach: () => void } | undefined>) {
      subscriptions.forEach((sub) => sub?.detach());
    }
  }, [channelId, currentUserId, socketIOManager]);

  return {
    sendMessage,
  };
}
```