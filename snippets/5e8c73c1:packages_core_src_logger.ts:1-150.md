# 5e8c73c1:packages_core_src_logger.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/logger.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
// Expose a tiny test hook to clear env cache in logger tests (kept internal)
// Note: we re-export a function that clears the environment cache indirectly via getEnv
export const __loggerTestHooks = {
  __noop: () => {},
};
import { getEnv as getEnvironmentVar } from './utils/environment';
import adze, { setup } from 'adze';
import fastRedact from 'fast-redact';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Log function signature matching Pino's API for compatibility
 */
type LogFn = (
  obj: Record<string, unknown> | string | Error,
  msg?: string,
  ...args: unknown[]
) => void;

/**
 * Logger interface - ElizaOS standard logger API
 */
export interface Logger {
  level: string;
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
  success: LogFn;
  progress: LogFn;
  log: LogFn;
  clear: () => void;
  child: (bindings: Record<string, unknown>) => Logger;
}

/**
 * Configuration for logger creation
 */
export interface LoggerBindings extends Record<string, unknown> {
  level?: string;
  namespace?: string;
  namespaces?: string[];
  maxMemoryLogs?: number;
  __forceType?: 'browser' | 'node'; // For testing - forces specific environment behavior
}

/**
 * Log entry structure for in-memory storage and streaming
 */
export interface LogEntry {
  time: number;
  level?: number;
  msg: string;
  agentName?: string;
  agentId?: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Log listener callback type for real-time log streaming
 */
export type LogListener = (entry: LogEntry) => void;

// Global log listeners for streaming
const logListeners: Set<LogListener> = new Set();

/**
 * Add a listener for real-time log entries (used for WebSocket streaming)
 * @param listener - Callback function to receive log entries
 * @returns Function to remove the listener
 */
export function addLogListener(listener: LogListener): () => void {
  logListeners.add(listener);
  return () => logListeners.delete(listener);
}

/**
 * Remove a log listener
 * @param listener - The listener to remove
 */
export function removeLogListener(listener: LogListener): void {
  logListeners.delete(listener);
}

/**
 * In-memory destination for recent logs
 */
interface InMemoryDestination {
  write: (entry: LogEntry) => void;
  clear: () => void;
  recentLogs: () => string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Log level priorities for filtering
 */
const LOG_LEVEL_PRIORITY: Record<string, number> = {
  trace: 10,
  verbose: 10,
  debug: 20,
  success: 27,
  progress: 28,
  log: 29,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  alert: 60,
};

/**
 * Reverse mapping from numeric level to preferred level name
 * When multiple level names have the same numeric value, we prioritize the most semantic one
 */
const LEVEL_TO_NAME: Record<number, string> = {
  10: 'trace', // prefer 'trace' over 'verbose'
  20: 'debug',
  27: 'success',
  28: 'progress',
  29: 'log',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal', // prefer 'fatal' over 'alert'
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
```