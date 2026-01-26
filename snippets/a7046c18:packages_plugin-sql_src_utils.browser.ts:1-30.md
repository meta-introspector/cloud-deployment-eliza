# a7046c18:packages_plugin-sql_src_utils.browser.ts:1-30

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/utils.browser.ts:1-30
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Browser-safe utils for plugin-sql
 *
 * These versions avoid Node-specific modules (fs/path/dotenv) and simply
 * provide minimal fallbacks appropriate for browser builds.
 */

/**
 * Expand a tilde-prefixed path.
 * In the browser, paths are not used for storage; just return input.
 */
export function expandTildePath(filepath: string): string {
  return filepath;
}

/**
 * Resolve an env file path.
 * No-op in browser; returns a placeholder string.
 */
export function resolveEnvFile(_startDir?: string): string {
  return ".env";
}

/**
 * Resolve PGlite data directory.
 * In browser builds we default to in-memory PGlite; return a stable placeholder.
 */
export function resolvePgliteDir(_dir?: string, _fallbackDir?: string): string {
  return "in-memory";
}
```