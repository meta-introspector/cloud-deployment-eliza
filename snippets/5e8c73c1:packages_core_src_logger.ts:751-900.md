# 5e8c73c1:packages_core_src_logger.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/logger.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  const levelStr = typeof level === 'number' ? 'info' : level || effectiveLogLevel;
  const currentLevel = levelStr.toLowerCase();

  // No-op: previously captured to Sentry; removed for browser compatibility
  const captureIfError = (_method: string, _args: unknown[]): void => {};

  /**
   * Invoke Adze method with error capture
   */
  const invoke = (method: string, ...args: unknown[]): void => {
    // Check if this log level should be output
    if (!shouldLog(method, currentLevel)) {
      return;
    }

    // Ensure Sentry sees the semantic level name (e.g., 'fatal')
    captureIfError(method, args);

    // Capture to in-memory destination for API access (even for namespaced loggers)
    let msg = '';
    if (args.length > 0) {
      msg = args
        .map((arg) => {
          if (typeof arg === 'string') return arg;
          if (arg instanceof Error) return arg.message;
          return safeStringify(arg);
        })
        .join(' ');
    }

    // Include namespace in the message if present
    if (base.namespace) {
      msg = `#${base.namespace}  ${msg}`;
    }

    const entry: LogEntry = {
      time: Date.now(),
      level: LOG_LEVEL_PRIORITY[method.toLowerCase()] || LOG_LEVEL_PRIORITY.info,
      msg,
    };

    globalInMemoryDestination.write(entry);

    // Map Eliza methods to correct Adze invocations
    let adzeMethod = method;
    let adzeArgs = args;

    // Normalize special cases - map our custom levels to Adze levels
    if (method === 'fatal') {
      // Adze uses 'alert' for fatal-level logging
      adzeMethod = 'alert';
    } else if (method === 'progress') {
      // Map progress to info level with a prefix
      adzeMethod = 'info';
      adzeArgs = ['[PROGRESS]', ...args];
    } else if (method === 'success') {
      // Map success to info level with a prefix
      adzeMethod = 'info';
      adzeArgs = ['[SUCCESS]', ...args];
    } else if (method === 'trace') {
      // Map trace to verbose
      adzeMethod = 'verbose';
    }

    // Adze sealed logger has dynamic method names, use type assertion for method access
    try {
      const sealedRecord = sealed as unknown as Record<string, (...args: unknown[]) => void>;
      if (adzeMethod in sealedRecord && typeof sealedRecord[adzeMethod] === 'function') {
        sealedRecord[adzeMethod](...adzeArgs);
      }
    } catch {
      // Fallback to console if Adze fails
      console.log(`[${method.toUpperCase()}]`, ...args);
    }
  };

  /**
   * Safely redact sensitive data from an object
   * Creates a shallow copy to avoid mutating the original
   */
  const safeRedact = (obj: Record<string, unknown>): Record<string, unknown> => {
    try {
      // Create a shallow copy to avoid mutating original
      const copy = { ...obj };
      // fast-redact returns the redacted string when serialize:false
      // but mutates the object in place, so we use the copy
      redact(copy);
      return copy;
    } catch {
      // If redaction fails, return original (don't break logging)
      return obj;
    }
  };

  /**
   * Adapt ElizaOS logger API arguments to Adze format
   * Also applies redaction to sensitive data in objects
   *
   * In pretty mode: formats as compact single line [src] agent — message (extras)
   * In JSON mode: keeps structured object for machine parsing
   */
  const adaptArgs = (
    obj: Record<string, unknown> | string | Error,
    msg?: string,
    ...args: unknown[]
  ): unknown[] => {
    // String first argument - no context object
    if (typeof obj === 'string') {
      return msg !== undefined ? [obj, msg, ...args] : [obj, ...args];
    }
    // Error object
    if (obj instanceof Error) {
      return msg !== undefined
        ? [obj.message, { error: obj }, msg, ...args]
        : [obj.message, { error: obj }, ...args];
    }

    // Object (context) - redact sensitive data
    const redactedObj = safeRedact(obj);

    if (msg !== undefined) {
      // Pretty mode: format as compact single line
      if (!raw) {
        const formatted = formatPrettyLog(redactedObj, msg, raw);
        return [formatted, ...args];
      }
      // JSON mode: keep structured object for machine parsing
      return [msg, redactedObj, ...args];
    }

    // No message provided - just context object
    if (!raw) {
      // Pretty mode: format the object as a simple string
      const formatted = formatPrettyLog(redactedObj, '', raw);
      return formatted ? [formatted, ...args] : [...args];
    }
    return [redactedObj, ...args];
  };

  // Create log methods
  const trace: LogFn = (obj, msg, ...args) => invoke('verbose', ...adaptArgs(obj, msg, ...args));
  const debug: LogFn = (obj, msg, ...args) => invoke('debug', ...adaptArgs(obj, msg, ...args));
  const info: LogFn = (obj, msg, ...args) => invoke('info', ...adaptArgs(obj, msg, ...args));
  const warn: LogFn = (obj, msg, ...args) => invoke('warn', ...adaptArgs(obj, msg, ...args));
  const error: LogFn = (obj, msg, ...args) => invoke('error', ...adaptArgs(obj, msg, ...args));
  const fatal: LogFn = (obj, msg, ...args) => invoke('fatal', ...adaptArgs(obj, msg, ...args));
  const success: LogFn = (obj, msg, ...args) => invoke('success', ...adaptArgs(obj, msg, ...args));
  const progress: LogFn = (obj, msg, ...args) =>
    invoke('progress', ...adaptArgs(obj, msg, ...args));
  const logFn: LogFn = (obj, msg, ...args) => invoke('log', ...adaptArgs(obj, msg, ...args));
```