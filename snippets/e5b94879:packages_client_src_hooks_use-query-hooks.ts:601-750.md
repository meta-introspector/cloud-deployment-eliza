# e5b94879:packages_client_src_hooks_use-query-hooks.ts:601-750

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:601-750
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
    queryFn: async () => {
      const response = await getClient().agents.getAgentLogs(agentId, {
        limit: 50,
      });
      if (!response) return [];

      // Filter to only include model calls (useModel:*) and actions
      const relevantLogs = response.filter((log) => {
        const logType = log.type || '';
        return logType.startsWith('useModel:') || logType === 'action';
      });

      return relevantLogs.map(mapApiLogToClient);
    },
    refetchInterval: 1000,
    staleTime: 1000,
  });
}

/**
 * Hook to delete an agent log/action.
 * @returns {UseMutationResult} - Object containing the mutation function and its handlers.
 */
export function useDeleteLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ agentId, logId }: { agentId: UUID; logId: UUID }) => {
      await getClient().agents.deleteAgentLog(agentId, logId);
      return { agentId, logId };
    },

    onMutate: async ({ agentId, logId }) => {
      // Optimistically update the UI by removing the log from the cache
      const previousLogs = queryClient.getQueryData(['agentActions', agentId]);

      // Update cache if we have the data
      if (previousLogs) {
        queryClient.setQueryData(['agentActions', agentId], (oldData: unknown) => {
          if (Array.isArray(oldData)) {
            return oldData.filter((log: { id?: string }) => log.id !== logId);
          }
          return oldData;
        });
      }

      return { previousLogs, agentId, logId };
    },

    onSuccess: (_, { agentId }) => {
      // Invalidate relevant queries to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['agentActions', agentId] });

      toast({
        title: 'Log Deleted',
        description: 'The log entry has been successfully removed',
      });
    },

    onError: (error, { agentId }, context) => {
      // Revert the optimistic update on error
      if (context?.previousLogs) {
        queryClient.setQueryData(['agentActions', agentId], context.previousLogs);
      }

      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete log',
        variant: 'destructive',
      });

      // Force invalidate on error to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['agentActions', agentId] });
    },
  });
}

/**
 * Fetches memories for a specific agent, optionally filtered by channel
 */
export function useAgentMemories(
  agentId: UUID,
  tableName?: string,
  channelId?: UUID, // Changed from roomId to channelId
  includeEmbedding = false
) {
  const queryKey = channelId
    ? ['agents', agentId, 'channels', channelId, 'memories', tableName, includeEmbedding] // Updated query key
    : ['agents', agentId, 'memories', tableName, includeEmbedding];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params: Record<string, unknown> = {
        tableName,
        includeEmbedding,
      };
      const result = channelId
        ? await getClient().memory.getRoomMemories(agentId, channelId, params)
        : await getClient().memory.getAgentMemories(agentId, params);
      // Map the API memories to client format
      const memories = result.memories || [];
      return memories.map(mapApiMemoryToClient);
    },
    enabled: Boolean(agentId && tableName),
    staleTime: 1000,
    refetchInterval: 10 * 1000,
  });
}

/**
 * Provides a mutation hook to delete a specific memory entry for an agent.
 *
 * On success, invalidates related agent and room memory queries to ensure data consistency.
 */
export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, memoryId }: { agentId: UUID; memoryId: UUID }) => {
      await getClient().memory.deleteMemory(agentId, memoryId);
      return { agentId, memoryId };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ['agents', data.agentId, 'memories'],
      });

      // Also invalidate room-specific memories
      queryClient.invalidateQueries({
        queryKey: ['agents', data.agentId, 'rooms'],
        predicate: (query) => query.queryKey.length > 3 && query.queryKey[4] === 'memories',
      });
    },
  });
}

/**
 * Hook for deleting all memories associated with a specific agent in a given room.
 *
 * @returns A mutation object for triggering the deletion and tracking its state.
 */
export function useDeleteAllMemories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, roomId }: { agentId: UUID; roomId: UUID }) => {
      await getClient().memory.clearRoomMemories(agentId, roomId);
```