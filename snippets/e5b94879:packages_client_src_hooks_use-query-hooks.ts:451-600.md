# e5b94879:packages_client_src_hooks_use-query-hooks.ts:451-600

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:451-600
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
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

// Hook for fetching agent actions
/**
 * Custom hook to fetch agent actions for a specific agent and room.
 * @param {UUID} agentId - The ID of the agent.
 * @param {UUID} roomId - The ID of the room.
 * @param {string[]} excludeTypes - Optional array of types to exclude from results.
 * @returns {QueryResult} The result of the query containing agent actions.
 */
export function useAgentActions(agentId: UUID, roomId?: UUID, excludeTypes?: string[]) {
  return useQuery({
    queryKey: ['agentActions', agentId, roomId, excludeTypes],
```