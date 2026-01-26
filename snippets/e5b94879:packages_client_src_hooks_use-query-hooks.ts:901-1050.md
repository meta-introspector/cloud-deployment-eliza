# e5b94879:packages_client_src_hooks_use-query-hooks.ts:901-1050

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:901-1050
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
  });
}

/**
 * Custom hook that combines useAgents with individual useAgent calls for detailed data
 * @returns {AgentsWithDetailsResult} Combined query results with both list and detailed data
 */
interface AgentsWithDetailsResult {
  data: {
    agents: Agent[];
  };
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

/**
 * Fetches a list of agents with detailed information for each agent in parallel.
 *
 * Combines the agent list from {@link useAgents} with individual agent detail queries using `useQueries`, aggregating loading and error states. Polling intervals adapt to network conditions.
 *
 * @returns An object containing detailed agent data, loading and error states, and any encountered error.
 */
export function useAgentsWithDetails(): AgentsWithDetailsResult {
  const network = useNetworkStatus();
  const { data: agentsData, isLoading: isAgentsLoading } = useAgents();
  const agentIds = agentsData?.data?.agents?.map((agent) => agent.id as UUID) || [];

  // Use useQueries for parallel fetching
  const agentQueries = useQueries<UseQueryResult<{ data: Agent }, Error>[]>({
    queries: agentIds.map((id) => ({
      queryKey: ['agent', id] as const,
      queryFn: async () => {
        const result = await getClient().agents.getAgent(id);
        return { data: result };
      },
      staleTime: STALE_TIMES.FREQUENT,
      enabled: Boolean(id),
      refetchInterval: !network.isOffline && Boolean(id) ? STALE_TIMES.FREQUENT : false,
      refetchIntervalInBackground: false,
      ...(!network.isOffline &&
        network.effectiveType === 'slow-2g' && {
          refetchInterval: STALE_TIMES.STANDARD,
        }),
    })),
  });

  // Safely check loading and error states
  const isLoading = isAgentsLoading || agentQueries.some((query) => query.isLoading);
  const isError = agentQueries.some((query) => query.isError);
  const error = agentQueries.find((query) => query.error)?.error;

  // Safely collect agent details
  const detailedAgents = agentQueries
    .filter((query): query is UseQueryResult<{ data: Agent }, Error> & { data: { data: Agent } } =>
      Boolean(query.data?.data)
    )
    .map((query) => query.data.data);

  return {
    data: {
      agents: detailedAgents,
    },
    isLoading,
    isError,
    error,
  };
}

// --- Hooks for Admin/Debug (Agent-Perspective Data) ---
export function useAgentInternalActions(
  agentId: UUID | null,
  agentPerspectiveRoomId?: UUID | null
) {
  return useQuery<AgentLog[], Error>({
    queryKey: ['agentInternalActions', agentId, agentPerspectiveRoomId],
    queryFn: async () => {
      if (!agentId) return []; // Or throw error, depending on desired behavior for null agentId
      const response = await getClient().agents.getAgentLogs(agentId, {
        limit: 50,
      });
      // Map the API logs to client format
      return response ? response.map(mapApiLogToClient) : [];
    },
    enabled: !!agentId, // Only enable if agentId is present
    staleTime: STALE_TIMES.FREQUENT,
    refetchInterval: 5000,
  });
}

export function useDeleteAgentInternalLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<void, Error, { agentId: UUID; logId: UUID }>({
    mutationFn: async ({ agentId, logId }: { agentId: UUID; logId: UUID }) => {
      await getClient().agents.deleteAgentLog(agentId, logId);
    },
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: ['agentInternalActions', agentId] });
      queryClient.invalidateQueries({
        queryKey: ['agentInternalActions', agentId, undefined],
        exact: false,
      });
      toast({ title: 'Log Deleted', description: 'The agent log entry has been removed' });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Log',
        description: error instanceof Error ? error.message : 'Failed to delete agent log',
        variant: 'destructive',
      });
    },
  });
}

export function useAgentInternalMemories(
  agentId: UUID | null,
  agentPerspectiveRoomId: UUID | null,
  tableName: string = 'messages',
  includeEmbedding = false
) {
  return useQuery<CoreMemory[], Error>({
    queryKey: [
      'agentInternalMemories',
      agentId,
      agentPerspectiveRoomId,
      tableName,
      includeEmbedding,
    ],
    queryFn: async () => {
      if (!agentId || !agentPerspectiveRoomId) return Promise.resolve([]);
      const response = await getClient().memory.getAgentInternalMemories(
        agentId,
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
```