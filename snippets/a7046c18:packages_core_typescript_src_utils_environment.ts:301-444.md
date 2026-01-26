# a7046c18:packages_core_typescript_src_utils_environment.ts:301-444

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/environment.ts:301-444
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
export function hasEnv(key: string): boolean {
  return getEnvironment().has(key);
}

/**
 * Convenience function to get a boolean environment variable
 */
export function getBooleanEnv(key: string, defaultValue = false): boolean {
  return getEnvironment().getBoolean(key, defaultValue);
}

/**
 * Convenience function to get a number environment variable
 */
export function getNumberEnv(
  key: string,
  defaultValue?: number,
): number | undefined {
  return getEnvironment().getNumber(key, defaultValue);
}

/**
 * Initialize browser environment with config
 * This should be called early in browser apps to set up environment
 */
export function initBrowserEnvironment(config: EnvironmentConfig): void {
  const env = getEnvironment();
  if (env.isBrowser()) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined) {
        env.set(key, value);
      }
    });
  }
}

/**
 * Export the current runtime for convenience
 */
export const currentRuntime = detectEnvironment();

/**
 * Re-export the Environment class for advanced usage
 */
export { Environment };

// ============================================================================
// .env File Loading (Node.js only)
// ============================================================================

/**
 * Find the .env file by traversing up the directory tree
 * Searches from startDir upwards until it finds a .env file or reaches the root
 *
 * @param startDir - Directory to start searching from (defaults to process.cwd())
 * @param filenames - Array of filenames to search for (defaults to ['.env', '.env.local'])
 * @returns Path to the .env file if found, null otherwise
 */
export function findEnvFile(
  startDir?: string,
  filenames: string[] = [".env", ".env.local"],
): string | null {
  if (typeof process === "undefined" || !process.cwd) {
    return null;
  }

  // Dynamic import to avoid bundling issues in browser
  const fs = require("node:fs");
  const path = require("node:path");

  let currentDir = startDir || process.cwd();

  // Traverse up the directory tree
  while (true) {
    // Check each possible filename in the current directory
    for (const filename of filenames) {
      const candidate = path.join(currentDir, filename);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    // Move to parent directory
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached root, stop searching
      break;
    }
    currentDir = parentDir;
  }

  return null;
}

/**
 * Load environment variables from .env file into process.env
 * This function is idempotent - safe to call multiple times
 *
 * Node.js only - does nothing in browser environments
 *
 * @param envPath - Optional explicit path to .env file. If not provided, will search upwards from cwd
 * @returns true if .env was found and loaded, false otherwise
 *
 * @example
 * ```typescript
 * // Load from auto-discovered .env file
 * loadEnvFile();
 *
 * // Load from specific path
 * loadEnvFile('/path/to/.env');
 * ```
 */
export function loadEnvFile(envPath?: string): boolean {
  if (typeof process === "undefined" || !process.cwd) {
    return false;
  }

  // Dynamic import to avoid bundling dotenv in browser
  const dotenv = require("dotenv");

  // Find .env file if path not explicitly provided
  const resolvedPath = envPath || findEnvFile();
  if (!resolvedPath) {
    return false;
  }

  // Load .env into process.env
  // Note: dotenv won't override existing process.env vars, but calling loadEnvFile()
  // multiple times with different paths will merge variables from multiple files
  const result = dotenv.config({ path: resolvedPath });

  if (result.error) {
    // File exists but couldn't be parsed
    if (typeof console !== "undefined" && console.warn) {
      console.warn(
        `Failed to parse .env file at ${resolvedPath}:`,
        result.error,
      );
    }
    return false;
  }

  return true;
}
```