# a7046c18:packages_core_typescript_src_logger.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/logger.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    ) {
      maxMemoryLogs = bindings.maxMemoryLogs;
    }

    // Extract base bindings (excluding special properties)
    const { level: _, maxMemoryLogs: __, ...rest } = bindings;
    base = rest;
  }

  return { level, base, maxMemoryLogs };
}

/**
 * Creates a logger instance using Adze
 * @param bindings - Logger configuration or boolean flag
 * @returns Logger instance with elizaOS API
 */
function createLogger(bindings: LoggerBindings | boolean = false): Logger {
  const { level, base, maxMemoryLogs } = extractBindingsConfig(bindings);

  // Reset memory buffer if custom limit requested
  if (typeof maxMemoryLogs === "number" && maxMemoryLogs > 0) {
    globalInMemoryDestination.clear();
  }

  // Check if we should force browser behavior (for testing)
  const forceBrowser =
    typeof bindings === "object" &&
    bindings &&
    "__forceType" in bindings &&
    bindings.__forceType === "browser";

  // If forcing browser mode, create a simple console-based logger
  if (forceBrowser) {
    const levelStr =
      typeof level === "number" ? "info" : level || effectiveLogLevel;
    const currentLevel = levelStr.toLowerCase();

    const formatArgs = (...args: unknown[]): string => {
      return args
        .map((arg) => {
          if (typeof arg === "string") return arg;
          if (arg instanceof Error) return arg.message;
          return safeStringify(arg);
        })
        .join(" ");
    };

    const logToConsole = (method: string, ...args: unknown[]): void => {
      if (!shouldLog(method, currentLevel)) {
        return;
      }

      const message = formatArgs(...args);
      const consoleMethod: keyof Console =
        method === "fatal"
          ? "error"
          : method === "trace" || method === "verbose"
            ? "debug"
            : method === "success" || method === "progress"
              ? "info"
              : method === "log"
                ? "log"
                : method in console &&
                    typeof console[method as keyof Console] === "function"
                  ? (method as keyof Console)
                  : "log";

      const consoleFn = console[consoleMethod];
      if (consoleFn && typeof consoleFn === "function") {
        // TypeScript doesn't know that consoleMethod excludes non-function properties
        // but we've already checked typeof consoleFn === 'function', so it's safe
        (consoleFn as (...args: unknown[]) => void)(message);
      }
    };

    /**
     * Safely redact sensitive data from an object (browser version)
     */
    const safeRedact = (
      obj: Record<string, unknown>,
    ): Record<string, unknown> => {
      try {
        const copy = { ...obj };
        redact(copy);
        return copy;
      } catch {
        return obj;
      }
    };

    const adaptArgs = (
      obj: Record<string, unknown> | string | Error,
      msg?: string,
      ...args: unknown[]
    ): unknown[] => {
      if (typeof obj === "string") {
        return msg !== undefined ? [obj, msg, ...args] : [obj, ...args];
      }
      if (obj instanceof Error) {
        return msg !== undefined
          ? [obj.message, msg, ...args]
          : [obj.message, ...args];
      }
      // Redact sensitive data from objects
      const redactedObj = safeRedact(obj);
      if (msg !== undefined) {
        // Browser is always pretty mode - format as compact single line
        const formatted = formatPrettyLog(redactedObj, msg, false);
        return [formatted, ...args];
      }
      // No message - format context only
      const formatted = formatPrettyLog(redactedObj, "", false);
      return formatted ? [formatted, ...args] : [...args];
    };

    return {
      level: currentLevel,
      trace: (obj, msg, ...args) =>
        logToConsole("trace", ...adaptArgs(obj, msg, ...args)),
      debug: (obj, msg, ...args) =>
        logToConsole("debug", ...adaptArgs(obj, msg, ...args)),
      info: (obj, msg, ...args) =>
        logToConsole("info", ...adaptArgs(obj, msg, ...args)),
      warn: (obj, msg, ...args) =>
        logToConsole("warn", ...adaptArgs(obj, msg, ...args)),
      error: (obj, msg, ...args) =>
        logToConsole("error", ...adaptArgs(obj, msg, ...args)),
      fatal: (obj, msg, ...args) =>
        logToConsole("fatal", ...adaptArgs(obj, msg, ...args)),
      success: (obj, msg, ...args) =>
        logToConsole("success", ...adaptArgs(obj, msg, ...args)),
      progress: (obj, msg, ...args) =>
        logToConsole("progress", ...adaptArgs(obj, msg, ...args)),
      log: (obj, msg, ...args) =>
        logToConsole("log", ...adaptArgs(obj, msg, ...args)),
      clear: () => {
        if (typeof console.clear === "function") console.clear();
      },
      child: (childBindings: Record<string, unknown>) =>
        createLogger({
          level: currentLevel,
          ...base,
          ...childBindings,
          __forceType: "browser",
        }),
    };
  }

  // Create sealed Adze instance with configuration
```