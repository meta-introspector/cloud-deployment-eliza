# 5e8c73c1:packages_client_src_components_group-panel.tsx:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/group-panel.tsx:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    isLoadingAgents,
    isLoadingChannelParticipants,
    channelParticipantsApiResponse,
    allAvailableSelectableAgents,
    isErrorChannelParticipants,
    errorChannelParticipants,
    toast,
  ]);

  const comboboxOptions: ComboboxOption[] = useMemo(() => {
    if (isLoadingAgents || isErrorAgents) return [];
    return allAvailableSelectableAgents.map((agent) => ({
      id: agent.id,
      label: `${agent.name}${agent.status === AgentStatus.INACTIVE ? ' (Inactive)' : ''}`,
      icon: typeof agent.settings?.avatar === 'string' ? agent.settings.avatar : '', // Ensure icon is always a string
    }));
  }, [allAvailableSelectableAgents, isLoadingAgents, isErrorAgents]);

  const STABLE_EMPTY_COMBOBOX_OPTIONS_ARRAY = useMemo(() => [], []);

  const initialSelectedComboboxOptions: ComboboxOption[] = useMemo(() => {
    if (isLoadingAgents) return STABLE_EMPTY_COMBOBOX_OPTIONS_ARRAY;
    if (!channelId) return STABLE_EMPTY_COMBOBOX_OPTIONS_ARRAY; // Create mode

    // In edit mode, wait for agents to be initialized before determining selection
    if (channelId && !agentsInitializedRef.current) return STABLE_EMPTY_COMBOBOX_OPTIONS_ARRAY;

    const options = selectedAgents.map((agent) => ({
      id: agent.id,
      label: `${agent.name}${agent.status === AgentStatus.INACTIVE ? ' (Inactive)' : ''}`,
      icon: typeof agent.settings?.avatar === 'string' ? agent.settings.avatar : '',
    }));

    return options;
  }, [channelId, selectedAgents, isLoadingAgents, STABLE_EMPTY_COMBOBOX_OPTIONS_ARRAY]);

  const handleSelectAgents = useCallback(
    (selectedOptions: ComboboxOption[]) => {
      const newSelectedAgentObjects = allAvailableSelectableAgents.filter((agent) =>
        selectedOptions.some((option) => option.id === agent.id)
      );
      setSelectedAgents(newSelectedAgentObjects);
    },
    [allAvailableSelectableAgents]
  );

  const handleDeleteGroup = useCallback(async () => {
    if (!channelId) return;
    const channel = channelsData?.data?.channels.find((ch) => ch.id === channelId);
    confirm(
      {
        title: 'Delete Group',
        description: `Are you sure you want to permanently delete the group chat "${channel?.name || chatName || 'this group'}"? This action cannot be undone.`,
        confirmText: 'Delete',
        variant: 'destructive',
      },
      () => {
        deleteGroupMutation.mutate();
      }
    );
  }, [channelId, chatName, channelsData, deleteGroupMutation]);

  // Check if form has changed
  const hasFormChanged = useMemo(() => {
    if (!channelId) return true; // Always allow creation

    const nameChanged = chatName.trim() !== initialChatName.trim();
    const currentAgentIds = selectedAgents.map((a) => a.id).sort();
    const initialAgentIds = initialSelectedAgentIds.sort();
    const agentsChanged = JSON.stringify(currentAgentIds) !== JSON.stringify(initialAgentIds);

    return nameChanged || agentsChanged;
  }, [channelId, chatName, initialChatName, selectedAgents, initialSelectedAgentIds]);

  const handleCreateOrUpdateGroup = useCallback(async () => {
    // For create mode, require at least one agent
    if (!channelId && selectedAgents.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one agent for the group.',
        variant: 'destructive',
      });
      return;
    }

    const proceed = () => {
      const participantIds = selectedAgents.map((agent) => agent.id);
      const finalName =
        chatName.trim() ||
        (selectedAgents.length > 0
          ? selectedAgents.map((agent) => agent.name).join(', ')
          : 'Empty Group');

      if (!channelId) {
        createGroupMutation.mutate({ name: finalName, participantIds });
      } else {
        updateGroupMutation.mutate({ name: finalName, participantIds });
      }
    };

    // For edit mode, warn if removing all agents but allow it
    if (channelId && selectedAgents.length === 0) {
      confirm(
        {
          title: 'Remove All Agents?',
          description:
            'Are you sure you want to remove all agents from this group? This will leave the group with no participants.',
          confirmText: 'Remove All',
          variant: 'destructive',
        },
        () => {
          proceed();
        }
      );
      return;
    }

    proceed();
  }, [channelId, chatName, selectedAgents, createGroupMutation, updateGroupMutation, toast]);

  // Use the exact same logic as "unsaved changes" detection for update button
  const isSubmitDisabled = channelId
    ? // Edit mode - disable if no changes OR loading (allow agent removal)
      !hasFormChanged ||
      createGroupMutation.isPending ||
      updateGroupMutation.isPending ||
      deleteGroupMutation.isPending
    : // Create mode - disable if no agents OR loading
      selectedAgents.length === 0 ||
      createGroupMutation.isPending ||
      updateGroupMutation.isPending ||
      deleteGroupMutation.isPending;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <Card className="w-[80%] max-w-2xl" onClick={(e) => e.stopPropagation()}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-semibold">
              {channelId ? 'Edit Group Chat' : 'Create Group Chat'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <Separator />
```