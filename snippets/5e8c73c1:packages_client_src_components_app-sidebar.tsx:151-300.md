# 5e8c73c1:packages_client_src_components_app-sidebar.tsx:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/app-sidebar.tsx:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  const groupAgents = allAgents.filter((agent) => agent.id && participantsIds.includes(agent.id));

  const displayedAgents = groupAgents.slice(0, 3);
  const extraCount = groupAgents.length > 3 ? groupAgents.length - 3 : 0;

  return (
    <SidebarMenuItem>
      <NavLink to={`/group/${channel.id}?messageServerId=${serverId}`} className="flex-1">
        <SidebarMenuButton
          isActive={active}
          className="px-2 py-2 my-1 h-full rounded justify-between cursor-pointer"
        >
          {/* Name */}
          <span className="text-base truncate max-w-36">
            {channel.name || generateGroupName(channel, undefined, currentClientId)}
          </span>
          <div className="flex items-center gap-2">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {displayedAgents.map((agent) => (
                <Avatar key={agent.id} className="h-6 w-6 rounded-full border border-background">
                  <AvatarImage
                    src={typeof agent.settings?.avatar === 'string' ? agent.settings.avatar : ''}
                    alt={agent.name || ''}
                  />
                  <AvatarFallback className="rounded-full text-xs">
                    {formatAgentName(agent.name || '')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extraCount > 0 && (
                <div className="w-6 h-6 rounded-full bg-muted text-[10px] flex items-center justify-center border border-background">
                  +{extraCount}
                </div>
              )}
            </div>
          </div>
        </SidebarMenuButton>
      </NavLink>
    </SidebarMenuItem>
  );
};

const AgentListSection = ({
  agents,
  activePath,
}: {
  agents: Partial<Agent>[];
  activePath: string;
}) => (
  <>
    <div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
      <SectionHeader className="px-0 py-0 text-xs flex gap-1 mr-2">
        <div>Agents</div>
      </SectionHeader>
      <Separator />
    </div>
    <SidebarGroup>
      <SidebarGroupContent className="px-1 mt-0">
        <SidebarMenu>
          {agents.map((a) => (
            <AgentRow
              key={a?.id}
              agent={a as Agent}
              isOnline={a.status === CoreAgentStatus.ACTIVE}
              active={activePath.includes(`/chat/${String(a?.id)}`)}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </>
);

const GroupListSection = ({
  servers,
  isLoadingServers,
  activePath,
}: {
  servers: ClientMessageServer[] | undefined;
  isLoadingServers: boolean;
  activePath: string;
}) => {
  return (
    <>
      <div className="flex items-center px-4 pt-1 pb-0 text-muted-foreground">
        <SectionHeader className="px-0 py-0 text-xs flex gap-1 mr-2">
          <div>Groups</div>
        </SectionHeader>
        <Separator />
      </div>
      <SidebarGroup>
        <SidebarGroupContent className="px-1 mt-0">
          <SidebarMenu>
            {isLoadingServers &&
              Array.from({ length: 3 }).map((_, i) => (
                <SidebarMenuItem key={`skel-group-${i}`}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))}
            {servers?.map((server) => (
              <GroupChannelsForServer
                key={server.id}
                serverId={server.id}
                activePath={activePath}
              />
            ))}
            {(!servers || servers.length === 0) && !isLoadingServers && (
              <SidebarMenuItem>
                <div className="p-4 text-xs text-muted-foreground">No groups found.</div>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

// Updated RoomListSection to GroupChannelListSection
const GroupChannelListSection = ({
  servers,
  isLoadingServers,
  className = '',
  onManageServers,
}: {
  servers: ClientMessageServer[] | undefined;
  isLoadingServers: boolean;
  className?: string;
  onManageServers: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <SidebarSection title="Groups" className={className}>
      {isLoadingServers &&
        Array.from({ length: 3 }).map((_, i) => (
          <SidebarMenuItem key={`skel-server-${i}`}>
            <SidebarMenuSkeleton />
          </SidebarMenuItem>
        ))}
      {servers?.map((server) => (
        <SidebarGroup key={server.id} className="mt-1">
          {/* Optionally display server name if relevant, or just list all groups flatly */}
          {/* <div className="px-3 py-1 text-xs text-muted-foreground">{server.name}</div> */}
          <ChannelsForServer serverId={server.id} navigate={navigate} />
        </SidebarGroup>
      ))}
      {(!servers || servers.length === 0) && !isLoadingServers && (
        <SidebarMenuItem>
```