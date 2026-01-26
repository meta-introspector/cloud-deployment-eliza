# 67c3e03b:packages_server_src_api_messaging_sessions.ts:151-300

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:151-300
**Novelty Score:** 14.99
**Concepts:** testing

```
    session.lastActivity instanceof Date &&
    session.expiresAt instanceof Date &&
    typeof session.renewalCount === 'number' &&
    session.timeoutConfig !== undefined &&
    typeof session.timeoutConfig === 'object'
  );
}

/**
 * Type guard for CreateSessionRequest
 */
function isCreateSessionRequest(obj: unknown): obj is CreateSessionRequest {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const req = obj as Record<string, unknown>;
  return typeof req.agentId === 'string' && typeof req.userId === 'string';
}

/**
 * Type guard for SendMessageRequest
 */
function isSendMessageRequest(obj: unknown): obj is SendMessageRequest {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const req = obj as Record<string, unknown>;
  return typeof req.content === 'string';
}

/**
 * Type guard for timeout configuration
 * Accepts numbers or strings (which will be parsed later)
 */
function isValidTimeoutConfig(obj: unknown): obj is SessionTimeoutConfig {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const config = obj as Record<string, unknown>;
  return (
    (config.timeoutMinutes === undefined ||
      typeof config.timeoutMinutes === 'number' ||
      typeof config.timeoutMinutes === 'string') &&
    (config.autoRenew === undefined || typeof config.autoRenew === 'boolean') &&
    (config.maxDurationMinutes === undefined ||
      typeof config.maxDurationMinutes === 'number' ||
      typeof config.maxDurationMinutes === 'string') &&
    (config.warningThresholdMinutes === undefined ||
      typeof config.warningThresholdMinutes === 'number' ||
      typeof config.warningThresholdMinutes === 'string')
  );
}

/**
 * Type for parsed raw message
 */
interface ParsedRawMessage {
  thought?: string;
  actions?: string[];
  content?: string;
  attachments?: unknown[];
  [key: string]: unknown;
}

// Input validation constants
const MAX_CONTENT_LENGTH = 4000;
const MAX_METADATA_SIZE = 1024 * 10; // 10KB
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 50;

/**
 * Gets the timeout configuration for an agent
 * This could be extended to fetch from agent settings/database
 */
function getAgentTimeoutConfig(agent: IAgentRuntime): SessionTimeoutConfig {
  // Check if we have a cached config for this agent
  if (agentTimeoutConfigs.has(agent.agentId)) {
    return agentTimeoutConfigs.get(agent.agentId)!;
  }

  // Try to get from agent settings with safe parsing
  const timeoutSetting = agent.getSetting('SESSION_TIMEOUT_MINUTES');
  const maxDurationSetting = agent.getSetting('SESSION_MAX_DURATION_MINUTES');
  const warningThresholdSetting = agent.getSetting('SESSION_WARNING_THRESHOLD_MINUTES');

  const agentConfig: SessionTimeoutConfig = {
    timeoutMinutes: timeoutSetting
      ? safeParseInt(
          String(timeoutSetting),
          DEFAULT_TIMEOUT_MINUTES,
          MIN_TIMEOUT_MINUTES,
          MAX_TIMEOUT_MINUTES
        )
      : DEFAULT_TIMEOUT_MINUTES,
    autoRenew: agent.getSetting('SESSION_AUTO_RENEW')
      ? agent.getSetting('SESSION_AUTO_RENEW') === 'true'
      : true,
    maxDurationMinutes: maxDurationSetting
      ? safeParseInt(
          String(maxDurationSetting),
          DEFAULT_MAX_DURATION_MINUTES,
          MIN_TIMEOUT_MINUTES,
          MAX_TIMEOUT_MINUTES * 2
        )
      : DEFAULT_MAX_DURATION_MINUTES,
    warningThresholdMinutes: warningThresholdSetting
      ? safeParseInt(
          String(warningThresholdSetting),
          DEFAULT_WARNING_THRESHOLD_MINUTES,
          1,
          MAX_TIMEOUT_MINUTES
        )
      : DEFAULT_WARNING_THRESHOLD_MINUTES,
  };

  // Cache it for future use
  agentTimeoutConfigs.set(agent.agentId, agentConfig);
  return agentConfig;
}

/**
 * Merges timeout configurations with proper precedence:
 * 1. Session-specific config (highest priority)
 * 2. Agent-specific config
 * 3. Global defaults (lowest priority)
 */
function mergeTimeoutConfigs(
  sessionConfig?: SessionTimeoutConfig,
  agentConfig?: SessionTimeoutConfig
): SessionTimeoutConfig {
  const merged: SessionTimeoutConfig = {
    timeoutMinutes: DEFAULT_TIMEOUT_MINUTES,
    autoRenew: true,
    maxDurationMinutes: DEFAULT_MAX_DURATION_MINUTES,
    warningThresholdMinutes: DEFAULT_WARNING_THRESHOLD_MINUTES,
  };

  // Apply agent config
  if (agentConfig) {
    Object.assign(merged, agentConfig);
  }

  // Apply session config (overrides agent config)
  if (sessionConfig) {
    // Validate and apply timeout minutes with NaN protection
    if (sessionConfig.timeoutMinutes !== undefined) {
      const timeoutValue = Number(sessionConfig.timeoutMinutes);
```