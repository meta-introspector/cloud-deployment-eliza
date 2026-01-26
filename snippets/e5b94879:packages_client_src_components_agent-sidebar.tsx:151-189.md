# e5b94879:packages_client_src_components_agent-sidebar.tsx:151-189

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/agent-sidebar.tsx:151-189
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
          <div className="w-full max-w-full">
            <AgentLogViewer agentName={agentName} level="all" />
          </div>
        )}
        {detailsTab === 'logs' && !agentId && (
          <div className="p-4 text-muted-foreground">Select an agent to see their logs.</div>
        )}
      </TabsContent>
      <TabsContent
        value="memories"
        className="overflow-y-auto overflow-x-hidden flex-1 w-full max-w-full min-h-0"
      >
        {detailsTab === 'memories' && agentId && (
          <div className="w-full max-w-full">
            <AgentMemoryViewer agentId={agentId} agentName={agentName} channelId={channelId} />
          </div>
        )}
        {detailsTab === 'memories' && !agentId && (
          <div className="p-4 text-muted-foreground">Select an agent to see their memories.</div>
        )}
      </TabsContent>
      {agentPanels.map((panel: AgentPanel) => (
        <TabsContent
          key={panel.name}
          value={panel.name}
          className="overflow-y-auto overflow-x-hidden flex-1 w-full max-w-full min-h-0"
        >
          {detailsTab === panel.name && agentId && (
            <iframe
              src={panel.url}
              title={panel.name}
              className="w-full h-full border-0 flex-1 max-w-full"
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
```