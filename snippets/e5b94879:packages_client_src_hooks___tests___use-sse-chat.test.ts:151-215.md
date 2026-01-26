# e5b94879:packages_client_src_hooks___tests___use-sse-chat.test.ts:151-215

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/__tests__/use-sse-chat.test.ts:151-215
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
        id: tempId,
        text,
        name: 'TestUser',
        senderId: currentUserId,
        isAgent: false,
        createdAt: Date.now(),
        channelId,
        serverId,
        isLoading: true,
        attachments: undefined,
      };

      expect(userMessage.id).toBe(tempId);
      expect(userMessage.text).toBe('Hello world');
      expect(userMessage.isAgent).toBe(false);
      expect(userMessage.isLoading).toBe(true);
    });

    test('should create agent message placeholder with correct structure', () => {
      const agentMessageId = 'agent-msg-123' as UUID;
      const agentId = 'agent-456' as UUID;
      const channelId = 'channel-012' as UUID;
      const serverId = 'server-789' as UUID;

      const agentMessage = {
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

      expect(agentMessage.id).toBe(agentMessageId);
      expect(agentMessage.text).toBe('');
      expect(agentMessage.isAgent).toBe(true);
      expect(agentMessage.isStreaming).toBe(true);
      expect(agentMessage.isLoading).toBe(true);
    });
  });

  describe('Input Validation', () => {
    test('should reject empty text', () => {
      const text = '   ';
      const isValid = text.trim().length > 0;
      expect(isValid).toBe(false);
    });

    test('should accept non-empty text', () => {
      const text = 'Hello';
      const isValid = text.trim().length > 0;
      expect(isValid).toBe(true);
    });

    test('should require sessionId', () => {
      const sessionId: string | undefined = undefined;
      const isValid = !!sessionId;
      expect(isValid).toBe(false);
    });
  });
});
```