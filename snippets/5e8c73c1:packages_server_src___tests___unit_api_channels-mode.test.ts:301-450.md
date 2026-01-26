# 5e8c73c1:packages_server_src___tests___unit_api_channels-mode.test.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/api/channels-mode.test.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        ) => {
          if (options?.onResponse) {
            await options.onResponse({ text: 'Streamed response' });
          }
          return { processing: { responseContent: { text: 'Streamed response' } } };
        }
      );

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'stream' }
      );

      // Stream mode should set SSE headers
      expect(res.headers['Content-Type']).toBe('text/event-stream');
      expect(res.headers['Cache-Control']).toBe('no-cache');
      expect(res.headers['Connection']).toBe('keep-alive');
    });

    it('should validate all three modes are accepted', async () => {
      const modes = ['sync', 'stream', 'websocket'] as const;

      for (const mode of modes) {
        // Reset mock for stream mode
        if (mode === 'stream') {
          mockHandleMessage.mockImplementation(
            async (
              _agentId: unknown,
              _message: unknown,
              options?: { onResponse?: (content: unknown) => Promise<void> }
            ) => {
              if (options?.onResponse) {
                await options.onResponse({ text: 'Response' });
              }
              return { processing: { responseContent: { text: 'Response' } } };
            }
          );
        } else {
          mockHandleMessage.mockImplementation(() =>
            Promise.resolve({
              processing: { responseContent: { text: 'Response' } },
            })
          );
        }

        const res = await simulateRequest(
          app,
          'POST',
          `/api/messaging/channels/${channelId}/messages`,
          { ...validPayload, mode }
        );

        // None of the valid modes should return 400
        expect(res.status).not.toBe(400);
      }
    });

    it('should reject non-string mode parameter (number)', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 123 }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Mode must be a string');
    });

    it('should reject non-string mode parameter (boolean)', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: true }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Mode must be a string');
    });

    it('should reject non-string mode parameter (object)', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: { type: 'sync' } }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Mode must be a string');
    });
  });

  describe('Streaming Error Handling', () => {
    it('should handle provider errors in stream mode via onError callback', async () => {
      mockHandleMessage.mockImplementation(
        async (
          _agentId: unknown,
          _message: unknown,
          options?: { onError?: (error: Error) => Promise<void> }
        ) => {
          if (options?.onError) {
            await options.onError(new Error('Provider connection failed'));
          }
          return { processing: { responseContent: { text: '' } } };
        }
      );

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'stream' }
      );

      // Stream mode should still set SSE headers
      expect(res.headers['Content-Type']).toBe('text/event-stream');
      // The response body should contain error event
      expect(res.body).toBeDefined();
    });

    it('should handle thrown errors in sync mode gracefully', async () => {
      mockHandleMessage.mockImplementation(() => {
        throw new Error('Unexpected provider error');
      });

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'sync' }
      );

      // Should return error status
      expect(res.status).toBeGreaterThanOrEqual(500);
    });

    it('should handle rejected promises in stream mode', async () => {
      mockHandleMessage.mockImplementation(() => Promise.reject(new Error('Network timeout')));

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
```