# 5e8c73c1:packages_core_src_utils_paths.ts:151-222

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/paths.ts:151-222
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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