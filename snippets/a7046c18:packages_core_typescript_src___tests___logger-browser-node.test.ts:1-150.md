# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { createLogger } from "../logger";
import { getEnvironment } from "../utils/environment";

/**
 * Test type definitions
 */
interface MockProcess extends Partial<typeof process> {
  versions?: {
    node?: string;
  };
  env?: Record<string, string | undefined>;
}

interface MockWindow extends Partial<typeof globalThis.window> {
  document?: object;
  console?: Partial<Console>;
  location?: {
    hostname?: string;
  };
}

type MockDocument = Partial<typeof globalThis.document>;

/**
 * Comprehensive tests for both Node.js and Browser logger implementations
 * This test suite ensures the logger works correctly in both environments
 */

describe("Logger - Cross-Environment Tests", () => {
  let originalProcess: typeof process | undefined;
  let originalWindow: typeof globalThis.window | undefined;
  let originalDocument: typeof globalThis.document | undefined;

  beforeEach(() => {
    // Save original globals
    originalProcess = globalThis.process;
    originalWindow = globalThis.window;
    originalDocument = globalThis.document;
    mock.restore();
  });

  afterEach(() => {
    // Restore original globals
    if (originalProcess !== undefined) {
      globalThis.process = originalProcess;
    } else {
      delete globalThis.process;
    }
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    } else {
      delete globalThis.window;
    }
    if (originalDocument !== undefined) {
      globalThis.document = originalDocument;
    } else {
      delete globalThis.document;
    }
    mock.restore();
    // Clear environment cache for next test
    getEnvironment().clearCache();
  });

  describe("Environment Detection", () => {
    it("should detect Node.js environment correctly", () => {
      // Ensure we're in Node.js environment
      globalThis.process = {
        versions: { node: "20.0.0" },
        env: { LOG_LEVEL: "info" },
      } as typeof process;
      delete globalThis.window;
      delete globalThis.document;

      const isNode =
        typeof process !== "undefined" &&
        typeof process.versions !== "undefined" &&
        typeof process.versions.node !== "undefined";
      const isBrowser =
        typeof globalThis !== "undefined" &&
        typeof globalThis.window !== "undefined" &&
        typeof globalThis.document !== "undefined";

      expect(isNode).toBe(true);
      expect(isBrowser).toBe(false);
    });

    it("should detect browser environment correctly", () => {
      // Simulate browser environment
      globalThis.window = {
        document: {},
        console: {
          log: mock(),
          info: mock(),
          warn: mock(),
          error: mock(),
          debug: mock(),
          trace: mock(),
        },
      };
      globalThis.document = {};
      delete globalThis.process;

      const isNode =
        typeof process !== "undefined" &&
        typeof process.versions !== "undefined" &&
        typeof process.versions.node !== "undefined";
      const isBrowser =
        typeof globalThis !== "undefined" &&
        typeof globalThis.window !== "undefined" &&
        typeof globalThis.document !== "undefined";

      expect(isNode).toBe(false);
      expect(isBrowser).toBe(true);
    });
  });

  describe("BrowserLogger Class", () => {
    beforeEach(() => {
      // Clear environment cache to ensure proper detection
      getEnvironment().clearCache();

      // Mock browser environment
      globalThis.window = {
        document: {},
        console: {
          log: mock(),
          info: mock(),
          warn: mock(),
          error: mock(),
          debug: mock(),
          trace: mock(),
          clear: mock(),
        },
      };
      globalThis.document = {};
      globalThis.console = globalThis.window.console as Console;

      // Clear cache again after setting up environment
      getEnvironment().clearCache();
    });

    it("should create BrowserLogger instance with all required methods", async () => {
      // Dynamically import to trigger browser detection
      const module = await import("../logger");

      // Create a browser logger instance, force browser type for testing
      const browserLogger = module.createLogger({
        test: "browser",
        __forceType: "browser",
```