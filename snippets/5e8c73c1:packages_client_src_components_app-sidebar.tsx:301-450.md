# 5e8c73c1:packages_client_src_components_app-sidebar.tsx:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/app-sidebar.tsx:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          <div className="p-4 text-xs text-muted-foreground">No groups found.</div>
        </SidebarMenuItem>
      )}
      <div className="flex justify-endtop-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/group/new')}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> New Group
        </Button>
      </div>
    </SidebarSection>
  );
};

const ChannelsForServer = ({
  serverId,
  navigate,
}: {
  serverId: UUID;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const { data: channelsData, isLoading: isLoadingChannels } = useChannels(serverId);
  const currentClientId = getEntityId(); // Get current client/user ID
  const deleteChannelMutation = useDeleteChannel();
  const [deletingChannelId, setDeletingChannelId] = useState<UUID | null>(null);
  const { confirm, isOpen, onOpenChange, onConfirm, options } = useConfirmation();

  const groupChannels = useMemo(
    () => channelsData?.data?.channels?.filter((ch) => ch.type === CoreChannelType.GROUP) || [],
    [channelsData]
  );

  const handleDeleteChannel = (e: React.MouseEvent, channelId: UUID) => {
    e.preventDefault();
    e.stopPropagation();

    confirm(
      {
        title: 'Delete Group',
        description: 'Are you sure you want to delete this group? This action cannot be undone.',
        confirmText: 'Delete',
        variant: 'destructive',
      },
      async () => {
        setDeletingChannelId(channelId);
        try {
          await deleteChannelMutation.mutateAsync({ channelId, serverId });
        } catch (error) {
          console.error('Failed to delete channel:', error);
        } finally {
          setDeletingChannelId(null);
        }
      }
    );
  };

  if (isLoadingChannels) {
    return (
      <SidebarMenuItem>
        <SidebarMenuSkeleton />
      </SidebarMenuItem>
    );
  }
  if (!groupChannels.length) {
    return null; // Don't render section if no group channels for this server
  }

  return (
    <>
      <SidebarGroupContent className="px-1 mt-0">
        <SidebarMenu>
          {groupChannels.map((channel) => (
            <SidebarMenuItem key={channel.id} className="h-12 group">
              <div className="flex items-center gap-1 w-full">
                <NavLink to={`/group/${channel.id}?messageServerId=${serverId}`} className="flex-1">
                  <SidebarMenuButton className="px-4 py-2 my-1 h-full rounded cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" /> {/* Group icon */}
                      <span className="text-sm truncate max-w-32">
                        {/* Use generateGroupName - assumes channel.participants exists or will be added */}
                        {generateGroupName(channel, undefined, currentClientId)}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </NavLink>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteChannel(e, channel.id)}
                  disabled={deletingChannelId === channel.id}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      {/* Confirmation Dialog */}
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
};

const GroupChannelsForServer = ({
  serverId,
  activePath,
}: {
  serverId: UUID;
  activePath: string;
}) => {
  const { data: channelsData, isLoading: isLoadingChannels } = useChannels(serverId);

  const groupChannels = useMemo(
    () => channelsData?.data?.channels?.filter((ch) => ch.type === CoreChannelType.GROUP) || [],
    [channelsData]
  );

  if (isLoadingChannels) {
    return (
      <SidebarMenuItem>
        <SidebarMenuSkeleton />
      </SidebarMenuItem>
    );
  }

  if (!groupChannels.length) {
    return null; // Don't render if no group channels for this server
  }

  return (
    <>
      {groupChannels.map((channel) => (
        <GroupRow
          key={channel.id}
          channel={channel}
```