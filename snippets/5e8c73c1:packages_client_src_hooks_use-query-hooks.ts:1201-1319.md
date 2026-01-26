# 5e8c73c1:packages_client_src_hooks_use-query-hooks.ts:1201-1319

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-query-hooks.ts:1201-1319
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  });
}

export function useChannelParticipants(channelId: UUID | undefined, options = {}) {
  // Allow undefined
  const network = useNetworkStatus();
  return useQuery<{ success: boolean; data: UUID[] }>({
    queryKey: ['channelParticipants', channelId],
    queryFn: async () => {
      if (!channelId) return Promise.resolve({ success: true, data: [] });
      try {
        const result = await getClient().messaging.getChannelParticipants(channelId);

        // Handle different possible response formats
        let participants = [];
        if (result && Array.isArray(result.participants)) {
          participants = result.participants.map((participant) => participant.userId);
        } else if (result && Array.isArray(result)) {
          // If result is directly an array
          participants = result.map(
            (participant) => participant.userId || participant.id || participant
          );
        }
        return { success: true, data: participants };
      } catch (error) {
        console.error('[useChannelParticipants] Error:', error);
        return { success: false, data: [] };
      }
    },
    enabled: !!channelId,
    staleTime: STALE_TIMES.STANDARD,
    refetchInterval: !network.isOffline && !!channelId ? STALE_TIMES.FREQUENT : false,
    ...options,
  });
}

export function useDeleteChannelMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<
    { channelId: UUID; messageId: UUID },
    Error,
    { channelId: UUID; messageId: UUID }
  >({
    mutationFn: async ({ channelId, messageId }) => {
      await getClient().messaging.deleteMessage(channelId, messageId);
      return { channelId, messageId };
    },
    onSuccess: (_data, variables) => {
      toast({
        title: 'Message Deleted',
        description: 'Message removed successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Message',
        description: error instanceof Error ? error.message : 'Failed to delete message',
        variant: 'destructive',
      });
    },
  });
}

export function useClearChannelMessages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<{ channelId: UUID }, Error, UUID>({
    mutationFn: async (channelId: UUID) => {
      await getClient().messaging.clearChannelHistory(channelId);
      return { channelId };
    },
    onSuccess: (_data, variables_channelId) => {
      toast({
        title: 'Channel Cleared',
        description: `All messages in channel ${variables_channelId} cleared.`,
      });
      queryClient.invalidateQueries({ queryKey: ['messages', variables_channelId] });
      queryClient.setQueryData(['messages', variables_channelId], () => []);
    },
    onError: (error) => {
      toast({
        title: 'Error Clearing Channel',
        description: error instanceof Error ? error.message : 'Failed to clear messages',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation<void, Error, { channelId: UUID; serverId: UUID }>({
    mutationFn: async ({ channelId }) => {
      await getClient().messaging.deleteChannel(channelId);
    },
    onSuccess: (_data, variables) => {
      toast({
        title: 'Group Deleted',
        description: 'The group has been successfully deleted.',
      });
      // Invalidate channel queries
      queryClient.invalidateQueries({ queryKey: ['channels', variables.serverId] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      // Navigate back to home
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Group',
        description: error instanceof Error ? error.message : 'Failed to delete group',
        variant: 'destructive',
      });
    },
  });
}
```