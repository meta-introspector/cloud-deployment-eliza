# e5b94879:packages_client_src_hooks_use-eliza-chat.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-eliza-chat.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { useState, useCallback, useMemo } from 'react';
import { ChannelType, type UUID, type Media } from '@elizaos/core';
import type { TransportType } from '@elizaos/api-client';
import { useChannelMessages, useAgents, type UiMessage } from './use-query-hooks';
import { useSocketChat } from './use-socket-chat';
import { useSSEChat } from './use-sse-chat';
import { useHTTPChat } from './use-http-chat';
import { getEntityId, randomUUID } from '@/lib/utils';
import { USER_NAME } from '@/constants';

interface UseElizaChatOptions {
  channelId: UUID | undefined;
  serverId: UUID;
  agentId?: UUID;
  chatType?: ChannelType.DM | ChannelType.GROUP;
  /**
   * Transport type for sending messages
   * - "websocket": Real-time bidirectional (default)
   * - "sse": Server-Sent Events streaming
   * - "http": Synchronous HTTP request/response
   */
  transport?: TransportType;
  /**
   * Session ID for SSE/HTTP transports (required when not using websocket)
   */
  sessionId?: string;

  // Lifecycle callbacks (optional) - for custom side effects
  /**
   * Called when a message is added to the chat (user or agent)
   * Use for: scroll to bottom, update chat title, analytics, notifications
   */
  onMessageAdded?: (message: UiMessage) => void;
  /**
   * Called when a message is updated (e.g., streaming complete, loading done)
   * Use for: scroll to bottom on stream end, UI updates
   */
  onMessageUpdated?: (id: UUID, updates: Partial<UiMessage>) => void;
  /**
   * Called when a message is deleted
   */
  onMessageDeleted?: (id: UUID) => void;
  /**
   * Called when messages are cleared
   */
  onMessagesCleared?: () => void;
  /**
   * Called when input disabled state changes
   */
  onInputDisabledChange?: (disabled: boolean) => void;
  /**
   * Called when an error occurs during send
   */
  onError?: (error: Error) => void;
}

/**
 * Unified hook for chat functionality.
 * Combines message fetching, sending, and real-time streaming.
 * Supports multiple transport types: websocket (default), sse, http.
 *
 * @example
 * ```tsx
 * // WebSocket (default)
 * const { messages, sendMessage, isTyping } = useElizaChat({
 *   channelId,
 *   serverId,
 *   agentId,
 * });
 *
 * // SSE streaming
 * const { messages, sendMessage, isTyping } = useElizaChat({
 *   channelId,
 *   serverId,
 *   agentId,
 *   transport: 'sse',
 *   sessionId,
 * });
 *
 * // HTTP sync
 * const { messages, sendMessage } = useElizaChat({
 *   channelId,
 *   serverId,
 *   agentId,
 *   transport: 'http',
 *   sessionId,
 * });
 * ```
 */
export function useElizaChat({
  channelId,
  serverId,
  agentId,
  chatType = ChannelType.DM,
  transport = 'websocket',
  sessionId,
  // Lifecycle callbacks
  onMessageAdded,
  onMessageUpdated,
  onMessageDeleted,
  onMessagesCleared,
  onInputDisabledChange,
  onError,
}: UseElizaChatOptions) {
  const currentUserId = getEntityId();
  const [inputDisabled, setInputDisabled] = useState(false);

  // Fetch agents for name resolution in streaming
  const agentsQuery = useAgents();
  const allAgents = useMemo(() => agentsQuery.data?.data?.agents ?? [], [agentsQuery.data]);

  // Message state management
  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addMessage: internalAddMessage,
    updateMessage: internalUpdateMessage,
    removeMessage: internalRemoveMessage,
    clearMessages: internalClearMessages,
  } = useChannelMessages(channelId, serverId);

  // Wrapped handlers that call internal + external callbacks
  const handleAddMessage = useCallback(
    (message: UiMessage) => {
      internalAddMessage(message);
      onMessageAdded?.(message);
    },
    [internalAddMessage, onMessageAdded]
  );

  const handleUpdateMessage = useCallback(
    (id: UUID, updates: Partial<UiMessage>) => {
      internalUpdateMessage(id, updates);
      onMessageUpdated?.(id, updates);
    },
    [internalUpdateMessage, onMessageUpdated]
  );

  const handleRemoveMessage = useCallback(
    (id: UUID) => {
      internalRemoveMessage(id);
      onMessageDeleted?.(id);
    },
    [internalRemoveMessage, onMessageDeleted]
  );
```