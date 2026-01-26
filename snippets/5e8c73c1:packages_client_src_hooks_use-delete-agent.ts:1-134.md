# 5e8c73c1:packages_client_src_hooks_use-delete-agent.ts:1-134

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/client/src/hooks/use-delete-agent.ts:1-134
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getElizaClient } from '@/lib/api-client-config';
import type { Agent } from '@elizaos/core';

export function useDeleteAgent(targetAgentData: Agent) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    toast({
      title: 'Deleting...',
      description: `Deleting agent "${targetAgentData.name}"`,
    });

    let responseReceived = false;
    let navigationTimer = null;

    try {
      navigationTimer = setTimeout(() => {
        if (!responseReceived) {
          queryClient.invalidateQueries({ queryKey: ['agents'] });
          navigate('/');
          toast({
            title: 'Note',
            description: 'Deletion is still processing in the background.',
          });
        }
      }, 8000);

      const elizaClient = getElizaClient();

      // Ensure we have a valid ID
      if (!targetAgentData.id) {
        throw new Error('Agent ID is required for deletion');
      }

      const response = await elizaClient.agents.deleteAgent(targetAgentData.id);
      responseReceived = true;

      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }

      // Check if response indicates partial completion
      // Note: deleteAgent returns { success: boolean }, so partial is not part of the response
      const isPartial = false;

      if (isPartial) {
        toast({
          title: 'Processing',
          description: 'Deletion is still in progress and will complete in the background.',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Agent deleted successfully',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['agents'] });
      navigate('/');
    } catch (deleteError: unknown) {
      responseReceived = true;

      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }

      const errorMessage =
        deleteError instanceof Error ? deleteError.message : 'Failed to delete agent';
      interface ErrorWithStatus {
        statusCode?: number;
        response?: {
          status?: number;
        };
      }

      const errorObj =
        deleteError && typeof deleteError === 'object' ? (deleteError as ErrorWithStatus) : null;
      const statusCode = errorObj?.statusCode || errorObj?.response?.status;

      if (
        statusCode === 409 ||
        errorMessage.includes('409') ||
        errorMessage.includes('Conflict') ||
        errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('active references')
      ) {
        toast({
          title: 'Cannot Delete',
          description:
            'This agent cannot be deleted because it has active references. Try stopping the agent first.',
          variant: 'destructive',
        });
      } else if (
        statusCode === 408 ||
        statusCode === 504 ||
        errorMessage.includes('408') ||
        errorMessage.includes('504') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('timed out')
      ) {
        toast({
          title: 'Operation Timeout',
          description:
            'The deletion is taking longer than expected and will continue in the background.',
          variant: 'destructive',
        });

        queryClient.invalidateQueries({ queryKey: ['agents'] });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsDeleting(false);
    }
  }, [targetAgentData, toast, navigate, queryClient]);

  return {
    handleDelete,
    isDeleting,
  };
}
```