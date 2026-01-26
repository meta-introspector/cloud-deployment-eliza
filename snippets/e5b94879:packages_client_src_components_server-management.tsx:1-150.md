# e5b94879:packages_client_src_components_server-management.tsx:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/components/server-management.tsx:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useElizaAgents } from '@/hooks/use-eliza';
import { useServers } from '@/hooks/use-query-hooks';
import { useToast } from '@/hooks/use-toast';
import { getElizaClient } from '@/lib/api-client-config';
import type { UUID } from '@elizaos/core';
import { Loader2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ServerManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServerManagement({ open, onOpenChange }: ServerManagementProps) {
  const { toast } = useToast();
  const { data: serversData } = useServers();
  const { agents } = useElizaAgents();

  const [selectedServerId, setSelectedServerId] = useState<UUID | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<UUID | null>(null);
  const [serverAgents, setServerAgents] = useState<Map<UUID, UUID[]>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  // Load agents for each server
  useEffect(() => {
    const loadServerAgents = async () => {
      if (!serversData?.data?.servers) return;

      const newServerAgents = new Map<UUID, UUID[]>();

      for (const server of serversData.data.servers) {
        try {
          const elizaClient = getElizaClient();
          const response = await elizaClient.agents.getAgentsForMessageServer(server.id);
          if (response.success) {
            newServerAgents.set(server.id, response.data.agents);
          }
        } catch (error) {
          console.error(`Failed to load agents for server ${server.id}:`, error);
        }
      }

      setServerAgents(newServerAgents);
    };

    loadServerAgents();
  }, [serversData]);

  const handleAddAgentToServer = async () => {
    if (!selectedServerId || !selectedAgentId) {
      toast({
        title: 'Error',
        description: 'Please select both a server and an agent',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const elizaClient = getElizaClient();
      await elizaClient.agents.addAgentToMessageServer(selectedServerId, selectedAgentId);

      // Update local state
      setServerAgents((prev) => {
        const newMap = new Map(prev);
        const agents = newMap.get(selectedServerId) || [];
        if (!agents.includes(selectedAgentId)) {
          newMap.set(selectedServerId, [...agents, selectedAgentId]);
        }
        return newMap;
      });

      toast({
        title: 'Success',
        description: 'Agent added to server successfully',
      });

      // Reset selection
      setSelectedAgentId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add agent to server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAgentFromServer = async (serverId: UUID, agentId: UUID) => {
    setIsLoading(true);
    try {
      const elizaClient = getElizaClient();
      await elizaClient.agents.removeAgentFromMessageServer(serverId, agentId);

      // Update local state
      setServerAgents((prev) => {
        const newMap = new Map(prev);
        const agents = newMap.get(serverId) || [];
        newMap.set(
          serverId,
          agents.filter((id) => id !== agentId)
        );
        return newMap;
      });

      toast({
        title: 'Success',
        description: 'Agent removed from server successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove agent from server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentName = (agentId: UUID) => {
    const agent = agents?.find((a) => a.id === agentId);
    return agent?.name || agentId;
  };

  const getAvailableAgents = () => {
    if (!selectedServerId || !agents) return [];

```