# 5e8c73c1:packages_client_src_components_group-panel.tsx:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/group-panel.tsx:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async () => {
      if (!channelId) throw new Error('Channel ID is required for delete');
      const elizaClient = getElizaClient();
      return await elizaClient.messaging.deleteChannel(channelId);
    },
    onSuccess: () => {
      toast({ title: 'Group Deleted', description: 'The group has been successfully deleted.' });
      queryClient.invalidateQueries({ queryKey: ['channels', serverId] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      navigate('/');
      onClose();
    },
    onError: (error) => {
      clientLogger.error('Failed to delete channel', error);
      const errorMsg = error instanceof Error ? error.message : 'Could not delete group.';
      interface ErrorWithStatusCode extends Error {
        statusCode?: number;
      }
      if (
        typeof error === 'object' &&
        error !== null &&
        (error as ErrorWithStatusCode).statusCode === 404
      ) {
        toast({
          title: 'Error Deleting Group',
          description: 'Delete operation not found on server.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Error Deleting Group', description: errorMsg, variant: 'destructive' });
      }
    },
  });

  const {
    data: channelParticipantsApiResponse,
    isLoading: isLoadingChannelParticipants,
    isError: isErrorChannelParticipants,
    error: errorChannelParticipants,
  }: UseQueryResult<ChannelParticipantsResponse, Error> = useQuery({
    queryKey: ['channelParticipants', channelId],
    queryFn: async () => {
      if (!channelId) return { success: true, data: [] };
      try {
        const elizaClient = getElizaClient();
        const result = await elizaClient.messaging.getChannelParticipants(channelId);

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
        console.error('[GroupPanel] Error fetching channel participants:', error);
        return {
          success: false,
          error: { message: error instanceof Error ? error.message : 'Unknown error' },
        };
      }
    },
    enabled: !!channelId,
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache results
  });

  // Separate effect for initializing chat name when channel loads
  useEffect(() => {
    if (channelId && channelsData?.data?.channels) {
      const channelDetails = channelsData.data.channels.find((ch) => ch.id === channelId);
      if (!initializedRef.current || lastChannelIdRef.current !== channelId) {
        const initialName = channelDetails?.name || '';
        setChatName(initialName);
        setInitialChatName(initialName);
        initializedRef.current = true;
        lastChannelIdRef.current = channelId;
        agentsInitializedRef.current = false; // Reset agents initialization for new channel
      }
    } else if (!channelId) {
      // Reset for create mode
      initializedRef.current = false;
      setChatName('');
      setSelectedAgents([]);
      setInitialChatName('');
      setInitialSelectedAgentIds([]);
    }
  }, [channelId, channelsData]);

  // Separate effect for handling participants
  useEffect(() => {
    if (isLoadingAgents) return;
    if (channelId && isLoadingChannelParticipants) return;
    if (!channelId) {
      // Reset for create mode
      agentsInitializedRef.current = false;
      return;
    }

    // Only initialize once per channel
    if (agentsInitializedRef.current && lastChannelIdRef.current === channelId) return;

    if (isErrorChannelParticipants) {
      toast({
        title: 'Error',
        description: `Could not load group participants: ${errorChannelParticipants?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      setSelectedAgents([]);
      setInitialSelectedAgentIds([]);
      agentsInitializedRef.current = true;
      return;
    }

    if (channelParticipantsApiResponse?.success && channelParticipantsApiResponse.data) {
      const participantIds = channelParticipantsApiResponse.data;
      const newSelected = allAvailableSelectableAgents.filter((agent) =>
        participantIds.includes(agent.id)
      );

      setSelectedAgents(newSelected);
      setInitialSelectedAgentIds(newSelected.map((a) => a.id));
      agentsInitializedRef.current = true;
    } else if (channelParticipantsApiResponse && !channelParticipantsApiResponse.success) {
      toast({
        title: 'Error',
        description: `Could not load group participants: ${channelParticipantsApiResponse.error?.message || 'Server error'}`,
        variant: 'destructive',
      });
      setSelectedAgents([]);
      setInitialSelectedAgentIds([]);
      agentsInitializedRef.current = true;
    } else {
      setSelectedAgents([]);
      setInitialSelectedAgentIds([]);
      agentsInitializedRef.current = true;
    }
  }, [
    channelId,
```