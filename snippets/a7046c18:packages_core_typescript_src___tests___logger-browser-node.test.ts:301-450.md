# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      delete globalThis.process;
      globalThis.window = { document: {} };
      globalThis.document = {};

      const mockConsole = {
        info: mock(),
        log: mock(),
      };
      globalThis.console = mockConsole as Console;

      // Clear cache to detect browser environment
      getEnvironment().clearCache();

      // Force browser type for testing with explicit level to avoid .env LOG_LEVEL interference
      const parentLogger = createLogger({
        parent: "main",
        __forceType: "browser",
        level: "info",
      });
      const childLogger = parentLogger.child({ child: "sub" });

      childLogger.info("Child message");
      expect(mockConsole.info).toHaveBeenCalled();
    });
  });

  describe("Node.js Logger (Adze backend in Node)", () => {
    beforeEach(() => {
      // Clear environment cache
      getEnvironment().clearCache();

      // Restore Node.js environment
      globalThis.process =
        originalProcess ||
        ({
          versions: { node: "20.0.0" },
          env: {},
        } as typeof process);
      delete globalThis.window;
      delete globalThis.document;

      // No need to mock transports; logger uses Adze in both environments

      // Clear cache again after environment setup
      getEnvironment().clearCache();
    });

    it("should provide logger API in Node.js environment", () => {
      const nodeLogger = createLogger();

      // Verify core methods exist
      expect(typeof nodeLogger.trace).toBe("function");
      expect(typeof nodeLogger.debug).toBe("function");
      expect(typeof nodeLogger.info).toBe("function");
      expect(typeof nodeLogger.warn).toBe("function");
      expect(typeof nodeLogger.error).toBe("function");
      expect(typeof nodeLogger.fatal).toBe("function");

      // Verify custom methods are added
      expect(typeof nodeLogger.success).toBe("function");
      expect(typeof nodeLogger.progress).toBe("function");
      expect(typeof nodeLogger.log).toBe("function");
    });

    it("should handle child loggers correctly", () => {
      const parentLogger = createLogger({ service: "api" });
      const childLogger = parentLogger.child({ request: "123" });

      expect(childLogger).toBeDefined();
      expect(typeof childLogger.info).toBe("function");
    });

    it("should support log level configuration options", () => {
      process.env.LOG_LEVEL = "debug";
      process.env.LOG_JSON_FORMAT = "true";

      const nodeLogger = createLogger();
      expect(nodeLogger.level).toBeDefined();

      process.env.LOG_LEVEL = "";
      process.env.LOG_JSON_FORMAT = "";
    });
  });

  describe("Cross-Environment Compatibility", () => {
    it("should maintain consistent API across environments", async () => {
      // Test Node.js logger
      globalThis.process =
        originalProcess ||
        ({ versions: { node: "20.0.0" }, env: {} } as typeof process);
      delete globalThis.window;
      const nodeLogger = createLogger();

      // Test browser logger
      globalThis.window = { document: {}, console: globalThis.console };
      globalThis.document = {};
      delete globalThis.process;
      const browserLogger = createLogger();

      // Both should have the same methods
      const methods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error",
        "fatal",
        "success",
        "progress",
        "log",
        "clear",
        "child",
      ];

      for (const method of methods) {
        expect(typeof nodeLogger[method]).toBe("function");
        expect(typeof browserLogger[method]).toBe("function");
      }
    });

    it("should handle complex log objects in both environments", () => {
      const testData = {
        user: { id: 123, name: "John" },
        metadata: { timestamp: Date.now(), version: "1.0" },
        nested: { deep: { value: "test" } },
      };

      // Test in Node.js
      globalThis.process =
        originalProcess ||
        ({ versions: { node: "20.0.0" }, env: {} } as typeof process);
      const nodeLogger = createLogger();
      expect(() => nodeLogger.info(testData, "Complex object")).not.toThrow();

      // Test in browser
      globalThis.window = { document: {}, console: { info: mock() } };
      globalThis.document = {};
      delete globalThis.process;
      const browserLogger = createLogger({ __forceType: "browser" });
      expect(() =>
        browserLogger.info(testData, "Complex object"),
      ).not.toThrow();
    });

    it("should handle errors consistently across environments", () => {
      const error = new Error("Test error");
      error.stack = "Error: Test error\n  at test.js:1:1";

      // Node.js
      globalThis.process =
```