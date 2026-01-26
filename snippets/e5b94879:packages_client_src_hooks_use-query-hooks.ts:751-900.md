# e5b94879:packages_client_src_hooks_use-query-hooks.ts:751-900

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:751-900
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
      return { agentId };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ['agents', data.agentId, 'memories'],
      });
    },
  });
}

/**
 * Updates a specific memory entry for an agent.
 *
 * Triggers cache invalidation for related agent and room memories, as well as messages, to ensure data consistency. Displays a toast notification on success or error.
 *
 * @returns A mutation object for updating an agent's memory entry.
 */
export function useUpdateMemory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      agentId,
      memoryId,
      memoryData,
    }: {
      agentId: UUID;
      memoryId: UUID;
      memoryData: Partial<Memory>;
    }) => {
      const result = await getClient().memory.updateMemory(
        agentId,
        memoryId,
        memoryData as Record<string, unknown>
      );
      return { agentId, memoryId, result };
    },

    onSuccess: (data) => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ['agents', data.agentId, 'memories'],
      });

      // Also invalidate room-specific memories if we have roomId in the memory data
      if (data.result?.roomId) {
        queryClient.invalidateQueries({
          queryKey: ['agents', data.agentId, 'rooms', data.result.roomId, 'memories'],
        });
      } else {
        // Otherwise invalidate all room memories for this agent
        queryClient.invalidateQueries({
          queryKey: ['agents', data.agentId, 'rooms'],
          predicate: (query) => query.queryKey.length > 3 && query.queryKey[4] === 'memories',
        });
      }

      // Also invalidate regular messages queries
      if (data.result?.roomId) {
        queryClient.invalidateQueries({
          queryKey: ['messages', data.agentId, data.result.roomId],
        });
      }

      toast({
        title: 'Memory Updated',
        description: 'The memory has been successfully updated',
      });
    },

    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update memory',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteGroupMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serverId, memoryId }: { serverId: UUID; memoryId: UUID }) => {
      await getClient().messaging.deleteMessage(serverId, memoryId);
      return { serverId };
    },
    onSuccess: ({ serverId }) => {
      queryClient.invalidateQueries({ queryKey: ['groupmessages', serverId] });
    },
  });
}

export function useClearGroupChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serverId: UUID) => {
      await getClient().messaging.clearChannelHistory(serverId);
      return { serverId };
    },
    onSuccess: ({ serverId }) => {
      queryClient.invalidateQueries({ queryKey: ['groupmessages', serverId] });
    },
  });
}

// REMOVED: useRooms - Client should use channels, not rooms
// Rooms are an agent-only abstraction

// Hook for fetching agent panels (public GET routes)
/**
 * Custom hook to fetch public GET routes (panels) for a specific agent.
 * @param {UUID | undefined | null} agentId - The ID of the agent.
 * @param {object} options - Optional TanStack Query options.
 * @returns {QueryResult} The result of the query containing agent panels.
 */
export type AgentPanel = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export function useAgentPanels(agentId: UUID | undefined | null, options = {}) {
  const network = useNetworkStatus();

  return useQuery<{
    success: boolean;
    data: AgentPanel[];
    error?: { code: string; message: string; details?: string };
  }>({
    queryKey: ['agentPanels', agentId],
    queryFn: async () => {
      if (!agentId) throw new Error('Agent ID required');
      const result = await getClient().agents.getAgentPanels(agentId);
      return { success: true, data: result.panels };
    },
    enabled: Boolean(agentId),
    staleTime: STALE_TIMES.STANDARD, // Panels are unlikely to change very frequently
    refetchInterval: !network.isOffline && Boolean(agentId) ? STALE_TIMES.RARE : false,
    refetchIntervalInBackground: false,
    ...(!network.isOffline &&
      network.effectiveType === 'slow-2g' && {
        refetchInterval: STALE_TIMES.NEVER, // Or even disable for slow connections
      }),
    ...options,
```