# 5e8c73c1:packages_core_src_utils_environment.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/environment.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Browser and Node.js compatible environment variable abstraction
 * This module provides a unified interface for accessing environment variables
 * that works in both browser and Node.js environments.
 */

/**
 * Type representing the runtime environment
 */
export type RuntimeEnvironment = 'node' | 'browser' | 'unknown';

/**
 * Interface for environment configuration
 */
export interface EnvironmentConfig {
  [key: string]: string | boolean | number | undefined;
}

/**
 * Detect the current runtime environment
 */
export function detectEnvironment(): RuntimeEnvironment {
  // Check for Node.js
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }

  // Check for browser
  interface GlobalWithWindow {
    window?: Window & {
      document?: Document;
    };
  }

  if (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as GlobalWithWindow).window !== 'undefined' &&
    typeof (globalThis as GlobalWithWindow).window?.document !== 'undefined'
  ) {
    return 'browser';
  }

  return 'unknown';
}

/**
 * Environment variable storage for browser environments
 */
class BrowserEnvironmentStore {
  private store: EnvironmentConfig = {};

  constructor() {
    interface GlobalWithWindowEnv {
      window?: {
        ENV?: EnvironmentConfig;
      };
    }

    interface GlobalWithEnv {
      __ENV__?: EnvironmentConfig;
    }

    // Load from window.ENV if available (common pattern for browser apps)
    const windowWithEnv = globalThis as GlobalWithWindowEnv;
    if (typeof globalThis !== 'undefined' && windowWithEnv.window && windowWithEnv.window.ENV) {
      this.store = { ...windowWithEnv.window.ENV };
    }

    // Also check for __ENV__ (another common pattern)
    const globalWithEnv = globalThis as GlobalWithEnv;
    if (typeof globalThis !== 'undefined' && globalWithEnv.__ENV__) {
      this.store = { ...this.store, ...globalWithEnv.__ENV__ };
    }
  }

  get(key: string): string | undefined {
    const value = this.store[key];
    return value !== undefined ? String(value) : undefined;
  }

  set(key: string, value: string | boolean | number): void {
    this.store[key] = value;
  }

  has(key: string): boolean {
    return key in this.store;
  }

  getAll(): EnvironmentConfig {
    return { ...this.store };
  }
}

/**
 * Environment abstraction class
 */
class Environment {
  private runtime: RuntimeEnvironment;
  private browserStore?: BrowserEnvironmentStore;
  private cache: Map<string, string | undefined> = new Map();

  constructor() {
    this.runtime = detectEnvironment();

    if (this.runtime === 'browser') {
      this.browserStore = new BrowserEnvironmentStore();
    }
  }

  /**
   * Get the current runtime environment
   */
  getRuntime(): RuntimeEnvironment {
    return this.runtime;
  }

  /**
   * Check if running in Node.js
   */
  isNode(): boolean {
    return this.runtime === 'node';
  }

  /**
   * Check if running in browser
   */
  isBrowser(): boolean {
    return this.runtime === 'browser';
  }

  /**
   * Get an environment variable
   */
  get(key: string, defaultValue?: string): string | undefined {
    // Check cache first
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      return cached === undefined && defaultValue !== undefined ? defaultValue : cached;
    }

    let value: string | undefined;

    switch (this.runtime) {
      case 'node':
        // In Node.js, use process.env
        if (typeof process !== 'undefined' && process.env) {
          value = process.env[key];
        }
        break;

```