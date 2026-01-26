# 5e8c73c1:packages_client_src_hooks_use-query-hooks.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-query-hooks.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

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
    queryFn: async () => {
      const response = await getClient().agents.getAgentLogs(agentId, {
        limit: 50,
      });
      // Map the API logs to client format
      return response ? response.map(mapApiLogToClient) : [];
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
      console.log('Agent memories result:', {
        agentId,
        tableName,
        includeEmbedding,
        channelId,
        result,
        dataLength: result.memories?.length,
        firstMemory: result.memories?.[0],
        hasEmbeddings: (result.memories || []).some(
          (m: { embedding?: number[] }) => (m.embedding?.length ?? 0) > 0
        ),
      });
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
```