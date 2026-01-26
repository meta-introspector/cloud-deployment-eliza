# a69475c0:packages_client_src_components_chat.tsx:1201-1350

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/client/src/components/chat.tsx:1201-1350
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      updateChatState({ inputDisabled: false });
    }
  };

  const handleClearChat = () => {
    if (!finalChannelIdForHooks) return;
    const confirmMessage =
      chatType === ChannelType.DM
        ? `Clear all messages in this chat with ${targetAgentData?.name}?`
        : 'Clear all messages in this group chat?';

    confirm(
      {
        title: 'Clear Chat',
        description: `${confirmMessage} This action cannot be undone.`,
        confirmText: 'Clear',
        variant: 'destructive',
      },
      () => {
        clearMessagesCentral(finalChannelIdForHooks);
      }
    );
  };

  // Handle mobile detection and window resize
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      updateChatState({ isMobile });
      // Note: Don't auto-hide sidebar on mobile - let floating mode handle it
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [updateChatState]);

  if (
    chatType === ChannelType.DM &&
    (isLoadingAgent || (!targetAgentData && contextId) || isLoadingAgentDmChannels)
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (
    !finalChannelIdForHooks ||
    !finalMessageServerIdForHooks ||
    (chatType === ChannelType.DM && !targetAgentData)
  ) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <p>Loading chat context...</p>
      </div>
    );
  }

  const onDeleteAgent = () => {
    if (isDeletingAgent) return;
    confirm(
      {
        title: 'Delete Agent',
        description: `Are you sure you want to delete the agent "${targetAgentData?.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        variant: 'destructive',
      },
      handleDeleteAgent
    );
  };

  // Chat header
  const renderChatHeader = () => {
    if (chatType === ChannelType.DM && targetAgentData) {
      return (
        <div className="flex items-center justify-between mb-4 p-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="py-6 px-2 flex-shrink-0">
                  <div className="relative flex-shrink-0">
                    <Avatar className="size-4 sm:size-10 border rounded-full">
                      <AvatarImage src={getAgentAvatar(targetAgentData)} />
                    </Avatar>
                    {targetAgentData?.status === AgentStatus.ACTIVE ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="absolute bottom-0 right-0 size-2 sm:size-[10px] rounded-full border border-white bg-green-500" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Agent is active</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="absolute bottom-0 right-0 size-2 sm:size-[10px] rounded-full border border-white bg-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Agent is inactive</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg truncate max-w-[80px] sm:max-w-none">
                      {targetAgentData?.name || 'Agent'}
                    </h2>
                  </div>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                side="bottom"
                className="min-w-36 w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                <DropdownMenuItem
                  onClick={() => {
                    exportCharacterAsJson(targetAgentData, toast);
                  }}
                >
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    if (targetAgentData && !isAgentStopping(targetAgentData.id)) {
                      stopAgent(targetAgentData);
                    }
                  }}
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Agent
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    if (targetAgentData && !isDeletingAgent) {
                      onDeleteAgent();
                    }
                  }}
```