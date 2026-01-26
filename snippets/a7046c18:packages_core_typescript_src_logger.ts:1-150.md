# a7046c18:packages_core_typescript_src_logger.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/logger.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
// Expose a tiny test hook to clear env cache in logger tests (kept internal)
// Note: we re-export a function that clears the environment cache indirectly via getEnv
export const __loggerTestHooks = {
  __noop: () => {},
};

import adze, {
  type ConsoleStyle,
  type LevelConfiguration,
  type Method,
  setup,
  type UserConfiguration,
} from "adze";
import type Log from "adze/dist/log.js";
import { getEnv as getEnvironmentVar } from "./utils/environment";

/**
 * Interface for Adze sealed logger with known methods
 */
interface AdzeLogMethods {
  alert(...args: unknown[]): void;
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  fail(...args: unknown[]): void;
  success(...args: unknown[]): void;
  log(...args: unknown[]): void;
  debug(...args: unknown[]): void;
  verbose(...args: unknown[]): void;
}

import fastRedact from "fast-redact";

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
 * Logger interface - elizaOS standard logger API
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
  __forceType?: "browser" | "node"; // For testing - forces specific environment behavior
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
  10: "trace", // prefer 'trace' over 'verbose'
  20: "debug",
```