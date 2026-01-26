# 5e8c73c1:packages_client_src_components_group-panel.tsx:451-554

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/group-panel.tsx:451-554
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

          <CardContent className="pt-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="chat-name" className="text-sm font-medium">
                  Chat Name (Optional)
                </label>
                <Input
                  id="chat-name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="w-full bg-background text-foreground"
                  placeholder="Leave blank to auto-generate from participants"
                  disabled={
                    createGroupMutation.isPending ||
                    updateGroupMutation.isPending ||
                    deleteGroupMutation.isPending
                  }
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="invite-agents" className="text-sm font-medium">
                  Select Agents{' '}
                  {!channelId && <span className="text-muted-foreground">(Required)</span>}
                </label>
                {isLoadingAgents ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading agents...</span>
                  </div>
                ) : isErrorAgents ? (
                  <div className="flex items-center justify-center p-4 text-red-500">
                    Error loading agents. Please try again later.
                  </div>
                ) : (
                  <MultiSelectCombobox
                    options={comboboxOptions}
                    onSelect={handleSelectAgents}
                    className="w-full"
                    initialSelected={initialSelectedComboboxOptions}
                    key={`group-panel-combobox-${channelId || 'create'}-${allAvailableSelectableAgents.length}`}
                  />
                )}
                {selectedAgents.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedAgents.length} agent{selectedAgents.length > 1 ? 's' : ''} selected
                  </p>
                )}
                {channelId && hasFormChanged && (
                  <div className="text-sm text-blue-500 mt-1">You have unsaved changes</div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-4">
            {channelId && (
              <Button
                variant="destructive"
                onClick={handleDeleteGroup}
                disabled={
                  deleteGroupMutation.isPending ||
                  createGroupMutation.isPending ||
                  updateGroupMutation.isPending ||
                  isLoadingAgents
                }
              >
                {deleteGroupMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}
                Delete Group
              </Button>
            )}

            <Button
              variant="default"
              className={channelId ? '' : 'w-full'}
              onClick={handleCreateOrUpdateGroup}
              disabled={isSubmitDisabled}
            >
              {(createGroupMutation.isPending || updateGroupMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {channelId ? 'Update Group' : 'Create Group'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <ConfirmationDialog
        open={confirmOpen}
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