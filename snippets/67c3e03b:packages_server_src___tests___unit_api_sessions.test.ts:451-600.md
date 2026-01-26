# 67c3e03b:packages_server_src___tests___unit_api_sessions.test.ts:451-600

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:451-600
**Novelty Score:** 14.99
**Concepts:** testing

```
      const res = await simulateRequest(
        app,
        'POST',
        '/api/messaging/sessions/non-existent-session/messages',
        {
          content: 'Hello, world!',
        }
      );

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'SESSION_NOT_FOUND');
    });

    it('should renew session on activity when autoRenew is enabled', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent with autoRenew enabled
      const agent = createMockAgent(agentId, {
        SESSION_AUTO_RENEW: true,
      });
      mockAgents.set(agentId as UUID, agent);

      // Create session
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;
      const originalExpiry = new Date(createRes.body.expiresAt);

      // Send message (which should renew the session)
      await simulateRequest(app, 'POST', `/api/messaging/sessions/${sessionId}/messages`, {
        content: 'Test message',
      });

      // Get session info to check if it was renewed
      const infoRes = await simulateRequest(app, 'GET', `/api/messaging/sessions/${sessionId}`);

      const newExpiry = new Date(infoRes.body.expiresAt);
      expect(newExpiry.getTime()).toBeGreaterThanOrEqual(originalExpiry.getTime());
    });
  });

  describe('GET /sessions/:sessionId/messages - Get Messages', () => {
    it('should retrieve messages with pagination', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent
      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Mock messages
      const mockMessages: any[] = [];
      const baseTime = Date.now();
      for (let i = 0; i < 15; i++) {
        mockMessages.push({
          id: `msg-${i}`,
          content: `Message ${i}`,
          authorId: 'user-123' as UUID,
          createdAt: new Date(baseTime - i * 1000),
          sourceType: 'test',
          metadata: {},
        });
      }

      // Mock getMessagesForChannel to return messages
      (mockServerInstance.getMessagesForChannel as jest.Mock).mockResolvedValue(
        mockMessages.slice(0, 10)
      );

      // Get messages
      const res = await simulateRequest(
        app,
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        undefined,
        { limit: '10' }
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('messages');
      expect(res.body).toHaveProperty('hasMore');
      expect(res.body.messages).toHaveLength(10);

      // Verify message structure
      const firstMessage = res.body.messages[0];
      expect(firstMessage).toHaveProperty('id');
      expect(firstMessage).toHaveProperty('content');
      expect(firstMessage).toHaveProperty('authorId');
      expect(firstMessage).toHaveProperty('createdAt');
    });

    it('should support cursor-based pagination with before parameter', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent
      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Mock messages with different timestamps
      const mockMessages: any[] = [];
      const baseTime = Date.now();
      for (let i = 0; i < 20; i++) {
        mockMessages.push({
          id: `msg-${i}`,
          content: `Message ${i}`,
          authorId: 'user-123' as UUID,
          createdAt: new Date(baseTime - i * 1000), // Each message 1 second older
          sourceType: 'test',
          metadata: {},
        });
      }

      // Mock getMessagesForChannel for "before" pagination
      (mockServerInstance.getMessagesForChannel as jest.Mock).mockImplementation(
        (_channelId, limit, before) => {
          let filtered = [...mockMessages];
          if (before) {
            const beforeDate = typeof before === 'string' ? new Date(before) : before;
            filtered = filtered.filter((msg) => msg.createdAt < beforeDate);
          }
          return Promise.resolve(filtered.slice(0, limit));
        }
      );

      // Get messages with before cursor
      const beforeTimestamp = baseTime - 5000; // 5 seconds before base time
      const res = await simulateRequest(
        app,
```