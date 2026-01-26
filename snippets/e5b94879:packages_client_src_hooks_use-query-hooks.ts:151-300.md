# e5b94879:packages_client_src_hooks_use-query-hooks.ts:151-300

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:151-300
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
  return useQuery<{ data: Agent }>({
    queryKey: ['agent', agentId],
    queryFn: async () => {
      if (!agentId) throw new Error('Agent ID is required');
      const result = await getClient().agents.getAgent(agentId);
      return { data: mapApiAgentToClient(result) };
    },
    staleTime: STALE_TIMES.FREQUENT, // Use shorter stale time for real-time data
    enabled: Boolean(agentId),
    // Use more frequent polling for real-time updates
    refetchInterval: !network.isOffline && Boolean(agentId) ? STALE_TIMES.FREQUENT : false,
    // Disable polling when the tab is not active
    refetchIntervalInBackground: false,
    // Configure based on network conditions
    ...(!network.isOffline &&
      network.effectiveType === 'slow-2g' && {
        refetchInterval: STALE_TIMES.STANDARD, // Poll less frequently on slow connections
      }),
    // Allow overriding any options
    ...options,
  });
}

type RunsListResponse = { runs: RunSummary[]; total: number; hasMore: boolean };

export function useAgentRuns(
  agentId: UUID | undefined | null,
  params?: ListRunsParams,
  options: Partial<UseQueryOptions<RunsListResponse, Error, RunsListResponse>> = {}
) {
  const network = useNetworkStatus();
  const sanitizedParams = params
    ? Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined))
    : undefined;
  const serializedParams = sanitizedParams ? JSON.stringify(sanitizedParams) : 'default';

  return useQuery<RunsListResponse>({
    queryKey: ['agent', agentId, 'runs', serializedParams],
    queryFn: async () => {
      if (!agentId) throw new Error('Agent ID is required');
      return getClient().runs.listRuns(agentId, sanitizedParams as ListRunsParams | undefined);
    },
    enabled: Boolean(agentId),
    staleTime: STALE_TIMES.FREQUENT,
    refetchInterval: !network.isOffline && Boolean(agentId) ? STALE_TIMES.FREQUENT : false,
    refetchIntervalInBackground: false,
    ...(!network.isOffline &&
      network.effectiveType === 'slow-2g' && {
        refetchInterval: STALE_TIMES.STANDARD,
      }),
    ...options,
  });
}

export function useAgentRunDetail(
  agentId: UUID | undefined | null,
  runId: UUID | undefined | null,
  roomId?: UUID | null,
  options: Partial<UseQueryOptions<RunDetail, Error, RunDetail>> = {}
) {
  const network = useNetworkStatus();

  return useQuery<RunDetail>({
    queryKey: ['agent', agentId, 'runs', 'detail', runId, roomId ?? null],
    queryFn: async () => {
      if (!agentId || !runId) throw new Error('Agent ID and Run ID are required');
      return getClient().runs.getRun(agentId, runId, roomId ?? undefined);
    },
    enabled: Boolean(agentId && runId),
    staleTime: STALE_TIMES.FREQUENT,
    refetchInterval: !network.isOffline && Boolean(agentId && runId) ? STALE_TIMES.FREQUENT : false,
    refetchIntervalInBackground: false,
    ...(!network.isOffline &&
      network.effectiveType === 'slow-2g' && {
        refetchInterval: STALE_TIMES.STANDARD,
      }),
    ...options,
  });
}

// Hook for starting an agent with optimistic updates
/**
 * Custom hook to start an agent by calling the API with the provided agent ID.
 *
 * @returns {MutationFunction<UUID, unknown>} The useMutation hook for starting an agent.
 */
export function useStartAgent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<{ data: { id: UUID; name: string; status: string } }, Error, UUID>({
    mutationFn: async (agentId: UUID) => {
      try {
        const result = await getClient().agents.startAgent(agentId);
        return { data: { id: agentId, name: 'Agent', status: result.status } };
      } catch (error) {
        // Use the centralized error handler, but preserve specific agent logic
        if (error instanceof Error) {
          if (error.message.includes('already running')) {
            throw new Error('Agent is already running.');
          }
        }
        throw error;
      }
    },
    onMutate: async (_agentId) => {
      // Optimistically update UI to show agent is starting
      toast({
        title: 'Starting Agent',
        description: 'Initializing agent...',
      });

      // Return context for potential rollback
      return {};
    },
    onSuccess: (response, agentId) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });

      toast({
        title: 'Agent Started',
        description: `${response?.data?.name || 'Agent'} is now running`,
      });
    },
    onError: (error) => {
      // Handle specific error cases
      const errorMessage = error instanceof Error ? error.message : 'Failed to start agent';

      toast({
        title: 'Error Starting Agent',
        description: `${errorMessage}. Please try again.`,
        variant: 'destructive',
      });
    },
  });
}

// Hook for stopping an agent with optimistic updates
/**
 * Custom hook to stop an agent by calling the API and updating the UI optimistically.
 *
 * @returns {UseMutationResult} - Object containing the mutation function and its handlers.
 */
export function useStopAgent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<{ data: { message: string } }, Error, UUID>({
    mutationFn: async (agentId: UUID) => {
      const result = await getClient().agents.stopAgent(agentId);
```