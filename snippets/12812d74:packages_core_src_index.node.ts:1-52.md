# 12812d74:packages_core_src_index.node.ts:1-52

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/index.node.ts:1-52
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

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