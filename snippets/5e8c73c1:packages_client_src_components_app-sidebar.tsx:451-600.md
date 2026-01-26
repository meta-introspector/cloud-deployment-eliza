# 5e8c73c1:packages_client_src_components_app-sidebar.tsx:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/app-sidebar.tsx:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          serverId={serverId}
          active={activePath.includes(`/group/${channel.id}`)}
        />
      ))}
    </>
  );
};

// Updated CreateButton: Removed DropdownMenu, simplified to a single action (Create Agent)
// For "Create Group", users will use the button in the "Groups" section header.
const CreateAgentButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="w-full">
      <Plus className="h-4 w-4 mr-2" />
      Create Agent
    </Button>
  );
};

interface AppSidebarProps {
  refreshHomePage: () => void;
}

/**
 * Renders the main application sidebar, displaying navigation, agent lists, group rooms, and utility links.
 *
 * The sidebar includes sections for online and offline agents, group rooms, a create button for agents and groups, and footer links to documentation, logs, and settings. It handles loading and error states for agent and room data, and conditionally displays a group creation panel.
 */
export function AppSidebar({
  refreshHomePage,
  isMobile = false,
}: AppSidebarProps & { isMobile?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get query client instance
  const version = useServerVersionString(); // Get server version

  const {
    data: agentsData,
    error: agentsError,
    isLoading: isLoadingAgents,
  } = useAgentsWithDetails();
  const { data: serversData, isLoading: isLoadingServers } = useServers();

  const agents = useMemo(() => agentsData?.agents || [], [agentsData]);
  const servers = useMemo(() => serversData?.data?.servers || [], [serversData]);

  const [onlineAgents, offlineAgents] = useMemo(
    () => partition(agents, (a) => a.status === CoreAgentStatus.ACTIVE),
    [agents]
  );

  const agentLoadError = agentsError
    ? 'Error loading agents: NetworkError: Unable to connect to the server. Please check if the server is running.'
    : undefined;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clientLogger.info('[AppSidebar] handleLogoClick triggered', { currentPath: location.pathname });

    // Invalidate queries that should be fresh on home page
    queryClient.invalidateQueries({ queryKey: ['agents'] });
    queryClient.invalidateQueries({ queryKey: ['agentsWithDetails'] }); // if this is a separate key
    queryClient.invalidateQueries({ queryKey: ['servers'] });
    queryClient.invalidateQueries({ queryKey: ['channels'] }); // This is broad, consider more specific invalidations if performance is an issue
    // Example: if you know active server IDs, invalidate ['channels', serverId]

    if (location.pathname === '/') {
      clientLogger.info('[AppSidebar] Already on home page. Calling refreshHomePage().');
      // refreshHomePage should ideally trigger a re-render/refetch in Home.tsx
      // This can be done by changing a key prop on Home.tsx or further query invalidations if needed.
      refreshHomePage();
    } else {
      clientLogger.info('[AppSidebar] Not on home page. Navigating to "/".');
      navigate('/');
    }
  };

  function renderCreateNewButton() {
    const navigate = useNavigate();

    const handleCreateAgent = () => {
      navigate('/create');
    };

    const handleCreateGroup = () => {
      navigate('/group/new');
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 h-10 rounded justify-start"
          >
            <Plus className="w-4 h-4 bg" />
            Create New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          <DropdownMenuItem onClick={handleCreateAgent} className="w-full">
            Create New Agent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateGroup} className="w-full">
            Create New Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Sidebar
        className={cn(
          'bg-background border-r overflow-hidden',
          isMobile ? 'p-3 pt-12 w-full h-full' : 'p-4 w-72 fixed left-0 top-0 z-40 h-screen',
          !isMobile && 'hidden md:flex md:flex-col'
        )}
        collapsible="none"
        data-testid="app-sidebar"
      >
        {/* ---------- header ---------- */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a
                  href="/"
                  onClick={handleLogoClick}
                  className="px-4 py-2 h-full sidebar-logo no-underline cursor-pointer"
                >
                  <div className="flex flex-col pt-2 gap-1 items-start justify-center">
                    <img
                      alt="elizaos-logo"
                      src="/elizaos-logo-light.png"
                      className="w-32 max-w-full"
                    />
                    <span className="text-xs font-mono text-muted-foreground">v{version}</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

```