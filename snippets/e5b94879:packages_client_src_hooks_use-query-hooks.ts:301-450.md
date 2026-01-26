# e5b94879:packages_client_src_hooks_use-query-hooks.ts:301-450

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:301-450
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
      return { data: { message: `Agent ${result.status}` } };
    },
    onMutate: async (agentId) => {
      // Optimistically update the UI
      // Get the agent data from the cache
      const agent = queryClient.getQueryData<Agent>(['agent', agentId]);

      if (agent) {
        toast({
          title: 'Stopping Agent',
          description: `Stopping ${agent.name}...`,
        });
      }
    },
    onSuccess: (response, agentId) => {
      // Immediately invalidate the queries for fresh data
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });

      toast({
        title: 'Agent Stopped',
        description: response?.data?.message || 'The agent has been successfully stopped',
      });
    },
    onError: (error, agentId) => {
      // Force invalidate on error
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });

      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to stop agent',
        variant: 'destructive',
      });
    },
  });
}

// Re-export UiMessage from types for backwards compatibility
export type { UiMessage } from '@/types';

/**
 * Custom hook to manage fetching and loading messages for a specific channel.
 * @param {UUID | undefined} channelId - The GLOBAL ID of the channel.
 * @returns {{...
}} An object containing messages data, loading states, etc.
 */
export function useChannelMessages(
  channelId: UUID | undefined, // Changed from UUID | null
  initialMessageServerId?: UUID | undefined // Changed from UUID (optional was already undefined)
): {
  data: UiMessage[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  fetchNextPage: () => Promise<void>; // Simplified pagination trigger
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  addMessage: (newMessage: UiMessage) => void;
  updateMessage: (messageId: UUID, updates: Partial<UiMessage>) => void;
  removeMessage: (messageId: UUID) => void;
  clearMessages: () => void;
} {
  const currentClientCentralId = getEntityId(); // Central ID of the currently logged-in user

  // Using a more manual approach for pagination with getChannelMessages
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<number | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [internalIsLoading, setInternalIsLoading] = useState<boolean>(true); // Start true
  const [internalIsError, setInternalIsError] = useState<boolean>(false);
  const [internalError, setInternalError] = useState<unknown>(null);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

  const transformServerMessageToUiMessage = useCallback(
    (sm: ServerMessage, serverIdToUse?: UUID): UiMessage => {
      const isAgent = sm.authorId !== currentClientCentralId;
      let timestamp = Date.now(); // Default to now

      if (typeof sm.createdAt === 'number') {
        timestamp = sm.createdAt;
      } else if (typeof sm.createdAt === 'string') {
        const parsedTs = Date.parse(sm.createdAt); // Try direct parse
        if (!isNaN(parsedTs)) {
          timestamp = parsedTs;
        } else {
          // If direct parse fails, try moment (if available and robust)
          // For now, log a warning if it's an unparsable string not handled by Date.parse
          clientLogger.warn(
            '[transformServerMessageToUiMessage] createdAt string was not directly parsable by Date.parse():',
            sm.createdAt,
            'for message id:',
            sm.id
          );
          // As a fallback, could try new Date(sm.createdAt).getTime(), but Date.parse is usually sufficient
          // Defaulting to Date.now() if unparsable to avoid NaN
        }
      } else if (sm.createdAt) {
        // If it's not a number or string, but exists (e.g. could be a Date object from some contexts)
        // Attempt to convert. This is less likely if types are strict from server.
        try {
          const dateObjTimestamp = new Date(sm.createdAt as string | number | Date).getTime();
          if (!isNaN(dateObjTimestamp)) {
            timestamp = dateObjTimestamp;
          }
        } catch (e) {
          clientLogger.warn(
            '[transformServerMessageToUiMessage] Could not process createdAt (unknown type):',
            sm.createdAt,
            'for message:',
            sm.id
          );
        }
      }

      return {
        id: sm.id,
        text: sm.content,
        name: isAgent
          ? sm.metadata?.agentName ||
            sm.metadata?.authorDisplayName ||
            sm.authorDisplayName ||
            'Agent'
          : USER_NAME,
        senderId: sm.authorId,
        isAgent: isAgent,
        createdAt: timestamp,
        attachments: (sm.metadata?.attachments as Media[]) || [],
        thought: isAgent ? sm.metadata?.thought : undefined,
        actions: isAgent ? sm.metadata?.actions : undefined,
        channelId: sm.channelId,
        messageServerId: serverIdToUse || sm.metadata?.messageServerId || initialMessageServerId,
        source: sm.sourceType,
        isLoading: false,
        prompt: isAgent ? sm.metadata?.prompt : undefined,
      };
    },
    [currentClientCentralId, initialMessageServerId]
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
```