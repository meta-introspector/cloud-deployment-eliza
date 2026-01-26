# 67c3e03b:packages_server_src___tests___unit_api_channels-mode.test.ts:451-500

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/channels-mode.test.ts:451-500
**Novelty Score:** 14.99
**Concepts:** testing

```
            await options.onError(new Error('Provider connection failed'));
          }
          return { processing: { responseContent: { text: '' } } };
        }
      );

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, transport: 'sse' }
      );

      // SSE transport should still set SSE headers
      expect(res.headers['Content-Type']).toBe('text/event-stream');
      // The response body should contain error event
      expect(res.body).toBeDefined();
    });

    it('should handle thrown errors in http transport gracefully', async () => {
      mockHandleMessage.mockImplementation(() => {
        throw new Error('Unexpected provider error');
      });

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, transport: 'http' }
      );

      // Should return error status
      expect(res.status).toBeGreaterThanOrEqual(500);
    });

    it('should handle rejected promises in sse transport', async () => {
      mockHandleMessage.mockImplementation(() => Promise.reject(new Error('Network timeout')));

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, transport: 'sse' }
      );

      // SSE transport should still set SSE headers even on error
      expect(res.headers['Content-Type']).toBe('text/event-stream');
    });
  });
});
```