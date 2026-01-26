# a7046c18:packages_core_typescript_src_streaming-context.browser.ts:1-46

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/streaming-context.browser.ts:1-46
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

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
import type {
  IStreamingContextManager,
  StreamingContext,
} from "./streaming-context";

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
    return this.stack.length > 0
      ? this.stack[this.stack.length - 1]
      : undefined;
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