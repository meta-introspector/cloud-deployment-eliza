# e5b94879:packages_client_src_hooks_use-socket-chat.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-socket-chat.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { useEffect, useRef, useCallback } from 'react';
import { SocketIOManager } from '@/lib/socketio-manager';
import type { Media } from '@elizaos/core';
import type {
  MessageBroadcastData,
  MessageCompleteData,
  ControlMessageData,
  MessageDeletedData,
  ChannelClearedData,
  ChannelDeletedData,
  StreamChunkData,
} from '@/lib/socketio-manager';
import { UUID, Agent, ChannelType } from '@elizaos/core';
import type { UiMessage } from './use-query-hooks';
import { randomUUID } from '@/lib/utils';
import clientLogger from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';

// Timeout for stream inactivity - if no chunk received for this duration, mark stream as complete
const STREAM_TIMEOUT_MS = 30000;

interface UseSocketChatProps {
  channelId: UUID | undefined;
  currentUserId: string;
  contextId: UUID | undefined; // agentId for DM, channelId for GROUP - undefined is safe, hook early-returns without channelId
  chatType: ChannelType.DM | ChannelType.GROUP;
  allAgents: Agent[];
  messages: UiMessage[];
  onAddMessage: (message: UiMessage) => void;
  onUpdateMessage: (messageId: string, updates: Partial<UiMessage>) => void;
  onDeleteMessage: (messageId: string) => void;
  onClearMessages: () => void;
  onInputDisabledChange: (disabled: boolean) => void;
}

export function useSocketChat({
  channelId,
  currentUserId,
  contextId,
  chatType,
  allAgents,
  messages,
  onAddMessage,
  onUpdateMessage,
  onDeleteMessage,
  onClearMessages,
  onInputDisabledChange,
}: UseSocketChatProps) {
  const socketIOManager = SocketIOManager.getInstance();
  const { getApiKey } = useAuth();
  const joinedChannelRef = useRef<string | null>(null); // Ref to track joined channel
  // Track streaming messages for this channel instance.
  // Map is cleared on channel cleanup - safe because handleStreamChunk filters by channelId.
  const streamingMessagesRef = useRef<Map<string, string>>(new Map()); // messageId → accumulated text
  // Track stream timeouts to handle stalled streams
  const streamTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // Track seen message IDs to avoid stale closure issues with React state
  const seenMessageIdsRef = useRef<Set<string>>(new Set());

  const sendMessage = useCallback(
    async (
      text: string,
      messageServerId: UUID,
      source: string,
      attachments?: Media[],
      tempMessageId?: string,
      metadata?: Record<string, unknown>,
      overrideChannelId?: UUID
    ) => {
      const channelIdToUse = overrideChannelId || channelId;
      if (!channelIdToUse) {
        clientLogger.error('[useSocketChat] Cannot send message: no channel ID available');
        return;
      }

      // Add metadata for DM channels
      const messageMetadata = {
        ...metadata,
        channelType: chatType,
        ...(chatType === ChannelType.DM && {
          isDm: true,
          targetUserId: contextId, // The agent ID for DM channels
        }),
      };

      await socketIOManager.sendMessage(
        text,
        channelIdToUse,
        messageServerId,
        source,
        attachments,
        tempMessageId,
        messageMetadata
      );
    },
    [channelId, socketIOManager, chatType, contextId]
  );

  useEffect(() => {
    if (!channelId || !currentUserId) {
      // If channelId becomes undefined (e.g., navigating away), ensure we reset the ref
      if (joinedChannelRef.current) {
        clientLogger.info(
          `[useSocketChat] useEffect: channelId is now null/undefined, resetting joinedChannelRef from ${joinedChannelRef.current}`
        );
        joinedChannelRef.current = null;
      }
      return;
    }

    // Initialize socket with API key for authentication
    const apiKey = getApiKey();
    socketIOManager.initialize(currentUserId, apiKey ?? undefined);

    // Only join if this specific channelId hasn't been joined by this hook instance yet,
    // or if the channelId has changed.
    if (channelId !== joinedChannelRef.current) {
      clientLogger.info(
        `[useSocketChat] useEffect: Joining channel ${channelId}. Previous joinedChannelRef: ${joinedChannelRef.current}`
      );
      socketIOManager.joinChannel(channelId);
      joinedChannelRef.current = channelId; // Mark this channelId as joined by this instance
    } else {
      clientLogger.info(
        `[useSocketChat] useEffect: Channel ${channelId} already marked as joined by this instance. Skipping joinChannel call.`
      );
    }

    const handleMessageBroadcasting = (data: MessageBroadcastData) => {
      clientLogger.info(
        '[useSocketChat] Received raw messageBroadcast data:',
        JSON.stringify(data)
      );
      const msgChannelId = data.channelId || data.roomId;
      if (msgChannelId !== channelId) return;
      const isCurrentUser = data.senderId === currentUserId;

      // Unified message handling for both DM and GROUP
      const isTargetAgent =
        chatType === ChannelType.DM
          ? data.senderId === contextId
          : allAgents.some((agent) => agent.id === data.senderId);

      if (!isCurrentUser && isTargetAgent) onInputDisabledChange(false);

      const clientMessageId =
        'clientMessageId' in data
          ? (data as MessageBroadcastData & { clientMessageId?: string }).clientMessageId
          : undefined;
      if (clientMessageId && isCurrentUser) {
```