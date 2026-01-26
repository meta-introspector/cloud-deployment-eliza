# e5b94879:packages_api-client_src___tests___services_sessions.test.ts:151-300

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/api-client/src/__tests__/services/sessions.test.ts:151-300
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
        transport: 'http' as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            success: true,
            userMessage: {
              id: 'msg-123',
              content: 'Hello, agent!',
              authorId: 'user-456',
              createdAt: '2024-01-01T00:00:00.000Z',
            },
            agentResponse: {
              text: 'Hello! How can I help you today?',
              thought: 'User is greeting me',
            },
          },
        }),
      });

      const result = await service.sendMessage(sessionId, params);

      expect(result.success).toBe(true);
      expect(result.userMessage.id).toBe('msg-123');
      expect(result.agentResponse).toBeDefined();
      expect(result.agentResponse?.text).toBe('Hello! How can I help you today?');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions/session-789/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(params),
        })
      );
    });

    it('should throw error when sessionId is empty', async () => {
      const params = { content: 'Hello' };
      await expect(service.sendMessage('', params)).rejects.toThrow('sessionId is required');
    });

    it('should throw error when content is empty', async () => {
      await expect(service.sendMessage('session-123', { content: '' })).rejects.toThrow(
        'content is required'
      );
    });
  });

  describe('sendMessageSync', () => {
    it('should send a message with http transport automatically', async () => {
      const sessionId = 'session-789';
      const params = { content: 'Hello, agent!' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            success: true,
            userMessage: {
              id: 'msg-123',
              content: 'Hello, agent!',
              authorId: 'user-456',
              createdAt: '2024-01-01T00:00:00.000Z',
            },
            agentResponse: {
              text: 'Hi there!',
            },
          },
        }),
      });

      const result = await service.sendMessageSync(sessionId, params);

      expect(result.success).toBe(true);
      expect(result.agentResponse?.text).toBe('Hi there!');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions/session-789/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ...params, transport: 'http' }),
        })
      );
    });
  });

  describe('getMessages', () => {
    it('should get messages with pagination', async () => {
      const sessionId = 'session-789';
      const params = {
        limit: 20,
        before: new Date('2024-01-01T00:00:00.000Z'),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            messages: [
              {
                id: 'msg-1',
                content: 'Hello',
                authorId: 'user-456',
                isAgent: false,
                createdAt: '2024-01-01T00:00:00.000Z',
                metadata: {},
              },
            ],
            hasMore: true,
          },
        }),
      });

      const result = await service.getMessages(sessionId, params);

      expect(result.messages).toHaveLength(1);
      expect(result.hasMore).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=20'),
        expect.any(Object)
      );
    });

    it('should handle invalid date strings gracefully', async () => {
      const sessionId = 'session-789';
      const params = {
        before: 'invalid-date-string',
        after: 'another-invalid-date',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
```