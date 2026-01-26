# e5b94879:packages_client_src_components_chat.tsx:1801-1888

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/chat.tsx:1801-1888
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
                )
              );
            })()}
          </ResizablePanelGroup>
        )}

        {/* Floating sidebar overlay for narrow screens */}
        {(() => {
          let sidebarAgentId: UUID | undefined = undefined;
          let sidebarAgentName: string = 'Agent';
          let sidebarChannelId: UUID | undefined = undefined;

          if (chatType === ChannelType.DM) {
            sidebarAgentId = contextId; // This is agentId for DM
            sidebarAgentName = targetAgentData?.name || 'Agent';
            sidebarChannelId = chatState.currentDmChannelId || undefined;
          } else if (chatType === ChannelType.GROUP && chatState.selectedGroupAgentId) {
            sidebarAgentId = chatState.selectedGroupAgentId;
            const selectedAgent = allAgents.find((a) => a.id === chatState.selectedGroupAgentId);
            sidebarAgentName = selectedAgent?.name || 'Group Member';
            sidebarChannelId = contextId; // contextId is the channelId for GROUP
          } else if (chatType === ChannelType.GROUP && !chatState.selectedGroupAgentId) {
            sidebarAgentName = 'Group';
            sidebarChannelId = contextId; // contextId is the channelId for GROUP
          }

          return (
            showSidebar &&
            isFloatingMode && (
              <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-background shadow-lg">
                  <div className="h-full flex flex-col">
                    {/* Close button for floating sidebar */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold text-lg">{sidebarAgentName}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarVisible(false)}
                        className="h-8 w-8 p-0"
                      >
                        <PanelRightClose className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <AgentSidebar
                        agentId={sidebarAgentId}
                        agentName={sidebarAgentName}
                        channelId={sidebarChannelId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          );
        })()}
      </div>

      {chatState.showGroupEditPanel && chatType === ChannelType.GROUP && (
        <GroupPanel
          onClose={() => updateChatState({ showGroupEditPanel: false })}
          channelId={contextId}
        />
      )}

      {chatState.showProfileOverlay && chatType === ChannelType.DM && targetAgentData?.id && (
        <ProfileOverlay
          isOpen={chatState.showProfileOverlay}
          onClose={() => updateChatState({ showProfileOverlay: false })}
          agentId={targetAgentData.id}
        />
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        title={options?.title || ''}
        description={options?.description || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        variant={options?.variant}
        onConfirm={onConfirm}
      />
    </>
  );
}
```