# 5e8c73c1:packages_client_src_hooks_use-query-hooks.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-query-hooks.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
```