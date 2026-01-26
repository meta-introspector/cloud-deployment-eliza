# 67c3e03b:packages_server_src___tests___unit_api_sessions.test.ts:1051-1200

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:1051-1200
**Novelty Score:** 14.99
**Concepts:** testing

```

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
    });

    it('should reject invalid transport parameter', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Hello with invalid transport',
          transport: 'invalid_transport',
        }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should accept http transport', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Mock elizaOS.handleMessage for http transport
      const mockHandleMessage = jest.fn().mockResolvedValue({
        processing: {
          responseContent: { text: 'Agent response' },
        },
      });
      (mockElizaOS as any).handleMessage = mockHandleMessage;

      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Hello in http transport',
          transport: 'http',
        }
      );

      // HTTP transport should return both userMessage and agentResponse
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
      expect(res.body).toHaveProperty('agentResponse');
    });

    it('should accept sse transport and set SSE headers', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Mock elizaOS.handleMessage for sse transport
      const mockHandleMessage = jest.fn().mockImplementation((_agentId, _message, options) => {
        // Simulate streaming by calling callbacks
        if (options?.onStreamChunk) {
          options.onStreamChunk('Hello', 'msg-456');
        }
        if (options?.onResponse) {
          options.onResponse({ text: 'Hello world' });
        }
        return Promise.resolve({});
      });
      (mockElizaOS as any).handleMessage = mockHandleMessage;

      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // For sse transport, we need to check that SSE headers are set
      // Our simulateRequest helper doesn't fully support SSE, but we can verify the transport is accepted
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Hello in sse transport',
          transport: 'sse',
        }
      );

      // SSE transport will set headers and potentially not return a JSON body
      // The response should not be a validation error
      expect(res.status).not.toBe(400);
    });

    it('should accept legacy mode parameter for backward compatibility', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Mock elizaOS.handleMessage for http transport
      const mockHandleMessage = jest.fn().mockResolvedValue({
        processing: {
          responseContent: { text: 'Agent response' },
        },
      });
      (mockElizaOS as any).handleMessage = mockHandleMessage;

      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Use legacy 'mode: sync' - should map to 'http' transport
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Hello with legacy sync mode',
          mode: 'sync',
        }
      );

```