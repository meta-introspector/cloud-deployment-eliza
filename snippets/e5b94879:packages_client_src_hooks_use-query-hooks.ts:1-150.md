# e5b94879:packages_client_src_hooks_use-query-hooks.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-query-hooks.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { GROUP_CHAT_SOURCE, USER_NAME } from '@/constants';
// Direct error handling without bridge layer
import type { Agent, Content, Memory, UUID, Memory as CoreMemory, Media } from '@elizaos/core';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
  UseQueryResult,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './use-toast';
import { getEntityId } from '@/lib/utils';
import type {
  ServerMessage,
  MessageChannel as ClientMessageChannel,
  MessageServer as ClientMessageServer,
  UiMessage,
} from '@/types';
import clientLogger from '@/lib/logger';
import { useNavigate } from 'react-router-dom';
import {
  mapApiAgentToClient,
  mapApiChannelToClient,
  mapApiChannelsToClient,
  mapApiServersToClient,
  mapApiMessageToUi,
  mapApiLogToClient,
  mapApiMemoryToClient,
  type AgentLog,
} from '@/lib/api-type-mappers';
import type { ListRunsParams, RunDetail, RunSummary } from '@elizaos/api-client';
import { getElizaClient } from '@/lib/api-client-config';

// Helper to always get the current client instance (important after API key updates)
const getClient = () => getElizaClient();

/**
 * Represents content with additional user information.
 * @typedef {Object} ContentWithUser
 * @property {string} name - The name of the user.
 * @property {number} createdAt - The timestamp when the content was created.
 * @property {boolean} [isLoading] - Optional flag indicating if the content is currently loading.
 * @property {string} [worldId] - Optional ID of the world associated with the content.
 * @property {string} [id] - Optional ID field.
 */
type ContentWithUser = Content & {
  name: string;
  createdAt: number;
  isLoading?: boolean;
  worldId?: UUID;
  id?: UUID; // Add optional ID field
};

// AgentLog type is now imported from api-type-mappers

// Constants for stale times
export const STALE_TIMES = {
  FREQUENT: 30000, // 30 seconds - for data that changes often
  STANDARD: 120000, // 2 minutes - default
  RARE: 600000, // 10 minutes - for rarely changing data
  NEVER: Number.POSITIVE_INFINITY, // Only refetch on explicit invalidation
};

// Network Information API interface
/**
 * Interface for representing network information.
 *
 * @property {("slow-2g" | "2g" | "3g" | "4g" | "unknown")} effectiveType - The effective network type.
 * @property {boolean} saveData - Indicates if data saver mode is enabled.
 * @property {unknown} [key] - Additional properties with unknown value types.
 */

interface NetworkInformation {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  saveData: boolean;
  [key: string]: unknown;
}

// Network status detection for smart polling
/**
 * A custom React hook that returns the network status information.
 * Utilizes the Network Information API if available.
 * @returns {{
 *  isOffline: boolean,
 *  effectiveType: string,
 *  saveData: boolean
 * }} The network status information including whether the user is offline, the effective connection type, and if data-saving mode is enabled.
 */
const useNetworkStatus = () => {
  // Get navigator.connection if available (Network Information API)
  const connection =
    typeof navigator !== 'undefined' && 'connection' in navigator
      ? (navigator as Navigator & { connection: NetworkInformation }).connection
      : null;

  // Return the effective connection type or a default value
  return {
    isOffline: typeof navigator !== 'undefined' && !navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    saveData: connection?.saveData || false,
  };
};

// Hook for fetching agents with smart polling
/**
 * Fetches a list of agents from the server with polling and network-aware intervals.
 *
 * @param options - Optional configuration to override default query behavior.
 * @returns A React Query object containing the agents data and query state.
 *
 * @remark Polling frequency adapts to network conditions, using less frequent polling when offline or on slow connections.
 */
export function useAgents(options = {}) {
  const network = useNetworkStatus();

  return useQuery<{ data: { agents: Agent[] } }>({
    queryKey: ['agents'],
    queryFn: async () => {
      const result = await getClient().agents.listAgents();
      // Map the API agents to client format
      const mappedAgents = result.agents.map((agent) => mapApiAgentToClient(agent));
      return { data: { agents: mappedAgents } };
    },
    staleTime: STALE_TIMES.FREQUENT, // Use shorter stale time for real-time data
    // Use more frequent polling for real-time updates
    refetchInterval: !network.isOffline ? STALE_TIMES.FREQUENT : false,
    // Disable polling when the tab is not active
    refetchIntervalInBackground: false,
    // Configure based on network conditions
    ...(!network.isOffline &&
      network.effectiveType === 'slow-2g' && {
        refetchInterval: STALE_TIMES.STANDARD, // Poll less frequently on slow connections
      }),
    // Allow overriding any options
    ...options,
  });
}

// Hook for fetching a specific agent with smart polling
/**
 * Custom hook to fetch agent data based on the provided agentId.
 * @param {UUID | undefined | null} agentId - The ID of the agent to fetch data for.
 * @param {Object} options - Additional options to configure the query.
 * @returns {QueryResult} The result of the query containing agent data.
 */
export function useAgent(agentId: UUID | undefined | null, options = {}) {
  const network = useNetworkStatus();

```