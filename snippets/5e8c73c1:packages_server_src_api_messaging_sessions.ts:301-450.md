# 5e8c73c1:packages_server_src_api_messaging_sessions.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/sessions.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      // Check for NaN or invalid number
      if (isNaN(timeoutValue) || !isFinite(timeoutValue)) {
        logger.warn(
          { src: 'http', timeoutMinutes: sessionConfig.timeoutMinutes },
          'Invalid timeout minutes, using default'
        );
        merged.timeoutMinutes = DEFAULT_TIMEOUT_MINUTES;
      } else {
        // Clamp to valid range
        const timeout = Math.max(MIN_TIMEOUT_MINUTES, Math.min(MAX_TIMEOUT_MINUTES, timeoutValue));
        merged.timeoutMinutes = timeout;
      }
    }

    if (sessionConfig.autoRenew !== undefined) {
      merged.autoRenew = sessionConfig.autoRenew;
    }

    if (sessionConfig.maxDurationMinutes !== undefined) {
      const maxDurationValue = Number(sessionConfig.maxDurationMinutes);

      // Check for NaN or invalid number
      if (isNaN(maxDurationValue) || !isFinite(maxDurationValue)) {
        logger.warn(
          { src: 'http', maxDurationMinutes: sessionConfig.maxDurationMinutes },
          'Invalid max duration minutes, using default'
        );
        merged.maxDurationMinutes = DEFAULT_MAX_DURATION_MINUTES;
      } else {
        // Ensure max duration is at least as long as timeout
        merged.maxDurationMinutes = Math.max(
          merged.timeoutMinutes!,
          Math.min(MAX_TIMEOUT_MINUTES * 2, maxDurationValue)
        );
      }
    }

    if (sessionConfig.warningThresholdMinutes !== undefined) {
      const warningValue = Number(sessionConfig.warningThresholdMinutes);

      // Check for NaN or invalid number
      if (isNaN(warningValue) || !isFinite(warningValue)) {
        logger.warn(
          { src: 'http', warningThresholdMinutes: sessionConfig.warningThresholdMinutes },
          'Invalid warning threshold, using default'
        );
        merged.warningThresholdMinutes = DEFAULT_WARNING_THRESHOLD_MINUTES;
      } else {
        // Ensure warning threshold is at least 1 minute
        merged.warningThresholdMinutes = Math.max(1, warningValue);
      }
    }
  }

  return merged;
}

/**
 * Calculates the expiration date for a session
 */
function calculateExpirationDate(
  createdAt: Date,
  lastActivity: Date,
  config: SessionTimeoutConfig,
  _renewalCount: number // Prefix with underscore to indicate intentionally unused
): Date {
  const baseTime = config.autoRenew ? lastActivity : createdAt;
  const timeoutMs = (config.timeoutMinutes || DEFAULT_TIMEOUT_MINUTES) * 60 * 1000;

  // Check if we've exceeded max duration
  if (config.maxDurationMinutes) {
    const maxDurationMs = config.maxDurationMinutes * 60 * 1000;
    const timeSinceCreation = Date.now() - createdAt.getTime();

    if (timeSinceCreation + timeoutMs > maxDurationMs) {
      // Session has reached max duration, set expiration to max duration from creation
      return new Date(createdAt.getTime() + maxDurationMs);
    }
  }

  return new Date(baseTime.getTime() + timeoutMs);
}

/**
 * Checks if a session should trigger a warning
 */
function shouldWarnAboutExpiration(session: Session): boolean {
  if (session.warningState?.sent) {
    return false; // Already warned
  }

  const warningThresholdMs =
    (session.timeoutConfig.warningThresholdMinutes || DEFAULT_WARNING_THRESHOLD_MINUTES) *
    60 *
    1000;
  const timeRemaining = session.expiresAt.getTime() - Date.now();

  return timeRemaining <= warningThresholdMs && timeRemaining > 0;
}

/**
 * Renews a session if auto-renew is enabled
 */
function renewSession(session: Session): boolean {
  if (!session.timeoutConfig.autoRenew) {
    return false;
  }

  const now = new Date();
  const maxDurationMs =
    (session.timeoutConfig.maxDurationMinutes || DEFAULT_MAX_DURATION_MINUTES) * 60 * 1000;
  const timeSinceCreation = now.getTime() - session.createdAt.getTime();

  if (timeSinceCreation >= maxDurationMs) {
    return false; // Cannot renew, max duration reached
  }

  session.lastActivity = now;
  session.renewalCount++;
  session.expiresAt = calculateExpirationDate(
    session.createdAt,
    session.lastActivity,
    session.timeoutConfig,
    session.renewalCount
  );

  // Reset warning state on renewal
  session.warningState = undefined;

  logger.debug(
    { src: 'http', sessionId: session.id, renewalCount: session.renewalCount },
    'Session renewed'
  );
  return true;
}

/**
 * Creates session info response with calculated fields
 */
function createSessionInfoResponse(session: Session): SessionInfoResponse {
  const now = Date.now();
  const timeRemaining = Math.max(0, session.expiresAt.getTime() - now);
  const warningThresholdMs =
    (session.timeoutConfig.warningThresholdMinutes || DEFAULT_WARNING_THRESHOLD_MINUTES) *
    60 *
    1000;

  return {
    sessionId: session.id,
    channelId: session.channelId,
```