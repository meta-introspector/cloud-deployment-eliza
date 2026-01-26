# 2d12b6ef:packages_server_src_api_messaging_sessions.ts:1051-1200

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:1051-1200
**Novelty Score:** 35.43
**Concepts:** testing

```
      }

      res.json(response);
    })
  );

  /**
   * Renew a session manually
   * POST /api/messaging/sessions/:sessionId/renew
   */
  router.post(
    '/sessions/:sessionId/renew',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      const session = sessions.get(sessionId);

      if (!session) {
        throw new SessionNotFoundError(sessionId);
      }

      // Check if session is expired
      if (session.expiresAt.getTime() <= Date.now()) {
        sessions.delete(sessionId);
        throw new SessionExpiredError(sessionId, session.expiresAt);
      }

      // Check if auto-renew is disabled (manual renewal is always allowed)
      const previousAutoRenew = session.timeoutConfig.autoRenew;
      session.timeoutConfig.autoRenew = true; // Temporarily enable for manual renewal

      const renewed = renewSession(session);

      // Restore original auto-renew setting
      session.timeoutConfig.autoRenew = previousAutoRenew;

      if (!renewed) {
        throw new SessionRenewalError(sessionId, 'Maximum duration reached', {
          maxDuration: session.timeoutConfig.maxDurationMinutes,
          createdAt: session.createdAt,
          timeSinceCreation: Date.now() - session.createdAt.getTime(),
        });
      }

      const response = createSessionInfoResponse(session);
      res.json(response);
    })
  );

  /**
   * Update session timeout configuration
   * PATCH /api/messaging/sessions/:sessionId/timeout
   */
  router.patch(
    '/sessions/:sessionId/timeout',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      const newConfig: SessionTimeoutConfig = req.body;

      const session = sessions.get(sessionId);
      if (!session) {
        throw new SessionNotFoundError(sessionId);
      }

      // Check if session is expired
      if (session.expiresAt.getTime() <= Date.now()) {
        sessions.delete(sessionId);
        throw new SessionExpiredError(sessionId, session.expiresAt);
      }

      // Validate the new config structure
      if (!isValidTimeoutConfig(newConfig)) {
        throw new InvalidTimeoutConfigError('Invalid timeout configuration format', newConfig);
      }

      // Validate numeric bounds only for valid numbers
      if (newConfig.timeoutMinutes !== undefined) {
        const timeoutValue = Number(newConfig.timeoutMinutes);
        // Only validate range if it's a valid number (NaN will be handled by mergeTimeoutConfigs)
        if (!isNaN(timeoutValue) && isFinite(timeoutValue)) {
          if (timeoutValue < MIN_TIMEOUT_MINUTES || timeoutValue > MAX_TIMEOUT_MINUTES) {
            throw new InvalidTimeoutConfigError(
              `Timeout must be between ${MIN_TIMEOUT_MINUTES} and ${MAX_TIMEOUT_MINUTES} minutes`,
              newConfig
            );
          }
        }
      }

      // Merge the new config with existing
      const agent = elizaOS.getAgent(session.agentId);
      const agentConfig = agent ? getAgentTimeoutConfig(agent) : undefined;
      session.timeoutConfig = mergeTimeoutConfigs(newConfig, agentConfig);

      // Recalculate expiration with new config
      session.expiresAt = calculateExpirationDate(
        session.createdAt,
        session.lastActivity,
        session.timeoutConfig,
        session.renewalCount
      );

      logger.debug(
        {
          src: 'http',
          sessionId,
          timeoutMinutes: session.timeoutConfig.timeoutMinutes,
          autoRenew: session.timeoutConfig.autoRenew,
          maxDuration: session.timeoutConfig.maxDurationMinutes,
        },
        'Session timeout config updated'
      );

      const response = createSessionInfoResponse(session);
      res.json(response);
    })
  );

  /**
   * Keep session alive with heartbeat
   * POST /api/messaging/sessions/:sessionId/heartbeat
   */
  router.post(
    '/sessions/:sessionId/heartbeat',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      const session = sessions.get(sessionId);

      if (!session || !isValidSession(session)) {
        throw new SessionNotFoundError(sessionId);
      }

      // Check if session is expired
      if (session.expiresAt.getTime() <= Date.now()) {
        sessions.delete(sessionId);
        throw new SessionExpiredError(sessionId, session.expiresAt);
      }

      // Update last activity
      session.lastActivity = new Date();

      // Renew session if auto-renew is enabled
      if (session.timeoutConfig.autoRenew) {
        const renewed = renewSession(session);
        if (renewed) {
          logger.debug({ src: 'http', sessionId }, 'Session renewed via heartbeat');
        }
      }

      // Return updated session info
      const response = createSessionInfoResponse(session);
```