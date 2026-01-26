# 5e8c73c1:packages_core_src_logger.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/logger.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    return JSON.stringify(obj, (_, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    });
  } catch {
    return String(obj);
  }
}

/**
 * Parse boolean from text string
 */
function parseBooleanFromText(value: string | undefined | null): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
}

/**
 * Format a value for display in pretty log extras
 */
function formatExtraValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Error) return value.message;
  return safeStringify(value);
}

/**
 * Format a log entry in compact pretty format
 * Format: [src] message (key=val, key=val)
 *
 * Note: agentId/agentName are NOT displayed in pretty mode because:
 * - Loggers with namespace already show #agentName prefix (via Adze)
 * - These fields ARE still included in JSON mode for filtering/monitoring
 */
function formatPrettyLog(
  context: Record<string, unknown>,
  message: string,
  isJsonMode: boolean
): string {
  // In JSON mode, don't format - return message as-is
  if (isJsonMode) {
    return message;
  }

  const src = context.src as string | undefined;

  // Build prefix: [SRC] in uppercase
  const srcPart = src ? `[${src.toUpperCase()}] ` : '';

  // Build extras: (key=val, key=val)
  // Exclude: src (already in prefix), agentId/agentName (shown via Adze namespace #agent)
  const excludeKeys = ['src', 'agentId', 'agentName'];
  const extraPairs: string[] = [];

  for (const [key, value] of Object.entries(context)) {
    if (excludeKeys.includes(key)) continue;
    if (value === undefined) continue;
    extraPairs.push(`${key}=${formatExtraValue(value)}`);
  }

  const extrasPart = extraPairs.length > 0 ? ` (${extraPairs.join(', ')})` : '';

  return `${srcPart}${message}${extrasPart}`;
}

// ============================================================================
// Configuration
// ============================================================================

// Log level configuration
const DEFAULT_LOG_LEVEL = 'info';
const effectiveLogLevel = getEnvironmentVar('LOG_LEVEL') || DEFAULT_LOG_LEVEL;

// Custom log levels mapping (ElizaOS to Adze)
// Note: These are for our internal shouldLog function, not Adze's levels
export const customLevels: Record<string, number> = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  log: 29,
  progress: 28,
  success: 27,
  debug: 20,
  trace: 10,
};

// Configuration flags
const raw = parseBooleanFromText(getEnvironmentVar('LOG_JSON_FORMAT'));
const showTimestamps = parseBooleanFromText(getEnvironmentVar('LOG_TIMESTAMPS') ?? 'true');

// Generate a unique server ID for this process instance
const serverId =
  getEnvironmentVar('SERVER_ID') ||
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10));

// Configure sensitive data redaction
// Paths use wildcards to match nested objects: *.password matches { user: { password: 'x' } }
const redact = fastRedact({
  paths: [
    'password',
    'passwd',
    'secret',
    'token',
    'apiKey',
    'api_key',
    'apiSecret',
    'api_secret',
    'authorization',
    'auth',
    'credential',
    'credentials',
    'privateKey',
    'private_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'cookie',
    'session',
    'jwt',
    'bearer',
    // Wildcard paths for nested objects
    '*.password',
    '*.secret',
    '*.token',
    '*.apiKey',
    '*.api_key',
    '*.authorization',
    '*.credential',
    '*.credentials',
    '*.privateKey',
    '*.accessToken',
    '*.refreshToken',
  ],
  serialize: false, // Don't stringify, just redact in place
  censor: '[REDACTED]',
});

// ============================================================================
// In-Memory Log Storage
```