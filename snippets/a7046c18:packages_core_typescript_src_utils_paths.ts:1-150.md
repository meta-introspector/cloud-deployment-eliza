# a7046c18:packages_core_typescript_src_utils_paths.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/paths.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * elizaOS data directory paths configuration
 * This module provides a unified interface for accessing data directory paths
 * that can be customized via environment variables.
 */

// Browser-safe path utilities
const pathJoin = (...parts: string[]) => {
  if (typeof process !== "undefined" && process.platform) {
    // Node.js environment - use native path module
    const path = require("node:path");
    return path.join(...parts);
  }
  // Browser or fallback implementation
  return parts
    .filter((part) => part)
    .join("/")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
};

/**
 * Interface for elizaOS paths configuration
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
 * elizaOS paths management class
 * Provides centralized access to all elizaOS data directory paths
 */
class ElizaPaths {
  private cache: Map<string, string> = new Map();

  /**
   * Get the base data directory
   */
  getDataDir(): string {
    const cached = this.cache.get("dataDir");
    if (cached) return cached;

    const dir =
      (typeof process !== "undefined" && process.env?.ELIZA_DATA_DIR) ||
      (typeof process !== "undefined" && process.cwd
        ? pathJoin(process.cwd(), ".eliza")
        : ".eliza");
    this.cache.set("dataDir", dir);
    return dir;
  }

  /**
   * Get the database directory (backward compatible with PGLITE_DATA_DIR)
   */
  getDatabaseDir(): string {
    const cached = this.cache.get("databaseDir");
    if (cached) return cached;

    const dir =
      (typeof process !== "undefined" && process.env?.ELIZA_DATABASE_DIR) ||
      (typeof process !== "undefined" && process.env?.PGLITE_DATA_DIR) ||
      pathJoin(this.getDataDir(), ".elizadb");
    this.cache.set("databaseDir", dir);
    return dir;
  }

  /**
   * Get the characters storage directory
   */
  getCharactersDir(): string {
    const cached = this.cache.get("charactersDir");
    if (cached) return cached;

    const dir =
      (typeof process !== "undefined" &&
        process.env?.ELIZA_DATA_DIR_CHARACTERS) ||
      pathJoin(this.getDataDir(), "data", "characters");
    this.cache.set("charactersDir", dir);
    return dir;
  }

  /**
   * Get the AI-generated content directory
   */
  getGeneratedDir(): string {
    const cached = this.cache.get("generatedDir");
    if (cached) return cached;

    const dir =
      (typeof process !== "undefined" &&
        process.env?.ELIZA_DATA_DIR_GENERATED) ||
      pathJoin(this.getDataDir(), "data", "generated");
    this.cache.set("generatedDir", dir);
    return dir;
  }

  /**
   * Get the agent uploads directory
   */
  getUploadsAgentsDir(): string {
    const cached = this.cache.get("uploadsAgentsDir");
    if (cached) return cached;

    const dir =
      (typeof process !== "undefined" &&
        process.env?.ELIZA_DATA_DIR_UPLOADS_AGENTS) ||
      pathJoin(this.getDataDir(), "data", "uploads", "agents");
    this.cache.set("uploadsAgentsDir", dir);
    return dir;
  }

  /**
   * Get the channel uploads directory
   */
  getUploadsChannelsDir(): string {
    const cached = this.cache.get("uploadsChannelsDir");
    if (cached) return cached;

    const dir =
      (typeof process !== "undefined" &&
        process.env?.ELIZA_DATA_DIR_UPLOADS_CHANNELS) ||
      pathJoin(this.getDataDir(), "data", "uploads", "channels");
    this.cache.set("uploadsChannelsDir", dir);
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
```