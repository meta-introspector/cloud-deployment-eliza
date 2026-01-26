# a69475c0:packages_core_src_index.node.ts:1-54

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/index.node.ts:1-54
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
/**
 * Node.js-specific entry point for @elizaos/core
 *
 * This file exports all modules including Node.js-specific functionality.
 * This is the full API surface of the core package.
 */

// Configure Node.js-specific streaming context manager (AsyncLocalStorage)
import { setStreamingContextManager } from './streaming-context';
import { createNodeStreamingContextManager } from './streaming-context.node';
setStreamingContextManager(createNodeStreamingContextManager());

// Export everything from types
export * from './types';

// Export utils first to avoid circular dependency issues
export * from './utils';

// Export schemas
export * from './schemas/character';

// Export browser-compatible utilities
export * from './utils/environment';
export * from './utils/buffer';
// Export streaming utilities
export * from './utils/streaming';
// Export Node-specific utilities
export * from './utils/node';

// Export all core modules
export * from './actions';
export * from './database';
export * from './entities';
export * from './logger';
export * from './memory';
export * from './prompts';
export * from './roles';
export * from './runtime';
export * from './settings';
export * from './services';
export * from './services/message-service';
export * from './services/default-message-service';
export * from './search';
export * from './elizaos';
export * from './streaming-context';

// Export configuration and plugin modules - will be removed once cli cleanup
export * from './character';
export * from './secrets';
export * from './plugin';

// Node-specific exports
export const isBrowser = false;
export const isNode = true;
```