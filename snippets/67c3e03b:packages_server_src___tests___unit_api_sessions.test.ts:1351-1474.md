# 67c3e03b:packages_server_src___tests___unit_api_sessions.test.ts:1351-1474

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:1351-1474
**Novelty Score:** 14.99
**Concepts:** testing

```

    it('should handle invalid timestamps in pagination', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create a session first
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Test with invalid before timestamp
      const beforeRes = await simulateRequest(
        app,
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        null,
        { before: 'invalid-timestamp' }
      );

      expect(beforeRes.status).toBe(400);
      expect(beforeRes.body).toHaveProperty('error');
      // The error handler returns VALIDATION_ERROR for general validation errors
      expect(beforeRes.body.error.code).toMatch(/INVALID_PAGINATION|VALIDATION_ERROR/);

      // Test with invalid after timestamp
      const afterRes = await simulateRequest(
        app,
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        null,
        { after: 'NaN' }
      );

      expect(afterRes.status).toBe(400);
      expect(afterRes.body).toHaveProperty('error');
      // The error handler returns VALIDATION_ERROR for general validation errors
      expect(afterRes.body.error.code).toMatch(/INVALID_PAGINATION|VALIDATION_ERROR/);
    });

    it('should handle extreme timeout values with proper clamping', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Test with extremely large timeout
      const largeRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
        timeoutConfig: {
          timeoutMinutes: 999999,
          maxDurationMinutes: 999999,
        },
      });

      expect(largeRes.status).toBe(201);
      // Should be clamped to maximum allowed values
      expect(largeRes.body.timeoutConfig.timeoutMinutes).toBeLessThanOrEqual(1440);
      expect(largeRes.body.timeoutConfig.maxDurationMinutes).toBeLessThanOrEqual(2880);

      // Test with negative timeout
      const negativeRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
        timeoutConfig: {
          timeoutMinutes: -10,
          warningThresholdMinutes: -5,
        },
      });

      expect(negativeRes.status).toBe(201);
      // Should be clamped to minimum allowed values
      expect(negativeRes.body.timeoutConfig.timeoutMinutes).toBeGreaterThanOrEqual(5);
      expect(negativeRes.body.timeoutConfig.warningThresholdMinutes).toBeGreaterThanOrEqual(1);
    });

    it('should handle PATCH timeout with invalid values', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create a session first
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Update timeout with invalid string values that would produce NaN when parsed
      // Note: NaN and Infinity cannot be represented directly in JSON, so we use strings
      const patchRes = await simulateRequest(
        app,
        'PATCH',
        `/api/messaging/sessions/${sessionId}/timeout`,
        {
          timeoutMinutes: 'not-a-number',
          maxDurationMinutes: 'invalid',
          warningThresholdMinutes: 'abc123',
        }
      );

      expect(patchRes.status).toBe(200);
      expect(patchRes.body).toHaveProperty('timeoutConfig');

      // Should use defaults for invalid values
      expect(patchRes.body.timeoutConfig.timeoutMinutes).toBeNumber();
      expect(patchRes.body.timeoutConfig.timeoutMinutes).toBeFinite();
      expect(patchRes.body.timeoutConfig.maxDurationMinutes).toBeNumber();
      expect(patchRes.body.timeoutConfig.maxDurationMinutes).toBeFinite();
      expect(patchRes.body.timeoutConfig.warningThresholdMinutes).toBeNumber();
      expect(patchRes.body.timeoutConfig.warningThresholdMinutes).toBeFinite();
    });
  });
});
```