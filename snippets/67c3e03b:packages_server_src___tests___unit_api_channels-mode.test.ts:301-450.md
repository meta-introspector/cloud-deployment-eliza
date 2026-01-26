# 67c3e03b:packages_server_src___tests___unit_api_channels-mode.test.ts:301-450

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/channels-mode.test.ts:301-450
**Novelty Score:** 14.99
**Concepts:** testing

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
        { ...validPayload, transport: 'sse' }
      );

      // SSE transport should set SSE headers
      expect(res.headers['Content-Type']).toBe('text/event-stream');
      expect(res.headers['Cache-Control']).toBe('no-cache');
      expect(res.headers['Connection']).toBe('keep-alive');
    });

    it('should validate all three transports are accepted', async () => {
      const transports = ['http', 'sse', 'websocket'] as const;

      for (const transport of transports) {
        // Reset mock for sse transport
        if (transport === 'sse') {
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
          { ...validPayload, transport }
        );

        // None of the valid transports should return 400
        expect(res.status).not.toBe(400);
      }
    });

    it('should reject non-string transport parameter (number)', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, transport: 123 }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Transport must be a string');
    });

    it('should reject non-string transport parameter (boolean)', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, transport: true }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Transport must be a string');
    });

    it('should reject non-string transport parameter (object)', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, transport: { type: 'http' } }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Transport must be a string');
    });

    it('should accept legacy mode parameter for backward compatibility', async () => {
      // Test with legacy 'sync' mode - should map to 'http'
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'sync' }
      );

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
      expect(res.body).toHaveProperty('agentResponse');
    });

    it('should accept legacy stream mode for backward compatibility', async () => {
      // Mock handleMessage to call the onResponse callback
      mockHandleMessage.mockImplementation(
        async (
          _agentId: unknown,
          _message: unknown,
          options?: { onResponse?: (content: unknown) => Promise<void> }
        ) => {
          if (options?.onResponse) {
            await options.onResponse({ text: 'Streamed response' });
          }
          return { processing: { responseContent: { text: 'Streamed response' } } };
        }
      );

      // Test with legacy 'stream' mode - should map to 'sse'
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'stream' }
      );

      // Should set SSE headers like 'sse' transport
      expect(res.headers['Content-Type']).toBe('text/event-stream');
    });
  });

  describe('Streaming Error Handling', () => {
    it('should handle provider errors in sse transport via onError callback', async () => {
      mockHandleMessage.mockImplementation(
        async (
          _agentId: unknown,
          _message: unknown,
          options?: { onError?: (error: Error) => Promise<void> }
        ) => {
          if (options?.onError) {
```