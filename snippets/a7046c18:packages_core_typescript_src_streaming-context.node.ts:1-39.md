# a7046c18:packages_core_typescript_src_streaming-context.node.ts:1-39

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/streaming-context.node.ts:1-39
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Node.js-specific streaming context manager using AsyncLocalStorage.
 *
 * AsyncLocalStorage provides proper async context isolation, ensuring that
 * parallel message processing doesn't interfere with each other's streaming context.
 *
 * @see https://nodejs.org/api/async_context.html
 */
import { AsyncLocalStorage } from "node:async_hooks";
import type {
  IStreamingContextManager,
  StreamingContext,
} from "./streaming-context";

/**
 * AsyncLocalStorage-based context manager for Node.js.
 * Provides proper async context isolation across parallel async operations.
 */
export class AsyncLocalStorageContextManager
  implements IStreamingContextManager
{
  private storage = new AsyncLocalStorage<StreamingContext | undefined>();

  run<T>(context: StreamingContext | undefined, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  active(): StreamingContext | undefined {
    return this.storage.getStore();
  }
}

/**
 * Create and return a configured AsyncLocalStorage context manager.
 * Called by index.node.ts during initialization.
 */
export function createNodeStreamingContextManager(): IStreamingContextManager {
  return new AsyncLocalStorageContextManager();
}
```