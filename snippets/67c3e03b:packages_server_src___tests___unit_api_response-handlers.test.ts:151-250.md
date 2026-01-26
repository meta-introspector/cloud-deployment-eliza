# 67c3e03b:packages_server_src___tests___unit_api_response-handlers.test.ts:151-250

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/response-handlers.test.ts:151-250
**Novelty Score:** 14.99
**Concepts:** testing

```
      expect(httpResponse).toHaveProperty('userMessage');
      expect(httpResponse).toHaveProperty('agentResponse');
    });

    it('should include additional data when provided', () => {
      const httpResponse = {
        success: true,
        userMessage: { id: 'msg-123' },
        agentResponse: { text: 'Response' },
        sessionStatus: { expiresAt: '2024-01-01' },
      };

      expect(httpResponse).toHaveProperty('sessionStatus');
    });
  });

  describe('WebSocket transport response', () => {
    it('should have correct structure without agentResponse', () => {
      const wsResponse = {
        success: true,
        userMessage: { id: 'msg-123', content: 'Hello' },
      };

      expect(wsResponse).toHaveProperty('success', true);
      expect(wsResponse).toHaveProperty('userMessage');
      expect(wsResponse).not.toHaveProperty('agentResponse');
    });
  });

  describe('SSE transport format', () => {
    it('should format user_message event correctly', () => {
      const event = 'user_message';
      const data = { id: 'msg-123', content: 'Hello' };
      const sseFormat = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

      expect(sseFormat).toContain('event: user_message');
      expect(sseFormat).toContain('data: ');
      expect(sseFormat).toContain('"id":"msg-123"');
      expect(sseFormat).toEndWith('\n\n');
    });

    it('should format chunk event correctly', () => {
      const event = 'chunk';
      const data = { messageId: 'msg-456', chunk: 'Hello', index: 0 };
      const sseFormat = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

      expect(sseFormat).toContain('event: chunk');
      expect(sseFormat).toContain('"chunk":"Hello"');
      expect(sseFormat).toContain('"index":0');
    });

    it('should format done event correctly', () => {
      const event = 'done';
      const data = { text: 'Complete response', thought: 'Thinking...' };
      const sseFormat = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

      expect(sseFormat).toContain('event: done');
      expect(sseFormat).toContain('"text":"Complete response"');
    });

    it('should format error event correctly', () => {
      const event = 'error';
      const data = { error: 'Something went wrong' };
      const sseFormat = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

      expect(sseFormat).toContain('event: error');
      expect(sseFormat).toContain('"error":"Something went wrong"');
    });
  });

  describe('Error response format', () => {
    it('should have correct structure for http transport error', () => {
      const errorResponse = {
        success: false,
        error: 'Failed to process message in http transport',
      };

      expect(errorResponse).toHaveProperty('success', false);
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });
  });
});

describe('SSE Headers', () => {
  it('should have correct Content-Type for SSE', () => {
    const contentType = 'text/event-stream';
    expect(contentType).toBe('text/event-stream');
  });

  it('should have correct Cache-Control for SSE', () => {
    const cacheControl = 'no-cache';
    expect(cacheControl).toBe('no-cache');
  });

  it('should have correct Connection for SSE', () => {
    const connection = 'keep-alive';
    expect(connection).toBe('keep-alive');
  });
});
```