# a7046c18:packages_core_typescript_src_index.browser.ts:1-51

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/index.browser.ts:1-51
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Browser-specific entry point for @elizaos/core
 *
 * This file exports only browser-compatible modules and provides
 * stubs or alternatives for Node.js-specific functionality.
 */

// Configure Browser-specific streaming context manager (Stack-based)
import { setStreamingContextManager } from "./streaming-context";
import { createBrowserStreamingContextManager } from "./streaming-context.browser";

setStreamingContextManager(createBrowserStreamingContextManager());

// Export core modules (all browser-compatible after refactoring)
export * from "./actions";
export * from "./database";
export * from "./elizaos";
export * from "./entities";
export * from "./logger";
export * from "./memory";
export * from "./prompts";
export * from "./roles";
export * from "./runtime";
// Export schemas
export * from "./schemas/character";
export * from "./search";
export * from "./services";
export * from "./services/default-message-service";
export * from "./services/message-service";
export * from "./settings";
export * from "./streaming-context";
// Export everything from types (type-only, safe for browser)
export * from "./types";
// Export utils first to avoid circular dependency issues
export * from "./utils";
export * from "./utils/buffer";
// Export browser-compatible utilities
export * from "./utils/environment";

// Browser-specific exports or stubs for Node-only features
export const isBrowser = true;
export const isNode = false;

/**
 * Browser stub for server health checks
 * In browser environment, this is a no-op
 */
export const serverHealth = {
  check: async () => ({ status: "not-applicable", environment: "browser" }),
  isHealthy: () => true,
};
```