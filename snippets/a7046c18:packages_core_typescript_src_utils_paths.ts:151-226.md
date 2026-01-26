# a7046c18:packages_core_typescript_src_utils_paths.ts:151-226

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/paths.ts:151-226
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }
}

/**
 * Singleton instance of the ElizaPaths class
 */
let pathsInstance: ElizaPaths | null = null;

/**
 * Get the singleton ElizaPaths instance
 */
export function getElizaPaths(): ElizaPaths {
  if (!pathsInstance) {
    pathsInstance = new ElizaPaths();
  }
  return pathsInstance;
}

/**
 * Convenience function to get the data directory
 */
export function getDataDir(): string {
  return getElizaPaths().getDataDir();
}

/**
 * Convenience function to get the database directory
 */
export function getDatabaseDir(): string {
  return getElizaPaths().getDatabaseDir();
}

/**
 * Convenience function to get the characters directory
 */
export function getCharactersDir(): string {
  return getElizaPaths().getCharactersDir();
}

/**
 * Convenience function to get the generated content directory
 */
export function getGeneratedDir(): string {
  return getElizaPaths().getGeneratedDir();
}

/**
 * Convenience function to get the agent uploads directory
 */
export function getUploadsAgentsDir(): string {
  return getElizaPaths().getUploadsAgentsDir();
}

/**
 * Convenience function to get the channel uploads directory
 */
export function getUploadsChannelsDir(): string {
  return getElizaPaths().getUploadsChannelsDir();
}

/**
 * Convenience function to get all paths
 */
export function getAllElizaPaths(): ElizaPathsConfig {
  return getElizaPaths().getAllPaths();
}

/**
 * Reset the singleton instance (mainly for testing)
 */
export function resetPaths(): void {
  if (pathsInstance) {
    pathsInstance.clearCache();
  }
  pathsInstance = null;
}
```