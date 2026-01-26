# 5e8c73c1:packages_client_src_components_chat.tsx:1501-1650

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/chat.tsx:1501-1650
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h2 className="font-semibold text-lg truncate" title={groupDisplayName}>
                {groupDisplayName}
              </h2>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
              {/* Group Actions Split Button */}
              <SplitButton
                mainAction={{
                  label: 'Edit Group',
                  onClick: () => updateChatState({ showGroupEditPanel: true }),
                  icon: <Edit className="size-4" />,
                }}
                actions={[
                  {
                    label: 'Clear Messages',
                    onClick: handleClearChat,
                    icon: <Eraser className="size-4" />,
                    disabled: !messages || messages.length === 0,
                  },
                  {
                    label: 'Delete Group',
                    onClick: () => {
                      if (!finalChannelIdForHooks || !finalMessageServerIdForHooks) return;
                      // Capture the channel ID to use in the async callback
                      const channelIdToDelete = finalChannelIdForHooks;
                      confirm(
                        {
                          title: 'Delete Group',
                          description:
                            'Are you sure you want to delete this group? This action cannot be undone.',
                          confirmText: 'Delete',
                          variant: 'destructive',
                        },
                        async () => {
                          try {
                            const elizaClient = getElizaClient();
                            await elizaClient.messaging.deleteChannel(channelIdToDelete);
                            toast({
                              title: 'Group Deleted',
                              description: 'The group has been successfully deleted.',
                            });
                            // Navigate back to home after deletion
                            window.location.href = '/';
                          } catch (error) {
                            clientLogger.error('[Chat] Error deleting group:', error);
                            toast({
                              title: 'Error',
                              description: 'Could not delete group.',
                              variant: 'destructive',
                            });
                          }
                        }
                      );
                    },
                    icon: <Trash2 className="size-4" />,
                    disabled: !finalChannelIdForHooks || !finalMessageServerIdForHooks,
                    variant: 'destructive',
                  },
                ]}
                variant="outline"
                size="sm"
                className="px-2 sm:px-3"
              />
              <Button
                variant="ghost"
                size="sm"
                className="px-2 sm:px-3 h-8 w-8 sm:w-auto"
                onClick={toggleSidebar}
              >
                {showSidebar ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {groupAgents.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-card rounded-lg border overflow-x-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
                Agents:
              </span>
              <div className="flex gap-2 min-w-0">
                <Button
                  variant={!chatState.selectedGroupAgentId ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => updateChatState({ selectedGroupAgentId: null })}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <span>All</span>
                </Button>
                {groupAgents.map((agent) => (
                  <Button
                    key={agent?.id}
                    variant={chatState.selectedGroupAgentId === agent?.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      updateChatState({
                        selectedGroupAgentId: agent?.id || null,
                      });
                      if (agent?.id && !showSidebar) {
                        setSidebarVisible(true);
                      }
                    }}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <Avatar className="size-5">
                      <AvatarImage src={getAgentAvatar(agent)} />
                    </Avatar>
                    <span className="truncate max-w-[100px] sm:max-w-none">{agent?.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="h-full flex flex-col relative overflow-hidden">
        {/* Conditional layout based on floating mode */}
        {isFloatingMode ? (
          /* Single panel layout for floating mode */
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-2 sm:p-4 pb-0">{renderChatHeader()}</div>

            <div
              className={cn(
                'flex flex-col transition-all duration-300 w-full flex-1 min-h-0 overflow-hidden p-2 sm:p-4 pt-0'
              )}
            >
              <div className="flex-1 min-h-0 overflow-hidden px-5 py-2">
                <ChatMessageListComponent
                  messages={messages}
                  isLoadingMessages={isLoadingMessages}
                  chatType={chatType}
                  currentClientEntityId={currentClientEntityId}
                  targetAgentData={targetAgentData}
                  allAgents={allAgents}
                  scrollRef={scrollRef as unknown as React.RefObject<HTMLDivElement>}
                  contentRef={contentRef as unknown as React.RefObject<HTMLDivElement>}
                  isAtBottom={isAtBottom}
```