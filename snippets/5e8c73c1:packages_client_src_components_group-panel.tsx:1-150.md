# 5e8c73c1:packages_client_src_components_group-panel.tsx:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/components/group-panel.tsx:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { ChannelType, validateUuid } from '@elizaos/core';
import { Separator } from '@/components/ui/separator';
import { GROUP_CHAT_SOURCE } from '@/constants';
import { useAgentsWithDetails, useChannels } from '@/hooks/use-query-hooks';
import { getElizaClient } from '@/lib/api-client-config';
import { type Agent, AgentStatus, type UUID } from '@elizaos/core';
import { useQueryClient, useQuery, useMutation, type UseQueryResult } from '@tanstack/react-query';
import { Loader2, Trash, X } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import MultiSelectCombobox from './combobox';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import clientLogger from '@/lib/logger';
import { getEntityId } from '@/lib/utils';
import { useConfirmation } from '@/hooks/use-confirmation';
import ConfirmationDialog from './confirmation-dialog';

const DEFAULT_SERVER_ID = '00000000-0000-0000-0000-000000000000' as UUID;

// This Option type must precisely match what MultiSelectCombobox.tsx expects for its props.
// Based on MultiSelectCombobox.tsx: { icon: string; label: string; id?: string; }
interface ComboboxOption {
  icon: string;
  label: string;
  id?: string; // We will always provide agent.id here, which is UUID (string)
}

interface GroupPanelProps {
  onClose: () => void;
  channelId?: UUID;
}

interface ChannelParticipantsResponse {
  success: boolean;
  data?: UUID[];
  error?: { message?: string; code?: number | string };
}

type SelectableAgent = Agent & { id: UUID; name: string };

function isAgentSelectable(agent: Partial<Agent>): agent is SelectableAgent {
  return (
    !!agent.id &&
    !!validateUuid(agent.id) &&
    typeof agent.name === 'string' &&
    agent.name.trim() !== ''
  );
}

export default function GroupPanel({ onClose, channelId }: GroupPanelProps) {
  const [chatName, setChatName] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<SelectableAgent[]>([]);
  const [initialChatName, setInitialChatName] = useState('');
  const [initialSelectedAgentIds, setInitialSelectedAgentIds] = useState<UUID[]>([]);
  const serverId = DEFAULT_SERVER_ID;
  const initializedRef = useRef(false);
  const lastChannelIdRef = useRef(channelId);
  const agentsInitializedRef = useRef(false);

  const { data: channelsData } = useChannels(channelId ? serverId : undefined, {
    enabled: !!channelId,
  });
  const {
    data: agentsData,
    isLoading: isLoadingAgents,
    isError: isErrorAgents,
  } = useAgentsWithDetails();

  const allAvailableSelectableAgents = useMemo(() => {
    return (agentsData?.agents || []).filter(isAgentSelectable);
  }, [agentsData]);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { confirm, isOpen: confirmOpen, onOpenChange, onConfirm, options } = useConfirmation();

  // Force fetch participants immediately when component mounts with channelId
  useEffect(() => {
    if (channelId) {
      queryClient.invalidateQueries({ queryKey: ['channelParticipants', channelId] });
      queryClient.refetchQueries({ queryKey: ['channelParticipants', channelId] });
    }
  }, [channelId, queryClient]);

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async ({ name, participantIds }: { name: string; participantIds: UUID[] }) => {
      const elizaClient = getElizaClient();
      // Include the current user's entityId as a participant so they can access the channel
      const currentUserEntityId = getEntityId();
      const allParticipantIds = [...participantIds, currentUserEntityId];
      return await elizaClient.messaging.createGroupChannel({
        name,
        participantIds: allParticipantIds,
        metadata: {
          type: ChannelType.GROUP,
          server_id: serverId,
          source: GROUP_CHAT_SOURCE,
        },
      });
    },
    onSuccess: (response) => {
      if (response) {
        toast({ title: 'Success', description: 'Group created successfully.' });
        queryClient.invalidateQueries({ queryKey: ['channels', serverId] });
        queryClient.invalidateQueries({ queryKey: ['channels'] });
        onClose();
        setTimeout(() => {
          navigate(`/group/${response.id}?messageServerId=${serverId}`);
        }, 100);
      }
    },
    onError: (error) => {
      clientLogger.error('Failed to create group', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create group.';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    },
  });

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async ({ name, participantIds }: { name: string; participantIds: UUID[] }) => {
      if (!channelId) throw new Error('Channel ID is required for update');
      const elizaClient = getElizaClient();
      return await elizaClient.messaging.updateChannel(channelId, {
        name,
        participantCentralUserIds: participantIds,
      });
    },
    onSuccess: () => {
      toast({ title: 'Group Updated', description: 'Group details updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['channels', serverId] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      onClose();
      setTimeout(() => {
        navigate(`/group/${channelId}?messageServerId=${serverId}`);
      }, 100);
    },
    onError: (error) => {
      clientLogger.error('Failed to update group', error);
      console.error('Group update error details:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to update group.';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    },
  });
```