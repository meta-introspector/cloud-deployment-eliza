# e5b94879:packages_client_src_components_chat.tsx:1651-1800

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/chat.tsx:1651-1800
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
                  }}
                  selectedGroupAgentId={chatState.selectedGroupAgentId}
                />
              </div>

              <div className="flex-shrink-0">
                <ChatInputArea
                  input={chatState.input}
                  setInput={(value) => updateChatState({ input: value })}
                  inputDisabled={chatState.inputDisabled}
                  selectedFiles={selectedFiles}
                  removeFile={removeFile}
                  handleFileChange={handleFileChange}
                  handleSendMessage={handleSendMessage}
                  handleKeyDown={handleKeyDown}
                  chatType={chatType}
                  targetAgentData={targetAgentData}
                  formRef={formRef}
                  inputRef={inputRef}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Resizable panel layout for desktop mode */
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full flex-1 overflow-hidden"
            onLayout={(sizes) => {
              if (sizes.length >= 2 && showSidebar && !chatState.isMobile) {
                setMainPanelSize(sizes[0]);
                setSidebarPanelSize(sizes[1]);
              }
            }}
          >
            <ResizablePanel
              defaultSize={showSidebar && !chatState.isMobile ? mainPanelSize : 100}
              minSize={chatState.isMobile ? 100 : 50}
            >
              <div className="relative h-full overflow-hidden">
                {/* Main chat content */}
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
                        }}
                        selectedGroupAgentId={chatState.selectedGroupAgentId}
                      />
                    </div>

                    <div className="flex-shrink-0">
                      <ChatInputArea
                        input={chatState.input}
                        setInput={(value) => updateChatState({ input: value })}
                        inputDisabled={chatState.inputDisabled}
                        selectedFiles={selectedFiles}
                        removeFile={removeFile}
                        handleFileChange={handleFileChange}
                        handleSendMessage={handleSendMessage}
                        handleKeyDown={handleKeyDown}
                        chatType={chatType}
                        targetAgentData={targetAgentData}
                        formRef={formRef}
                        inputRef={inputRef}
                        fileInputRef={fileInputRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>

            {/* Right panel / sidebar */}
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
                const selectedAgent = allAgents.find(
                  (a) => a.id === chatState.selectedGroupAgentId
                );
                sidebarAgentName = selectedAgent?.name || 'Group Member';
                sidebarChannelId = contextId; // contextId is the channelId for GROUP
              } else if (chatType === ChannelType.GROUP && !chatState.selectedGroupAgentId) {
                sidebarAgentName = 'Group';
                sidebarChannelId = contextId; // contextId is the channelId for GROUP
              }

              return (
                showSidebar &&
                !chatState.isMobile && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={sidebarPanelSize} minSize={15} maxSize={85}>
                      <AgentSidebar
                        agentId={sidebarAgentId}
                        agentName={sidebarAgentName}
                        channelId={sidebarChannelId}
                      />
                    </ResizablePanel>
                  </>
```