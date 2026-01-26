# 2d12b6ef:packages_server_src___tests___unit_api_sessions.test.ts:901-1050

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:901-1050
**Novelty Score:** 35.43
**Concepts:** testing

```
        userId,
      });

      const sessionId = createRes.body.sessionId;
      const originalExpiry = new Date(createRes.body.expiresAt);

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Send heartbeat
      const heartbeatRes = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/heartbeat`
      );

      expect(heartbeatRes.status).toBe(200);
      expect(heartbeatRes.body).toHaveProperty('sessionId', sessionId);
      expect(heartbeatRes.body).toHaveProperty('expiresAt');

      // Verify session was renewed (expiry should be later)
      const newExpiry = new Date(heartbeatRes.body.expiresAt);
      expect(newExpiry.getTime()).toBeGreaterThanOrEqual(originalExpiry.getTime());
    });

    it('should return 404 for non-existent session heartbeat', async () => {
      const res = await simulateRequest(
        app,
        'POST',
        '/api/messaging/sessions/non-existent-session/heartbeat'
      );

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'SESSION_NOT_FOUND');
    });

    it.skip('should not renew expired session on heartbeat', async () => {
      // SKIP: Cannot test expiration with minimum timeout of 5 minutes
      // The API enforces a minimum timeout of 5 minutes, so we cannot
      // create a session that expires in less than a second for testing.
      // This test would need to wait at least 5 minutes to properly test expiration.

      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent with minimum timeout (5 minutes)
      const agent = createMockAgent(agentId, {
        SESSION_TIMEOUT_MINUTES: 5,
      });
      mockAgents.set(agentId as UUID, agent);

      // Create session with minimum timeout
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
        timeoutConfig: {
          timeoutMinutes: 5, // Minimum allowed
          autoRenew: false,
        },
      });

      const sessionId = createRes.body.sessionId;

      // Would need to wait 5+ minutes for session to expire
      // await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000 + 1000));

      // Try to send heartbeat to expired session
      const heartbeatRes = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/heartbeat`
      );

      // The session should be expired
      expect(heartbeatRes.status).toBe(410);
      expect(heartbeatRes.body).toHaveProperty('error');
      if (typeof heartbeatRes.body.error === 'object') {
        expect(heartbeatRes.body.error).toHaveProperty('code', 'SESSION_EXPIRED');
      }
    });
  });

  describe('GET /sessions/health - Health Check', () => {
    it('should return health status', async () => {
      const res = await simulateRequest(app, 'GET', '/api/messaging/sessions/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('activeSessions');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Transport Parameter', () => {
    it('should default to websocket transport when transport is not specified', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session first
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Send message without specifying transport (should default to websocket)
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Hello, world!',
        }
      );

      // In websocket transport, response should be immediate with userMessage only
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
    });

    it('should accept explicit websocket transport', async () => {
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
          content: 'Hello with explicit websocket transport',
          transport: 'websocket',
        }
      );
```