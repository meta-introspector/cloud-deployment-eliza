# 5e8c73c1:packages_client_src_hooks_use-query-hooks.ts:1051-1200

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-query-hooks.ts:1051-1200
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        agentPerspectiveRoomId,
        includeEmbedding
      );
      return (response.data || []).map(mapApiMemoryToClient);
    },
    enabled: !!agentId && !!agentPerspectiveRoomId,
    staleTime: STALE_TIMES.STANDARD,
  });
}

export function useDeleteAgentInternalMemory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<{ agentId: UUID; memoryId: UUID }, Error, { agentId: UUID; memoryId: UUID }>({
    mutationFn: async ({ agentId, memoryId }: { agentId: UUID; memoryId: UUID }) => {
      await getClient().memory.deleteAgentInternalMemory(agentId, memoryId);
      return { agentId, memoryId };
    },
    onSuccess: (_data, variables) => {
      toast({
        title: 'Memory Deleted',
        description: `Agent memory ${variables.memoryId} removed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['agentInternalMemories', variables.agentId] });
      // More specific invalidation if needed:
      // queryClient.invalidateQueries({ queryKey: ['agentInternalMemories', variables.agentId, variables.memoryData?.roomId] });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Memory',
        description: error instanceof Error ? error.message : 'Failed to delete agent memory',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteAllAgentInternalMemories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<
    { agentId: UUID; agentPerspectiveRoomId: UUID },
    Error,
    { agentId: UUID; agentPerspectiveRoomId: UUID }
  >({
    mutationFn: async ({ agentId, agentPerspectiveRoomId }) => {
      await getClient().memory.deleteAllAgentInternalMemories(agentId, agentPerspectiveRoomId);
      return { agentId, agentPerspectiveRoomId };
    },
    onSuccess: (_data, variables) => {
      toast({
        title: 'All Memories Deleted',
        description: `All memories for agent in room perspective ${variables.agentPerspectiveRoomId} cleared.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['agentInternalMemories', variables.agentId, variables.agentPerspectiveRoomId],
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Clearing Memories',
        description: error instanceof Error ? error.message : 'Failed to clear agent memories',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAgentInternalMemory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<
    {
      agentId: UUID;
      memoryId: string;
      response: unknown;
    },
    Error,
    { agentId: UUID; memoryId: UUID; memoryData: Partial<CoreMemory> }
  >({
    mutationFn: async ({ agentId, memoryId, memoryData }) => {
      const response = await getClient().memory.updateAgentInternalMemory(
        agentId,
        memoryId,
        memoryData as Record<string, unknown>
      );
      return { agentId, memoryId, response };
    },
    onSuccess: (_data, variables) => {
      toast({
        title: 'Memory Updated',
        description: `Agent memory ${variables.memoryId} updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['agentInternalMemories', variables.agentId] });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Memory',
        description: error instanceof Error ? error.message : 'Failed to update agent memory',
        variant: 'destructive',
      });
    },
  });
}

// --- Hooks for Servers and Channels (GUI Navigation) ---
export function useServers(options = {}) {
  const network = useNetworkStatus();
  return useQuery<{ data: { servers: ClientMessageServer[] } }>({
    queryKey: ['servers'],
    queryFn: async () => {
      const result = await getClient().messaging.listMessageServers();
      return { data: { servers: mapApiServersToClient(result.messageServers) } };
    },
    staleTime: STALE_TIMES.RARE,
    refetchInterval: !network.isOffline ? STALE_TIMES.RARE : false,
    ...options,
  });
}

export function useChannels(serverId: UUID | undefined, options = {}) {
  const network = useNetworkStatus();
  return useQuery<{ data: { channels: ClientMessageChannel[] } }>({
    queryKey: ['channels', serverId],
    queryFn: async () => {
      if (!serverId) return Promise.resolve({ data: { channels: [] } });
      const result = await getClient().messaging.getMessageServerChannels(serverId);
      return { data: { channels: mapApiChannelsToClient(result.channels) } };
    },
    enabled: !!serverId,
    staleTime: STALE_TIMES.STANDARD,
    refetchInterval: !network.isOffline && !!serverId ? STALE_TIMES.STANDARD : false,
    ...options,
  });
}

export function useChannelDetails(channelId: UUID | undefined, options = {}) {
  // Allow undefined
  const network = useNetworkStatus();
  return useQuery<{ success: boolean; data: ClientMessageChannel | null }>({
    queryKey: ['channelDetails', channelId],
    queryFn: async () => {
      if (!channelId) return Promise.resolve({ success: true, data: null });
      const result = await getClient().messaging.getChannelDetails(channelId);
      return { success: true, data: mapApiChannelToClient(result) };
    },
    enabled: !!channelId,
    staleTime: STALE_TIMES.STANDARD,
    refetchInterval: !network.isOffline && !!channelId ? STALE_TIMES.RARE : false,
    ...options,
```