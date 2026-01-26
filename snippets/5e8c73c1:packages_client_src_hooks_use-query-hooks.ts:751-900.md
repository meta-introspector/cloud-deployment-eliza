# 5e8c73c1:packages_client_src_hooks_use-query-hooks.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-query-hooks.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
```