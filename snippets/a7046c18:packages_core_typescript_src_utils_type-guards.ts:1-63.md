# a7046c18:packages_core_typescript_src_utils_type-guards.ts:1-63

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/type-guards.ts:1-63
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Type guard utilities for runtime type checking
 * These functions help TypeScript narrow types safely
 */

import { isBuffer } from "./buffer";

/**
 * Check if a value is a plain object (not a special object type)
 * Type guard that narrows the type to Record<string, unknown>
 *
 * Excludes: null, arrays, buffers, Date, RegExp, Map, Set, WeakMap, WeakSet, Error, Promise
 *
 * @param value - The value to check
 * @returns True if the value is a plain object
 *
 * @example
 * ```typescript
 * const data: unknown = { name: 'test' };
 * if (isPlainObject(data)) {
 *   // TypeScript knows data is Record<string, unknown>
 *   console.log(data.name);
 * }
 * ```
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (isBuffer(value)) {
    return false;
  }
  if (value instanceof Date) {
    return false;
  }
  if (value instanceof RegExp) {
    return false;
  }
  if (value instanceof Map) {
    return false;
  }
  if (value instanceof Set) {
    return false;
  }
  if (value instanceof WeakMap) {
    return false;
  }
  if (value instanceof WeakSet) {
    return false;
  }
  if (value instanceof Error) {
    return false;
  }
  if (value instanceof Promise) {
    return false;
  }
  return true;
}
```