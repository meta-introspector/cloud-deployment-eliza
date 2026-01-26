# 67c3e03b:packages_api-client_src___tests___services_sessions.test.ts:301-450

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/api-client/src/__tests__/services/sessions.test.ts:301-450
**Novelty Score:** 14.99
**Concepts:** testing

```
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
        },
        json: async () => ({
          success: true,
          data: {
            messages: [],
            hasMore: false,
          },
        }),
      });

      // Should not throw, but invalid dates should be ignored
      const result = await service.getMessages(sessionId, params);

      expect(result.messages).toEqual([]);
      // URL should not contain 'NaN' for invalid dates
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).not.toContain('NaN');
    });

    it('should handle various date formats', async () => {
      const sessionId = 'session-789';
      const dateTimestamp = 1704067200000; // 2024-01-01T00:00:00.000Z

      // Test with timestamp number
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: { messages: [], hasMore: false },
        }),
      });

      await service.getMessages(sessionId, { before: dateTimestamp });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`before=${dateTimestamp}`),
        expect.any(Object)
      );

      // Test with valid date string
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: { messages: [], hasMore: false },
        }),
      });

      await service.getMessages(sessionId, { after: '2024-01-01T00:00:00.000Z' });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`after=${dateTimestamp}`),
        expect.any(Object)
      );
    });

    it('should throw error when sessionId is empty', async () => {
      await expect(service.getMessages('', {})).rejects.toThrow('sessionId is required');
    });
  });

  describe('deleteSession', () => {
    it('should delete a session', async () => {
      const sessionId = 'session-789';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: { success: true },
        }),
      });

      const result = await service.deleteSession(sessionId);

      expect(result.success).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions/session-789',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('listSessions', () => {
    it('should list all active sessions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            sessions: [
              {
                sessionId: 'session-1',
```