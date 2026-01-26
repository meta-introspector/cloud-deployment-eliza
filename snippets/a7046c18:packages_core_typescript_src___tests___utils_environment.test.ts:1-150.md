# a7046c18:packages_core_typescript_src___tests___utils_environment.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/environment.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it, test } from "bun:test";
import {
  detectEnvironment,
  findEnvFile,
  getBooleanEnv,
  getEnv,
  getEnvironment,
  getNumberEnv,
  hasEnv,
  initBrowserEnvironment,
  loadEnvFile,
  setEnv,
} from "../../utils/environment";

describe("Environment Abstraction", () => {
  let originalProcess: typeof globalThis.process | undefined;
  let originalWindow: typeof globalThis.window | undefined;
  let originalGlobalThis: typeof globalThis | undefined;

  beforeEach(() => {
    // Store original values
    originalProcess = (global as typeof globalThis).process;
    originalWindow = (global as typeof globalThis).window;
    originalGlobalThis = globalThis;

    // Clear environment cache
    getEnvironment().clearCache();
  });

  afterEach(() => {
    // Restore original values
    if (originalProcess !== undefined) {
      (global as typeof globalThis).process = originalProcess;
    } else {
      delete (global as typeof globalThis & { process?: typeof process })
        .process;
    }

    if (originalWindow !== undefined) {
      (global as typeof globalThis).window = originalWindow;
    } else {
      delete (global as typeof globalThis & { window?: typeof window }).window;
    }

    if (originalGlobalThis !== undefined) {
      // Cannot reassign globalThis, so skip
    }

    // Clear cache after each test
    getEnvironment().clearCache();
  });

  describe("detectEnvironment", () => {
    it("should detect Node.js environment", () => {
      // Current test environment is Node.js
      const env = detectEnvironment();
      expect(env).toBe("node");
    });

    it("should detect browser environment when window is present", () => {
      // Save original values
      const originalProcess = (global as typeof globalThis).process;
      const originalWindow = (global as typeof globalThis).window;

      // Mock browser environment
      delete (global as typeof globalThis & { process?: typeof process })
        .process;
      (global as typeof globalThis & { window?: typeof window }).window = {
        document: {},
      } as typeof window;

      // Test detection directly
      const detectedEnv = detectEnvironment();
      expect(detectedEnv).toBe("browser");

      // Restore original values
      if (originalProcess !== undefined) {
        (global as typeof globalThis).process = originalProcess;
      }
      if (originalWindow !== undefined) {
        (global as typeof globalThis).window = originalWindow;
      }
    });
  });

  describe("getEnv", () => {
    it("should get environment variable in Node.js", () => {
      process.env.TEST_VAR = "test_value";
      const value = getEnv("TEST_VAR");
      expect(value).toBe("test_value");
      delete process.env.TEST_VAR;
    });

    it("should return default value when variable is not set", () => {
      const value = getEnv("NON_EXISTENT_VAR", "default");
      expect(value).toBe("default");
    });

    it("should cache environment variable values", () => {
      process.env.CACHE_TEST = "initial";
      const value1 = getEnv("CACHE_TEST");
      expect(value1).toBe("initial");

      // Change the actual env var
      process.env.CACHE_TEST = "changed";

      // Should still get cached value
      const value2 = getEnv("CACHE_TEST");
      expect(value2).toBe("initial");

      // Clear cache and get new value
      getEnvironment().clearCache();
      const value3 = getEnv("CACHE_TEST");
      expect(value3).toBe("changed");

      delete process.env.CACHE_TEST;
    });
  });

  describe("setEnv", () => {
    it("should set environment variable", () => {
      setEnv("SET_TEST_VAR", "test_value");
      const value = getEnv("SET_TEST_VAR");
      expect(value).toBe("test_value");
      delete process.env.SET_TEST_VAR;
    });

    it("should convert non-string values to strings", () => {
      setEnv("NUMBER_VAR", 123);
      const value = getEnv("NUMBER_VAR");
      expect(value).toBe("123");
      delete process.env.NUMBER_VAR;

      setEnv("BOOL_VAR", true);
      const value2 = getEnv("BOOL_VAR");
      expect(value2).toBe("true");
      delete process.env.BOOL_VAR;
    });
  });

  describe("hasEnv", () => {
    it("should return true for existing variables", () => {
      process.env.EXISTS = "yes";
      expect(hasEnv("EXISTS")).toBe(true);
      delete process.env.EXISTS;
    });

    it("should return false for non-existing variables", () => {
      expect(hasEnv("DOES_NOT_EXIST")).toBe(false);
    });
```