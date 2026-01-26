# a7046c18:packages_core_typescript_src_logger.ts:901-965

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/logger.ts:901-965
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    invoke("debug", ...adaptArgs(obj, msg, ...args));
  const info: LogFn = (obj, msg, ...args) =>
    invoke("info", ...adaptArgs(obj, msg, ...args));
  const warn: LogFn = (obj, msg, ...args) =>
    invoke("warn", ...adaptArgs(obj, msg, ...args));
  const error: LogFn = (obj, msg, ...args) =>
    invoke("error", ...adaptArgs(obj, msg, ...args));
  const fatal: LogFn = (obj, msg, ...args) =>
    invoke("fatal", ...adaptArgs(obj, msg, ...args));
  const success: LogFn = (obj, msg, ...args) =>
    invoke("success", ...adaptArgs(obj, msg, ...args));
  const progress: LogFn = (obj, msg, ...args) =>
    invoke("progress", ...adaptArgs(obj, msg, ...args));
  const logFn: LogFn = (obj, msg, ...args) =>
    invoke("log", ...adaptArgs(obj, msg, ...args));

  /**
   * Clear console and memory buffer
   */
  const clear = (): void => {
    if (typeof console?.clear === "function") {
      console.clear();
    }
    globalInMemoryDestination.clear();
  };

  /**
   * Create child logger with additional bindings
   */
  const child = (childBindings: Record<string, unknown>): Logger => {
    return createLogger({ level: currentLevel, ...base, ...childBindings });
  };

  return {
    level: currentLevel,
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
    success,
    progress,
    log: logFn,
    clear,
    child,
  };
}

// ============================================================================
// Exports
// ============================================================================

// Create default logger instance
const logger = createLogger();

// Backward compatibility alias
export const elizaLogger = logger;

// Export recent logs function
export const recentLogs = (): string => globalInMemoryDestination.recentLogs();

// Export everything
export { logger, createLogger };
export default logger;
```