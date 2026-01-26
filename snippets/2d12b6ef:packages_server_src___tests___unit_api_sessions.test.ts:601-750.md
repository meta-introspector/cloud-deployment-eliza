# 2d12b6ef:packages_server_src___tests___unit_api_sessions.test.ts:601-750

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:601-750
**Novelty Score:** 35.43
**Concepts:** testing

```
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        undefined,
        {
          limit: '5',
          before: beforeTimestamp.toString(),
        }
      );

      expect(res.status).toBe(200);
      expect(res.body.messages).toHaveLength(5);

      // Verify all messages are before the cursor
      res.body.messages.forEach((msg: SimplifiedMessage) => {
        expect(new Date(msg.createdAt).getTime()).toBeLessThan(beforeTimestamp);
      });
    });

    it('should support after parameter for newer messages', async () => {
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
      for (let i = 0; i < 20; i++) {
        mockMessages.push({
          id: `msg-${i}`,
          content: `Message ${i}`,
          authorId: 'user-123',
          createdAt: new Date(baseTime - i * 1000),
          sourceType: 'test',
          metadata: {},
        });
      }

      // Mock getMessagesForChannel for "after" pagination
      (mockServerInstance.getMessagesForChannel as jest.Mock).mockImplementation(
        (_channelId, limit) => {
          return Promise.resolve(mockMessages.slice(0, limit));
        }
      );

      // Get messages with after cursor
      const afterTimestamp = baseTime - 15000; // 15 seconds before base time
      const res = await simulateRequest(
        app,
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        undefined,
        {
          limit: '5',
          after: afterTimestamp.toString(),
        }
      );

      expect(res.status).toBe(200);
      expect(res.body.messages).toBeDefined();
      expect(res.body).toHaveProperty('hasMore');
    });

    it('should support range queries with both before and after', async () => {
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
      for (let i = 0; i < 20; i++) {
        mockMessages.push({
          id: `msg-${i}`,
          content: `Message ${i}`,
          authorId: 'user-123',
          createdAt: new Date(baseTime - i * 1000),
          sourceType: 'test',
          metadata: {},
        });
      }

      // Mock for range query
      (mockServerInstance.getMessagesForChannel as jest.Mock).mockImplementation(
        (_channelId, limit, before) => {
          let filtered = [...mockMessages];
          if (before) {
            filtered = filtered.filter((msg) => msg.createdAt < before);
          }
          return Promise.resolve(filtered.slice(0, limit));
        }
      );

      // Get messages in a range
      const beforeTimestamp = baseTime - 5000;
      const afterTimestamp = baseTime - 15000;
      const res = await simulateRequest(
        app,
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        undefined,
        {
          limit: '10',
          before: beforeTimestamp.toString(),
          after: afterTimestamp.toString(),
        }
      );

      expect(res.status).toBe(200);
      expect(res.body.messages).toBeDefined();
    });
  });

  describe('GET /sessions/:sessionId - Get Session Info', () => {
    it('should retrieve session information', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent
      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
        metadata: { platform: 'test' },
      });

```