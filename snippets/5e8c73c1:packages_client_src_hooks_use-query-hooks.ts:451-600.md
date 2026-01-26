# 5e8c73c1:packages_client_src_hooks_use-query-hooks.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-query-hooks.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  );

  const fetchMessages = useCallback(
    async (beforeTimestamp?: number) => {
      if (!channelId) {
        setMessages([]);
        setInternalIsLoading(false);
        return;
      }
      if (!beforeTimestamp) {
        setInternalIsLoading(true); // Full load
      } else {
        setIsFetchingMore(true);
      }
      setInternalIsError(false);
      setInternalError(null);

      try {
        const response = await getClient().messaging.getChannelMessages(channelId, {
          limit: 30,
          before: beforeTimestamp ? new Date(beforeTimestamp).toISOString() : undefined,
        });

        const newUiMessages = response.messages.map((msg) =>
          mapApiMessageToUi(msg, initialMessageServerId || (msg.metadata?.messageServerId as UUID))
        );

        setMessages((prev) => {
          const combined = beforeTimestamp ? [...newUiMessages, ...prev] : newUiMessages;
          const uniqueMessages = Array.from(
            new Map(combined.map((item) => [item.id, item])).values()
          );
          return uniqueMessages.sort((a, b) => a.createdAt - b.createdAt);
        });

        if (newUiMessages.length > 0) {
          const oldestFetched = Math.min(...newUiMessages.map((m) => m.createdAt));
          if (!beforeTimestamp || oldestFetched < (oldestMessageTimestamp || Infinity)) {
            setOldestMessageTimestamp(oldestFetched);
          }
        }
        setHasMoreMessages(newUiMessages.length >= 30);
      } catch (err) {
        setInternalIsError(true);
        setInternalError(err);
        clientLogger.error(`Failed to fetch messages for channel ${channelId}:`, err);
      } finally {
        setInternalIsLoading(false);
        setIsFetchingMore(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [channelId, transformServerMessageToUiMessage, initialMessageServerId]
  ); // Add initialMessageServerId to deps

  useEffect(() => {
    // Initial fetch when channelId changes or becomes available
    if (channelId) {
      clientLogger.info(
        `[useChannelMessages] ChannelId changed or became available: ${channelId}. Clearing messages and fetching initial set.`
      );
      setMessages([]); // Clear previous messages
      setOldestMessageTimestamp(null);
      setHasMoreMessages(true);
      fetchMessages(); // This will set internalIsLoading to true
    } else {
      clientLogger.info('[useChannelMessages] ChannelId is undefined. Clearing messages.');
      setMessages([]);
      setOldestMessageTimestamp(null);
      setHasMoreMessages(true);
      setInternalIsLoading(false); // No channel, so not loading anything
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, fetchMessages]); // fetchMessages is memoized with useCallback

  const fetchNextPage = async () => {
    if (hasMoreMessages && !isFetchingMore && oldestMessageTimestamp) {
      await fetchMessages(oldestMessageTimestamp - 1); // -1 to avoid fetching the same last message
    }
  };

  // Add method to manually add/update messages from external sources (e.g., WebSocket)
  const addMessage = useCallback((newMessage: UiMessage) => {
    setMessages((prev) => {
      // Check if message already exists
      const existingIndex = prev.findIndex((m) => m.id === newMessage.id);

      if (existingIndex >= 0) {
        // Update existing message
        const updated = [...prev];
        updated[existingIndex] = newMessage;
        return updated.sort((a, b) => a.createdAt - b.createdAt);
      } else {
        // Add new message
        return [...prev, newMessage].sort((a, b) => a.createdAt - b.createdAt);
      }
    });
  }, []);

  // Add method to update a message by ID
  const updateMessage = useCallback((messageId: UUID, updates: Partial<UiMessage>) => {
    setMessages((prev) => {
      return prev.map((m) => {
        if (m.id === messageId) {
          return { ...m, ...updates };
        }
        return m;
      });
    });
  }, []);

  // Add method to remove a message by ID
  const removeMessage = useCallback((messageId: UUID) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  // Add method to clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setOldestMessageTimestamp(null);
    setHasMoreMessages(true);
  }, []);

  // This hook now manages its own state for messages
  // To integrate with React Query for caching of initial load or background updates:
  // One could use useInfiniteQuery, but given the manual state management already here for append/prepend,
  // this simpler useState + manual fetch approach is retained from the original structure of useMessages.
  // For full React Query benefits, `useInfiniteQuery` would be the way to go.

  return {
    data: messages,
    isLoading: internalIsLoading && messages.length === 0, // True only on initial load
    isError: internalIsError,
    error: internalError,
    fetchNextPage,
    hasNextPage: hasMoreMessages,
    isFetchingNextPage: isFetchingMore,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
  };
}

export function useGroupChannelMessages(channelId: UUID | null, initialMessageServerId?: UUID) {
  // This hook now becomes an alias or a slightly specialized version of useChannelMessages
  // if group-specific logic (like different source filtering) isn't handled here.
  // For now, it can directly use useChannelMessages.
  return useChannelMessages(channelId ?? undefined, initialMessageServerId);
}
```