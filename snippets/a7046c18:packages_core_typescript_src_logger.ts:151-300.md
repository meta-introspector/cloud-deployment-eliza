# a7046c18:packages_core_typescript_src_logger.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/logger.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  27: "success",
  28: "progress",
  29: "log",
  30: "info",
  40: "warn",
  50: "error",
  60: "fatal", // prefer 'fatal' over 'alert'
};

/**
 * Check if a message should be logged based on current level
 */
function shouldLog(messageLevel: string, currentLevel: string): boolean {
  const messagePriority = LOG_LEVEL_PRIORITY[messageLevel.toLowerCase()] || 30;
  const currentPriority = LOG_LEVEL_PRIORITY[currentLevel.toLowerCase()] || 30;
  return messagePriority >= currentPriority;
}

/**
 * Safe JSON stringify that handles circular references
 */
function safeStringify(obj: unknown): string {
  try {
    const seen = new WeakSet();
    return JSON.stringify(obj, (_, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
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
  return (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes" ||
    normalized === "on"
  );
}

/**
 * Format a value for display in pretty log extras
 */
function formatExtraValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
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
  isJsonMode: boolean,
): string {
  // In JSON mode, don't format - return message as-is
  if (isJsonMode) {
    return message;
  }

  const src = context.src as string | undefined;

  // Build prefix: [SRC] in uppercase
  const srcPart = src ? `[${src.toUpperCase()}] ` : "";

  // Build extras: (key=val, key=val)
  // Exclude: src (already in prefix), agentId/agentName (shown via Adze namespace #agent)
  const excludeKeys = ["src", "agentId", "agentName"];
  const extraPairs: string[] = [];

  for (const [key, value] of Object.entries(context)) {
    if (excludeKeys.includes(key)) continue;
    if (value === undefined) continue;
    extraPairs.push(`${key}=${formatExtraValue(value)}`);
  }

  const extrasPart = extraPairs.length > 0 ? ` (${extraPairs.join(", ")})` : "";

  return `${srcPart}${message}${extrasPart}`;
}

// ============================================================================
// Configuration
// ============================================================================

// Log level configuration
const DEFAULT_LOG_LEVEL = "info";
const effectiveLogLevel = getEnvironmentVar("LOG_LEVEL") || DEFAULT_LOG_LEVEL;

// Custom log levels mapping (elizaOS to Adze)
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
const raw = parseBooleanFromText(getEnvironmentVar("LOG_JSON_FORMAT"));
const showTimestamps = parseBooleanFromText(
  getEnvironmentVar("LOG_TIMESTAMPS") ?? "true",
);

// Generate a unique server ID for this process instance
const serverId =
  getEnvironmentVar("SERVER_ID") ||
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10));

// Configure sensitive data redaction
// Paths use wildcards to match nested objects: *.password matches { user: { password: 'x' } }
const redact = fastRedact({
  paths: [
    "password",
    "passwd",
    "secret",
    "token",
    "apiKey",
    "api_key",
    "apiSecret",
    "api_secret",
    "authorization",
```