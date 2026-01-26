# 5e8c73c1:packages_client_src_components_app-sidebar.tsx:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/app-sidebar.tsx:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import ConfirmationDialog from '@/components/confirmation-dialog';
import ConnectionStatus from '@/components/connection-status';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { useConfirmation } from '@/hooks/use-confirmation';

import {
  useAgentsWithDetails,
  useChannelParticipants, // New hook
  useChannels,
  useServers, // New hook
} from '@/hooks/use-query-hooks';
import { useServerVersionString } from '@/hooks/use-server-version';
import { cn, formatAgentName, generateGroupName, getAgentAvatar, getEntityId } from '@/lib/utils';
import type {
  MessageChannel as ClientMessageChannel,
  MessageServer as ClientMessageServer,
} from '@/types';
import {
  AgentStatus as CoreAgentStatus,
  ChannelType as CoreChannelType,
  type Agent,
  type UUID,
} from '@elizaos/core';

import { useDeleteChannel } from '@/hooks/use-query-hooks';
import clientLogger from '@/lib/logger'; // Added import
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { Book, Cog, LogIn, LogOut, Plus, TerminalIcon, Trash2, Users } from 'lucide-react'; // Added Hash for channels
import { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

/* ---------- helpers ---------- */
const partition = <T,>(src: T[], pred: (v: T) => boolean): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  src.forEach((v) => (pred(v) ? pass : fail).push(v));
  return [pass, fail];
};

/* ---------- tiny components ---------- */
const SectionHeader = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'px-4 pt-1 pb-0 text-sm font-medium text-muted-foreground sidebar-section-header',
      className
    )}
  >
    {children}
  </div>
);

const SidebarSection = ({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <>
    <SectionHeader className={className}>{title}</SectionHeader>
    <SidebarGroup>
      <SidebarGroupContent className="mt-0">
        <SidebarMenu>{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </>
);

const AgentRow = ({
  agent,
  isOnline,
  active,
}: {
  agent: Agent;
  isOnline: boolean;
  active: boolean;
}) => (
  <SidebarMenuItem>
    <NavLink to={`/chat/${agent.id}`}>
      <SidebarMenuButton
        isActive={active}
        className="px-2 py-2 my-1 h-full rounded justify-between cursor-pointer"
      >
        <span className="text-base truncate max-w-36">{agent.name}</span>
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="h-6 w-6 rounded-full">
              <AvatarImage src={getAgentAvatar(agent)} alt={agent.name || 'avatar'} />
              <AvatarFallback className="rounded-full">
                {formatAgentName(agent.name || '')}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute bottom-0 right-0 w-[8px] h-[8px] rounded border border-white',
                isOnline ? 'bg-green-500' : 'bg-muted-foreground'
              )}
            />
          </div>
        </div>
      </SidebarMenuButton>
    </NavLink>
  </SidebarMenuItem>
);

const GroupRow = ({
  channel,
  serverId,
  active,
}: {
  channel: ClientMessageChannel;
  serverId: UUID;
  active: boolean;
}) => {
  const currentClientId = getEntityId();

  const { data: agentsData } = useAgentsWithDetails();
  const allAgents = agentsData?.agents || [];

  const { data: participantsData } = useChannelParticipants(channel.id as UUID);
  const participants = participantsData?.data;
  const participantsIds: UUID[] = participants && Array.isArray(participants) ? participants : [];
```