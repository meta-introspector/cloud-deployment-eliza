# 67c3e03b:packages_server_src_api_messaging_sessions.ts:1201-1326

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:1201-1326
**Novelty Score:** 14.99
**Concepts:** testing

```
      if (!session) {
        throw new SessionNotFoundError(sessionId);
      }

      // Remove session from memory
      sessions.delete(sessionId);

      logger.info({ src: 'http', sessionId }, 'Session deleted');

      res.json({
        success: true,
        message: `Session ${sessionId} deleted successfully`,
      });
    })
  );

  /**
   * List active sessions (admin endpoint)
   * GET /api/messaging/sessions
   */
  router.get(
    '/sessions',
    asyncHandler(async (_req: express.Request, res: express.Response) => {
      const now = Date.now();
      const activeSessions = Array.from(sessions.values())
        .filter((session) => isValidSession(session) && session.expiresAt.getTime() > now)
        .map((session) => createSessionInfoResponse(session));

      res.json({
        sessions: activeSessions,
        total: activeSessions.length,
        stats: {
          totalSessions: sessions.size,
          activeSessions: activeSessions.length,
          expiredSessions: sessions.size - activeSessions.length,
        },
      });
    })
  );

  // Cleanup old sessions periodically
  const cleanupInterval = setInterval(() => {
    const now = new Date();
    let cleanedCount = 0;
    let expiredCount = 0;
    let warningCount = 0;

    for (const [sessionId, session] of sessions.entries()) {
      // Validate session structure before processing
      if (!isValidSession(session)) {
        logger.warn({ src: 'http', sessionId }, 'Invalid session structure, removing');
        sessions.delete(sessionId);
        cleanedCount++;
        continue;
      }

      // Check if session has expired
      if (session.expiresAt.getTime() <= now.getTime()) {
        sessions.delete(sessionId);
        cleanedCount++;
        expiredCount++;
        logger.debug({ src: 'http', sessionId }, 'Cleaned up expired session');
      }
      // Check if we should warn about upcoming expiration
      else if (shouldWarnAboutExpiration(session) && !session.warningState?.sent) {
        session.warningState = {
          sent: true,
          sentAt: now,
        };
        warningCount++;
        logger.debug({ src: 'http', sessionId }, 'Session will expire soon');
      }
    }

    if (cleanedCount > 0) {
      logger.info({ src: 'http', cleanedCount, warningCount }, 'Session cleanup completed');
    }
  }, CLEANUP_INTERVAL_MS);

  // Track this cleanup interval
  activeCleanupIntervals.add(cleanupInterval);

  // Create cleanup function that properly removes resources
  const cleanup = () => {
    // Clear this specific interval
    if (activeCleanupIntervals.has(cleanupInterval)) {
      clearInterval(cleanupInterval);
      activeCleanupIntervals.delete(cleanupInterval);
    }
  };

  // Register process handlers only once globally
  if (!processHandlersRegistered) {
    processHandlersRegistered = true;

    const globalCleanup = () => {
      // Clear all active intervals
      for (const interval of activeCleanupIntervals) {
        clearInterval(interval);
      }
      activeCleanupIntervals.clear();

      // Optional: Clear session data
      if (process.env.CLEAR_SESSIONS_ON_SHUTDOWN === 'true') {
        sessions.clear();
        agentTimeoutConfigs.clear();
      }
    };

    process.once('SIGTERM', globalCleanup);
    process.once('SIGINT', globalCleanup);

    // Also handle uncaught exceptions and unhandled rejections
    process.once('beforeExit', globalCleanup);
  }

  // Add error handling middleware
  router.use(createErrorHandler());

  // Return router with cleanup method attached
  // This allows proper cleanup when router is destroyed/recreated
  const routerWithCleanup = router as SessionRouter;
  routerWithCleanup.cleanup = cleanup;

  return routerWithCleanup;
}
```