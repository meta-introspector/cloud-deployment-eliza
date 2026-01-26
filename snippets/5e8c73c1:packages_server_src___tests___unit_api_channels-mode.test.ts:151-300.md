# 5e8c73c1:packages_server_src___tests___unit_api_channels-mode.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/api/channels-mode.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          responseSent = true;
          responseBody = data;
          resolve({ status: responseStatus, body: data, headers: responseHeaders });
        }
        return this;
      },
      setHeader(name: string, value: string) {
        responseHeaders[name] = value;
        return this;
      },
      set(name: string, value: string) {
        responseHeaders[name] = value;
        return this;
      },
      flushHeaders() {
        return this;
      },
      write(data: string) {
        if (!responseSent && responseHeaders['Content-Type'] === 'text/event-stream') {
          responseBody = ((responseBody as string) || '') + data;
        }
        return true;
      },
      end() {
        if (!responseSent) {
          responseSent = true;
          resolve({ status: responseStatus, body: responseBody, headers: responseHeaders });
        }
      },
    };

    const next = (err?: unknown) => {
      if (!responseSent) {
        if (err) {
          const error = err as { statusCode?: number; status?: number; message?: string };
          responseStatus = error.statusCode || error.status || 500;
          responseBody = { error: error.message || 'Internal Server Error' };
        } else {
          responseStatus = 404;
          responseBody = { error: 'Not found' };
        }
        resolve({ status: responseStatus, body: responseBody, headers: responseHeaders });
      }
    };

    try {
      (app as unknown as (req: unknown, res: unknown, next: unknown) => void)(req, res, next);
    } catch (error: unknown) {
      if (!responseSent) {
        responseStatus = 500;
        responseBody = { error: (error as Error).message || 'Internal Server Error' };
        resolve({ status: responseStatus, body: responseBody, headers: responseHeaders });
      }
    }
  });
}

describe('Channels API - Response Mode Parameter', () => {
  let app: express.Application;

  const channelId = '123e4567-e89b-12d3-a456-426614174000';
  const validPayload = {
    author_id: '456e7890-e89b-12d3-a456-426614174000',
    content: 'Hello, world!',
    message_server_id: '00000000-0000-0000-0000-000000000001',
  };

  beforeEach(() => {
    // Reset mock implementations
    mockHandleMessage.mockImplementation(() =>
      Promise.resolve({
        processing: {
          responseContent: { text: 'Agent response' },
        },
      })
    );

    // Create Express app and router
    app = express();
    app.use(express.json());
    const router = createChannelsRouter(mockElizaOS, mockServerInstance);
    app.use('/api/messaging', router);
  });

  describe('POST /channels/:channelId/messages', () => {
    it('should default to websocket mode when mode is not specified', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        validPayload
      );

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
      // WebSocket mode doesn't include agentResponse
      expect(res.body).not.toHaveProperty('agentResponse');
    });

    it('should accept explicit websocket mode', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'websocket' }
      );

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
    });

    it('should reject invalid mode parameter', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/channels/${channelId}/messages`,
        { ...validPayload, mode: 'invalid_mode' }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect((res.body as { error: string }).error).toContain('Invalid mode');
    });

    it('should accept sync mode and return agentResponse', async () => {
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
      expect((res.body as { agentResponse: { text: string } }).agentResponse).toEqual({
        text: 'Agent response',
      });
    });

    it('should accept stream mode and set SSE headers', async () => {
      // Mock handleMessage to call the onResponse callback
      mockHandleMessage.mockImplementation(
        async (
          _agentId: unknown,
          _message: unknown,
          options?: { onResponse?: (content: unknown) => Promise<void> }
```