# 2d12b6ef:packages_server_src___tests___unit_api_sessions.test.ts:751-900

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:751-900
**Novelty Score:** 35.43
**Concepts:** testing

```
      const sessionId = createRes.body.sessionId;

      // Get session info
      const res = await simulateRequest(app, 'GET', `/api/messaging/sessions/${sessionId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('sessionId', sessionId);
      expect(res.body).toHaveProperty('channelId');
      expect(res.body).toHaveProperty('agentId', agentId);
      expect(res.body).toHaveProperty('userId', userId);
      expect(res.body).toHaveProperty('metadata');
      expect(res.body.metadata).toHaveProperty('platform', 'test');
      expect(res.body).toHaveProperty('timeRemaining');
      expect(res.body).toHaveProperty('isNearExpiration');
      expect(res.body).toHaveProperty('renewalCount');
      // Verify the channel ID is a valid UUID
      expect(isValidUuid(res.body.channelId)).toBe(true);
    });

    it('should return 404 for non-existent session', async () => {
      const res = await simulateRequest(app, 'GET', '/api/messaging/sessions/non-existent-session');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'SESSION_NOT_FOUND');
    });
  });

  describe('PATCH /sessions/:sessionId/timeout - Update Timeout', () => {
    it('should update session timeout configuration', async () => {
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

      // Update timeout
      const res = await simulateRequest(
        app,
        'PATCH',
        `/api/messaging/sessions/${sessionId}/timeout`,
        {
          timeoutMinutes: 90,
          autoRenew: false,
        }
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('sessionId', sessionId);
      expect(res.body).toHaveProperty('expiresAt');
      expect(res.body).toHaveProperty('timeoutConfig');
      expect(res.body.timeoutConfig.timeoutMinutes).toBe(90);
      expect(res.body.timeoutConfig.autoRenew).toBe(false);
    });

    it('should reject invalid timeout values', async () => {
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

      // Try to update with invalid timeout (too small)
      const res = await simulateRequest(
        app,
        'PATCH',
        `/api/messaging/sessions/${sessionId}/timeout`,
        {
          timeoutMinutes: 1, // Less than minimum (5)
        }
      );

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /sessions/:sessionId - Delete Session', () => {
    it('should delete an existing session', async () => {
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

      // Delete session
      const res = await simulateRequest(app, 'DELETE', `/api/messaging/sessions/${sessionId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('deleted successfully');

      // Verify session is deleted by trying to get it
      const getRes = await simulateRequest(app, 'GET', `/api/messaging/sessions/${sessionId}`);

      expect(getRes.status).toBe(404);
    });

    it('should return 404 when trying to delete non-existent session', async () => {
      const res = await simulateRequest(
        app,
        'DELETE',
        '/api/messaging/sessions/non-existent-session'
      );

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'SESSION_NOT_FOUND');
    });
  });

  describe('POST /sessions/:sessionId/heartbeat - Session Heartbeat', () => {
    it('should keep session alive with heartbeat', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent
      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
```