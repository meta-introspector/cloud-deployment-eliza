# e5b94879:packages_client_src_hooks_use-eliza.ts:1-81

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-eliza.ts:1-81
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import type { Agent, UUID } from '@elizaos/core';
import { useMemo } from 'react';
import { useAgent, useAgents, useStartAgent, useStopAgent } from './use-query-hooks';
import { usePlugins } from './use-plugins';
import { useConnection } from '@/context/ConnectionContext';

/**
 * Unified hook for agent access, plugins, and lifecycle management.
 *
 * @example
 * ```tsx
 * const { agent, plugins, isConnected, start, stop } = useElizaAgent(agentId);
 * ```
 */
export function useElizaAgent(agentId: UUID | undefined) {
  const { status } = useConnection();
  const agentQuery = useAgent(agentId);
  const pluginsQuery = usePlugins();
  const startMutation = useStartAgent();
  const stopMutation = useStopAgent();

  const agent = agentQuery.data?.data;
  const plugins = pluginsQuery.data ?? [];

  const start = useMemo(
    () => (agentId ? () => startMutation.mutate(agentId) : () => {}),
    [agentId, startMutation]
  );

  const stop = useMemo(
    () => (agentId ? () => stopMutation.mutate(agentId) : () => {}),
    [agentId, stopMutation]
  );

  return {
    // Data
    agent,
    plugins,
    // Connection
    isConnected: status === 'connected',
    isReconnecting: status === 'reconnecting',
    isOffline: status === 'error',
    // Loading
    isLoading: agentQuery.isLoading,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    // Error
    error: agentQuery.error,
    // Actions
    start,
    stop,
    refetch: agentQuery.refetch,
  };
}

/**
 * Unified hook for listing all agents with lifecycle controls.
 *
 * @example
 * ```tsx
 * const { agents, start, stop } = useElizaAgents();
 * ```
 */
export function useElizaAgents() {
  const { status } = useConnection();
  const agentsQuery = useAgents();
  const startMutation = useStartAgent();
  const stopMutation = useStopAgent();

  const agents = agentsQuery.data?.data?.agents ?? [];

  return {
    agents,
    isConnected: status === 'connected',
    isLoading: agentsQuery.isLoading,
    error: agentsQuery.error,
    start: (agentId: UUID) => startMutation.mutate(agentId),
    stop: (agentId: UUID) => stopMutation.mutate(agentId),
    refetch: agentsQuery.refetch,
  };
}
```