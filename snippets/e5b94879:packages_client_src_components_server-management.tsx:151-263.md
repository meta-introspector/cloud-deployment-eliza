# e5b94879:packages_client_src_components_server-management.tsx:151-263

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/server-management.tsx:151-263
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
    const currentAgents = serverAgents.get(selectedServerId) || [];
    return agents.filter((agent) => agent.id && !currentAgents.includes(agent.id as UUID));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Server Management</DialogTitle>
          <DialogDescription>
            Manage server-agent associations. Add or remove agents from servers to control which
            agents can process messages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Server Selection */}
          <div className="space-y-2">
            <Label>Select Server</Label>
            <Select
              value={selectedServerId || undefined}
              onValueChange={(value) => setSelectedServerId(value as UUID)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a server" />
              </SelectTrigger>
              <SelectContent>
                {serversData?.data?.servers.map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Server Agents */}
          {selectedServerId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agents in Server</CardTitle>
                <CardDescription>Agents currently associated with this server</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {(serverAgents.get(selectedServerId) || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No agents in this server</p>
                    ) : (
                      (serverAgents.get(selectedServerId) || []).map((agentId) => (
                        <div
                          key={agentId}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <span className="text-sm font-medium">{getAgentName(agentId)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAgentFromServer(selectedServerId, agentId)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Add Agent Section */}
          {selectedServerId && (
            <div className="space-y-2">
              <Label>Add Agent to Server</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedAgentId || undefined}
                  onValueChange={(value) => setSelectedAgentId(value as UUID)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAgents().map((agent) => (
                      <SelectItem key={agent.id} value={agent.id!}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddAgentToServer} disabled={!selectedAgentId || isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```