# e5b94879:packages_client_src_components_chat.tsx:1501-1650

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/chat.tsx:1501-1650
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
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
                  scrollToBottom={scrollToBottom}
                  disableAutoScroll={disableAutoScroll}
                  finalChannelId={finalChannelIdForHooks}
                  getAgentInMessage={getAgentInMessage}
                  agentAvatarMap={agentAvatarMap}
                  onDeleteMessage={handleDeleteMessage}
                  onRetryMessage={(messageText) => {
                    // Ensure we have required IDs before retrying
                    if (!finalChannelIdForHooks) {
                      toast({
                        title: 'Error',
                        description: 'Cannot retry message: missing channel information.',
                        variant: 'destructive',
                      });
                      return;
                    }
                    const message: UiMessage = {
                      id: randomUUID() as UUID,
                      text: messageText,
                      name: USER_NAME,
                      senderId: currentClientEntityId as UUID,
                      isAgent: false,
                      createdAt: Date.now(),
                      channelId: finalChannelIdForHooks,
                      messageServerId: finalMessageServerIdForHooks,
                    };
                    handleRetryMessage(message);
```