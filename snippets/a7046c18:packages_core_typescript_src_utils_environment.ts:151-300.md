# a7046c18:packages_core_typescript_src_utils_environment.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/environment.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    let value: string | undefined;

    switch (this.runtime) {
      case "node":
        // In Node.js, use process.env
        if (typeof process !== "undefined" && process.env) {
          value = process.env[key];
        }
        break;

      case "browser":
        // In browser, use our store
        if (this.browserStore) {
          value = this.browserStore.get(key);
        }
        break;

      default:
        value = undefined;
    }

    // Cache the result
    this.cache.set(key, value);

    return value === undefined && defaultValue !== undefined
      ? defaultValue
      : value;
  }

  /**
   * Set an environment variable (mainly for browser/testing)
   */
  set(key: string, value: string | boolean | number): void {
    const stringValue = String(value);

    // Clear cache
    this.cache.delete(key);

    switch (this.runtime) {
      case "node":
        if (typeof process !== "undefined" && process.env) {
          process.env[key] = stringValue;
        }
        break;

      case "browser":
        if (this.browserStore) {
          this.browserStore.set(key, value);
        }
        break;
    }
  }

  /**
   * Check if an environment variable exists
   */
  has(key: string): boolean {
    const value = this.get(key);
    return value !== undefined;
  }

  /**
   * Get all environment variables (filtered for safety)
   */
  getAll(): EnvironmentConfig {
    switch (this.runtime) {
      case "node":
        if (typeof process !== "undefined" && process.env) {
          return { ...process.env };
        }
        break;

      case "browser":
        if (this.browserStore) {
          return this.browserStore.getAll();
        }
        break;
    }

    return {};
  }

  /**
   * Get a boolean environment variable
   */
  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.get(key);

    if (value === undefined) {
      return defaultValue;
    }

    // Common truthy values
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }

  /**
   * Get a number environment variable
   */
  getNumber(key: string, defaultValue?: number): number | undefined {
    const value = this.get(key);

    if (value === undefined) {
      return defaultValue;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Clear the cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Singleton instance of the Environment class
 */
let environmentInstance: Environment | null = null;

/**
 * Get the singleton Environment instance
 */
export function getEnvironment(): Environment {
  if (!environmentInstance) {
    environmentInstance = new Environment();
  }
  return environmentInstance;
}

/**
 * Convenience function to get an environment variable
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return getEnvironment().get(key, defaultValue);
}

/**
 * Convenience function to set an environment variable
 */
export function setEnv(key: string, value: string | boolean | number): void {
  getEnvironment().set(key, value);
}

/**
 * Convenience function to check if an environment variable exists
 */
```