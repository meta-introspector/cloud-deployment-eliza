# e5b94879:packages_client_src_hooks_use-sse-chat.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/use-sse-chat.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { useState, useCallback, useRef, useEffect } from 'react';
import type { UUID, Media } from '@elizaos/core';
import { createApiClientConfig } from '@/lib/api-client-config';
import { getEntityId, randomUUID, getAttachmentType } from '@/lib/utils';
import { USER_NAME } from '@/constants';
import type { UiMessage } from '../types';

interface UseSSEChatOptions {
  sessionId: string | undefined;
  agentId: UUID | undefined;
  serverId: UUID;
  channelId: UUID | undefined;
  onAddMessage: (message: UiMessage) => void;
  onUpdateMessage: (id: string, updates: Partial<UiMessage>) => void;
}

/**
 * SSE (Server-Sent Events) transport for chat.
 * Streams agent responses via SSE instead of WebSocket.
 *
 * @internal Used by useElizaChat with transport: 'sse'
 */
export function useSSEChat({
  sessionId,
  agentId,
  serverId,
  channelId,
  onAddMessage,
  onUpdateMessage,
}: UseSSEChatOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentUserId = getEntityId();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (text: string, attachments?: Media[]) => {
      if (!sessionId || !channelId || !agentId || !text.trim()) return;

      const tempId = randomUUID();
      setInputDisabled(true);

      // Add optimistic user message
      const userMessage: UiMessage = {
        id: tempId,
        text,
        name: USER_NAME,
        senderId: currentUserId as UUID,
        isAgent: false,
        createdAt: Date.now(),
        channelId,
        serverId,
        isLoading: true,
        attachments,
      };
      onAddMessage(userMessage);

      try {
        const config = createApiClientConfig();
        const baseUrl = config.baseUrl;

        // Abort any previous stream
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        // Send message with SSE transport
        const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
          },
          body: JSON.stringify({
            content: text,
            transport: 'sse',
            attachments: attachments?.map((a) => ({
              type: getAttachmentType(a.contentType),
              url: a.url,
              name: a.title,
            })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Mark user message as sent
        onUpdateMessage(tempId, { isLoading: false });

        // Handle SSE stream
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        setIsStreaming(true);

        // Create agent message placeholder
        const agentMessageId = randomUUID();
        const agentMessage: UiMessage = {
          id: agentMessageId,
          text: '',
          name: 'Agent',
          senderId: agentId,
          isAgent: true,
          createdAt: Date.now(),
          channelId,
          serverId,
          isStreaming: true,
          isLoading: true,
        };
        onAddMessage(agentMessage);

        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process SSE events
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                onUpdateMessage(agentMessageId, {
                  text: accumulatedText,
                  isStreaming: false,
                  isLoading: false,
                });
                setIsStreaming(false);
                continue;
              }

```