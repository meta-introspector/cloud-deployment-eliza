# 12812d74:packages_core_src_streaming-context.browser.ts:1-41

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/streaming-context.browser.ts:1-41
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
/**
 * Browser-specific streaming context manager using a simple stack.
 *
 * In browser environments, each API call typically creates its own runtime instance,
 * so there's no risk of parallel context collision. A simple stack-based approach
 * is sufficient and performant.
 *
 * Inspired by OpenTelemetry's StackContextManager for browser environments.
 * @see https://opentelemetry.io/docs/languages/js/context/
 */
import type { StreamingContext, IStreamingContextManager } from './streaming-context';

/**
 * Stack-based context manager for browser environments.
 * Safe because browser typically has 1 runtime per request.
 * Supports nested contexts via stack push/pop.
 */
export class StackContextManager implements IStreamingContextManager {
  private stack: Array<StreamingContext | undefined> = [];

  run<T>(context: StreamingContext | undefined, fn: () => T): T {
    this.stack.push(context);
    try {
      return fn();
    } finally {
      this.stack.pop();
    }
  }

  active(): StreamingContext | undefined {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
  }
}

/**
 * Create and return a configured Stack context manager.
 * Called by index.browser.ts during initialization.
 */
export function createBrowserStreamingContextManager(): IStreamingContextManager {
  return new StackContextManager();
}
```