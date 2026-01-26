# 2d12b6ef:packages_server_src___tests___unit_api_sessions.test.ts:1201-1350

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:1201-1350
**Novelty Score:** 35.43
**Concepts:** testing

```
      // Should work like http transport
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
      expect(res.body).toHaveProperty('agentResponse');
    });
  });

  describe('NaN and Invalid Number Handling', () => {
    it('should handle NaN in agent timeout settings gracefully', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent with invalid settings that would produce NaN
      const agent = createMockAgent(agentId, {
        SESSION_TIMEOUT_MINUTES: 'not-a-number',
        SESSION_MAX_DURATION_MINUTES: 'invalid',
        SESSION_WARNING_THRESHOLD_MINUTES: 'abc',
      });
      mockAgents.set(agentId as UUID, agent);

      // Create session - should use defaults instead of NaN
      const res = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('sessionId');
      expect(res.body).toHaveProperty('timeoutConfig');

      // Should have valid default values, not NaN
      expect(res.body.timeoutConfig.timeoutMinutes).toBeNumber();
      expect(res.body.timeoutConfig.timeoutMinutes).not.toBeNaN();
      expect(res.body.timeoutConfig.timeoutMinutes).toBeGreaterThan(0);

      expect(res.body.timeoutConfig.maxDurationMinutes).toBeNumber();
      expect(res.body.timeoutConfig.maxDurationMinutes).not.toBeNaN();

      expect(res.body.timeoutConfig.warningThresholdMinutes).toBeNumber();
      expect(res.body.timeoutConfig.warningThresholdMinutes).not.toBeNaN();

      // Expiration date should be valid
      const expiresAt = new Date(res.body.expiresAt);
      expect(expiresAt).toBeValidDate();
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should handle invalid numeric strings in session config', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session with invalid numeric values that parseInt would return NaN for
      const res = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
        timeoutConfig: {
          timeoutMinutes: 'NaN' as any,
          maxDurationMinutes: 'Infinity' as any,
          warningThresholdMinutes: '-Infinity' as any,
        },
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('sessionId');
      expect(res.body).toHaveProperty('timeoutConfig');

      // Should have valid default values instead of NaN/Infinity
      expect(res.body.timeoutConfig.timeoutMinutes).toBeNumber();
      expect(res.body.timeoutConfig.timeoutMinutes).toBeFinite();
      expect(res.body.timeoutConfig.timeoutMinutes).toBeGreaterThan(0);

      expect(res.body.timeoutConfig.maxDurationMinutes).toBeNumber();
      expect(res.body.timeoutConfig.maxDurationMinutes).toBeFinite();

      expect(res.body.timeoutConfig.warningThresholdMinutes).toBeNumber();
      expect(res.body.timeoutConfig.warningThresholdMinutes).toBeFinite();
    });

    it('should handle edge case numeric values in timeout config', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Test various edge cases
      const testCases = [
        { value: null, description: 'null' },
        { value: undefined, description: 'undefined' },
        { value: '', description: 'empty string' },
        { value: '  ', description: 'whitespace' },
        { value: '12.34.56', description: 'multiple decimals' },
        { value: '10e308', description: 'very large number' },
        { value: '-10e308', description: 'very large negative' },
        { value: '0x10', description: 'hex notation' },
        { value: '010', description: 'octal notation' },
        { value: '1,000', description: 'comma-separated' },
      ];

      for (const testCase of testCases) {
        const res = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
          agentId,
          userId,
          timeoutConfig: {
            timeoutMinutes: testCase.value as any,
          },
        });

        expect(res.status).toBe(201);
        expect(res.body.timeoutConfig.timeoutMinutes).toBeNumber();
        expect(res.body.timeoutConfig.timeoutMinutes).toBeFinite();
        expect(res.body.timeoutConfig.timeoutMinutes).toBeGreaterThan(0);
        expect(res.body.timeoutConfig.timeoutMinutes).toBeLessThanOrEqual(1440);
      }
    });

    it('should handle NaN in pagination parameters', async () => {
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

      // Test with invalid limit parameter that would produce NaN
      const res = await simulateRequest(
        app,
        'GET',
        `/api/messaging/sessions/${sessionId}/messages`,
        null,
        { limit: 'not-a-number' }
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('messages');
      expect(res.body).toHaveProperty('hasMore');
      // Should use default limit instead of NaN
      expect(Array.isArray(res.body.messages)).toBe(true);
    });
```