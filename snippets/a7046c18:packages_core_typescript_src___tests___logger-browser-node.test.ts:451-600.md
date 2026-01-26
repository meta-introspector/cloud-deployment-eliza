# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        originalProcess ||
        ({ versions: { node: "20.0.0" }, env: {} } as typeof process);
      const nodeLogger = createLogger();
      expect(() => nodeLogger.error(error)).not.toThrow();
      expect(() => nodeLogger.error({ error }, "Error occurred")).not.toThrow();

      // Browser
      globalThis.window = { document: {}, console: { error: mock() } };
      globalThis.document = {};
      delete globalThis.process;
      const browserLogger = createLogger({ __forceType: "browser" });
      expect(() => browserLogger.error(error)).not.toThrow();
      expect(() =>
        browserLogger.error({ error }, "Error occurred"),
      ).not.toThrow();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle undefined console methods in browser", () => {
      globalThis.window = { document: {} };
      globalThis.document = {};
      // Create a partial console mock - missing methods will fallback to console.log
      globalThis.console = {
        log: mock(),
        // Missing other methods - logger will fallback to console.log
      } as Partial<Console> as Console;

      const browserLogger = createLogger({ __forceType: "browser" });

      // Should fallback to console.log for missing methods
      expect(() => browserLogger.info("Test")).not.toThrow();
      expect(() => browserLogger.warn("Test")).not.toThrow();
    });

    it("should handle circular references in objects", () => {
      type CircularObject = Record<string, unknown> & {
        name: string;
        circular?: CircularObject;
      };
      const obj: CircularObject = { name: "test" };
      obj.circular = obj;

      const browserLogger = createLogger({ __forceType: "browser" });
      expect(() => browserLogger.info(obj, "Circular reference")).not.toThrow();
    });

    it("should handle very long messages", () => {
      const longMessage = "x".repeat(10000);
      const browserLogger = createLogger({ __forceType: "browser" });
      expect(() => browserLogger.info(longMessage)).not.toThrow();
    });

    it("should handle null and undefined values", () => {
      const browserLogger = createLogger({ __forceType: "browser" });
      expect(() => browserLogger.info(null, "Null value")).not.toThrow();
      expect(() =>
        browserLogger.info(undefined, "Undefined value"),
      ).not.toThrow();
      expect(() => browserLogger.info({ value: null })).not.toThrow();
      expect(() => browserLogger.info({ value: undefined })).not.toThrow();
    });
  });

  describe("Memory Management", () => {
    it("should limit in-memory log storage", () => {
      // Setup browser environment first
      globalThis.window = { document: {}, console: globalThis.console };
      globalThis.document = {};
      delete globalThis.process;

      const browserLogger = createLogger({ __forceType: "browser" });

      // Log more than the max limit (1000 by default)
      for (let i = 0; i < 1100; i++) {
        browserLogger.info(`Message ${i}`);
      }

      // Should not crash and should maintain limit
      expect(() => browserLogger.clear()).not.toThrow();
    });

    it("should respect custom maxMemoryLogs option", () => {
      // Setup browser environment
      globalThis.window = { document: {}, console: globalThis.console };
      globalThis.document = {};
      delete globalThis.process;

      // Create logger with custom maxMemoryLogs
      const customLimit = 50;
      const browserLogger = createLogger({
        __forceType: "browser",
        maxMemoryLogs: customLimit,
      });

      // Log more than the custom limit
      for (let i = 0; i < customLimit + 10; i++) {
        browserLogger.info(`Message ${i}`);
      }

      // Should not crash and should maintain custom limit
      expect(() => browserLogger.clear()).not.toThrow();
    });

    it("should clear logs properly in both environments", () => {
      // Browser
      const mockClear = mock();
      globalThis.window = { document: {}, console: { clear: mockClear } };
      globalThis.document = {};
      globalThis.console = { ...globalThis.console, clear: mockClear };
      delete globalThis.process;

      const browserLogger = createLogger({ __forceType: "browser" });
      browserLogger.clear();
      expect(mockClear).toHaveBeenCalled();

      // Node.js
      globalThis.process =
        originalProcess ||
        ({ versions: { node: "20.0.0" }, env: {} } as typeof process);
      delete globalThis.window;
      const nodeLogger = createLogger();
      expect(() => nodeLogger.clear()).not.toThrow();
    });

    it("should not throw when using __forceType binding in Node", () => {
      globalThis.process =
        originalProcess ||
        ({ versions: { node: "20.0.0" }, env: {} } as typeof process);
      delete globalThis.window;
      delete globalThis.document;

      expect(() =>
        createLogger({
          __forceType: "node",
          appName: "test-app",
          userId: "123",
        }),
      ).not.toThrow();
    });
  });

  describe("Circular Reference Handling - Advanced Edge Cases", () => {
    it("should handle multiple circular references in different arguments", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      // Create multiple objects with different circular patterns
      const obj1: any = { name: "obj1", data: { value: 1 } };
      const obj2: any = { name: "obj2", data: { value: 2 } };
      const obj3: any = { name: "obj3", data: { value: 3 } };
```