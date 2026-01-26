# e5b94879:packages_client_src_routes_home.tsx:151-213

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/routes/home.tsx:151-213
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
              </div>
            </TabsContent>

            <TabsContent value="groups" className="flex-1 mt-0 bg-background">
              <div className="flex flex-col gap-6 w-full md:max-w-4xl mx-auto px-6 py-2">
                {!isLoading && !isError && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 groups-section">
                    {servers.map((server: MessageServer) => (
                      <ServerChannels key={server.id} serverId={server.id} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedAgent?.id && (
        <ProfileOverlay isOpen={isOverlayOpen} onClose={closeOverlay} agentId={selectedAgent.id} />
      )}

      {isGroupPanelOpen && (
        <GroupPanel
          onClose={() => {
            setSelectedGroupId(null);
            setIsGroupPanelOpen(false);
          }}
          channelId={selectedGroupId ?? undefined}
        />
      )}
    </>
  );
}

// Sub-component to fetch and display channels for a given server
const ServerChannels = React.memo(({ serverId }: { serverId: UUID }) => {
  const { data: channelsData, isLoading: isLoadingChannels } = useChannels(serverId);
  const groupChannels = useMemo(
    () =>
      channelsData?.data?.channels?.filter(
        (ch: MessageChannel) => ch.type === CoreChannelType.GROUP
      ) || [],
    [channelsData]
  );

  if (isLoadingChannels) return <p>Loading channels for server...</p>;
  if (!groupChannels || groupChannels.length === 0)
    return <p className="text-sm text-muted-foreground">No group channels in this server.</p>;

  return (
    <>
      {groupChannels.map((channel: MessageChannel) => (
        <GroupCard
          key={channel.id}
          group={{ ...channel, server_id: serverId } as MessageChannel & { server_id: UUID }} // Pass server_id for navigation context
        />
      ))}
    </>
  );
});

ServerChannels.displayName = 'ServerChannels';
```