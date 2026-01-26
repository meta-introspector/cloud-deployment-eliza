# 5e8c73c1:packages_client_src_components_app-sidebar.tsx:601-680

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/app-sidebar.tsx:601-680
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        {/* ---------- content ---------- */}
        <SidebarContent className="flex-1 overflow-y-auto">
          {/* create agent button - moved from old CreateButton dropdown */}
          {/* This section is for the "Agents" list.
              The "Create Agent" button should ideally be next to the "Agents" title.
              Let's adjust the structure slightly if needed or place it prominently.
          */}
          {agentLoadError && <div className="px-4 py-2 text-xs text-red-500">{agentLoadError}</div>}

          <SidebarMenu className="my-2">
            <SidebarMenuItem className="list-none">{renderCreateNewButton()}</SidebarMenuItem>
          </SidebarMenu>

          <div className="pt-2">
            {isLoadingAgents && !agentLoadError && (
              <SidebarSection title="Agents">
                <SidebarMenuSkeleton />
              </SidebarSection>
            )}

            {!isLoadingAgents && !agentLoadError && (
              <>
                <AgentListSection
                  agents={[...onlineAgents, ...offlineAgents]}
                  activePath={location.pathname}
                />
                <GroupListSection
                  servers={servers}
                  isLoadingServers={isLoadingServers}
                  activePath={location.pathname}
                />
              </>
            )}
          </div>
        </SidebarContent>

        {/* ---------- footer ---------- */}
        <SidebarFooter className="px-2 py-4">
          <SidebarMenu>
            <FooterLink to="https://eliza.how/" Icon={Book} label="Documentation" />
            <FooterLink to="/logs" Icon={TerminalIcon} label="Logs" />
            <FooterLink to="/settings" Icon={Cog} label="Settings" />
            <ConnectionStatus />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Server management hidden - using single default server */}
    </>
  );
}

/* ---------- footer link ---------- */
const FooterLink = ({ to, Icon, label }: { to: string; Icon: typeof Book; label: string }) => {
  const isExternal = to.startsWith('http://') || to.startsWith('https://');

  if (isExternal) {
    return (
      <SidebarMenuItem>
        <a href={to} target="_blank" rel="noopener noreferrer">
          <SidebarMenuButton className="rounded cursor-pointer">
            <Icon className="h-4 w-4 mr-3" />
            {label}
          </SidebarMenuButton>
        </a>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <NavLink to={to}>
        <SidebarMenuButton className="rounded cursor-pointer">
          <Icon className="h-4 w-4 mr-3" />
          {label}
        </SidebarMenuButton>
      </NavLink>
    </SidebarMenuItem>
  );
};
```