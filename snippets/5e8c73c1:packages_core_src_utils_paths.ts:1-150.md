# 5e8c73c1:packages_core_src_utils_paths.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/paths.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * ElizaOS data directory paths configuration
 * This module provides a unified interface for accessing data directory paths
 * that can be customized via environment variables.
 */

// Browser-safe path utilities
const pathJoin = (...parts: string[]) => {
  if (typeof process !== 'undefined' && process.platform) {
    // Node.js environment - use native path module
    const path = require('node:path');
    return path.join(...parts);
  }
  // Browser or fallback implementation
  return parts
    .filter((part) => part)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
};

/**
 * Interface for ElizaOS paths configuration
 */
export interface ElizaPathsConfig {
  dataDir: string;
  databaseDir: string;
  charactersDir: string;
  generatedDir: string;
  uploadsAgentsDir: string;
  uploadsChannelsDir: string;
}

/**
 * ElizaOS paths management class
 * Provides centralized access to all ElizaOS data directory paths
 */
class ElizaPaths {
  private cache: Map<string, string> = new Map();

  /**
   * Get the base data directory
   */
  getDataDir(): string {
    const cached = this.cache.get('dataDir');
    if (cached) return cached;

    const dir =
      (typeof process !== 'undefined' && process.env?.ELIZA_DATA_DIR) ||
      (typeof process !== 'undefined' && process.cwd
        ? pathJoin(process.cwd(), '.eliza')
        : '.eliza');
    this.cache.set('dataDir', dir);
    return dir;
  }

  /**
   * Get the database directory (backward compatible with PGLITE_DATA_DIR)
   */
  getDatabaseDir(): string {
    const cached = this.cache.get('databaseDir');
    if (cached) return cached;

    const dir =
      (typeof process !== 'undefined' && process.env?.ELIZA_DATABASE_DIR) ||
      (typeof process !== 'undefined' && process.env?.PGLITE_DATA_DIR) ||
      pathJoin(this.getDataDir(), '.elizadb');
    this.cache.set('databaseDir', dir);
    return dir;
  }

  /**
   * Get the characters storage directory
   */
  getCharactersDir(): string {
    const cached = this.cache.get('charactersDir');
    if (cached) return cached;

    const dir =
      (typeof process !== 'undefined' && process.env?.ELIZA_DATA_DIR_CHARACTERS) ||
      pathJoin(this.getDataDir(), 'data', 'characters');
    this.cache.set('charactersDir', dir);
    return dir;
  }

  /**
   * Get the AI-generated content directory
   */
  getGeneratedDir(): string {
    const cached = this.cache.get('generatedDir');
    if (cached) return cached;

    const dir =
      (typeof process !== 'undefined' && process.env?.ELIZA_DATA_DIR_GENERATED) ||
      pathJoin(this.getDataDir(), 'data', 'generated');
    this.cache.set('generatedDir', dir);
    return dir;
  }

  /**
   * Get the agent uploads directory
   */
  getUploadsAgentsDir(): string {
    const cached = this.cache.get('uploadsAgentsDir');
    if (cached) return cached;

    const dir =
      (typeof process !== 'undefined' && process.env?.ELIZA_DATA_DIR_UPLOADS_AGENTS) ||
      pathJoin(this.getDataDir(), 'data', 'uploads', 'agents');
    this.cache.set('uploadsAgentsDir', dir);
    return dir;
  }

  /**
   * Get the channel uploads directory
   */
  getUploadsChannelsDir(): string {
    const cached = this.cache.get('uploadsChannelsDir');
    if (cached) return cached;

    const dir =
      (typeof process !== 'undefined' && process.env?.ELIZA_DATA_DIR_UPLOADS_CHANNELS) ||
      pathJoin(this.getDataDir(), 'data', 'uploads', 'channels');
    this.cache.set('uploadsChannelsDir', dir);
    return dir;
  }

  /**
   * Get all paths as a configuration object
   */
  getAllPaths(): ElizaPathsConfig {
    return {
      dataDir: this.getDataDir(),
      databaseDir: this.getDatabaseDir(),
      charactersDir: this.getCharactersDir(),
      generatedDir: this.getGeneratedDir(),
      uploadsAgentsDir: this.getUploadsAgentsDir(),
      uploadsChannelsDir: this.getUploadsChannelsDir(),
    };
  }

  /**
   * Clear the cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
```