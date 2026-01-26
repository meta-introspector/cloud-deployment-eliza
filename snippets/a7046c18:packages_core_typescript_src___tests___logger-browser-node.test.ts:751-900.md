# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      for (let i = 1; i < 100; i++) {
        current.next = { level: i, prev: current };
        current = current.next;
      }

      // Add circular reference at the end
      current.next = root;
      root.tail = current;

      expect(() =>
        browserLogger.info("Deep chain circular:", root),
      ).not.toThrow();
    });
  });

  describe("JSON Format Configuration - Cross-Environment", () => {
    beforeEach(() => {
      // Clear environment cache
      getEnvironment().clearCache();
    });

    describe("Browser JSON Format Tests", () => {
      let savedProcess: any;

      beforeEach(() => {
        // Save process before deleting it
        savedProcess = globalThis.process;

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
          location: {
            hostname: "localhost",
          },
        };
        globalThis.document = {};
        delete globalThis.process;
        getEnvironment().clearCache();
      });

      afterEach(() => {
        // Restore process
        globalThis.process = savedProcess;
      });

      it("should create browser logger with JSON format enabled without errors", () => {
        // Restore process temporarily to set env var
        globalThis.process = savedProcess;
        process.env.LOG_JSON_FORMAT = "true";
        delete globalThis.process; // Remove again for browser simulation

        expect(() => {
          const logger = createLogger({ __forceType: "browser" });
          logger.info("Test browser JSON message", { data: "value" });
        }).not.toThrow();

        // Restore to clean up
        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
        delete globalThis.process;
      });

      it("should allow customizing name and hostname in browser JSON format", () => {
        globalThis.process = savedProcess;
        process.env.LOG_JSON_FORMAT = "true";
        delete globalThis.process;

        expect(() => {
          const logger = createLogger({
            __forceType: "browser",
            name: "browser-app",
            hostname: "browser-host",
          });
          logger.info("Custom browser logger");
        }).not.toThrow();

        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
        delete globalThis.process;
      });

      it("should handle browser hostname detection for JSON format", () => {
        globalThis.process = savedProcess;
        process.env.LOG_JSON_FORMAT = "true";
        delete globalThis.process;

        // Test with window.location.hostname
        globalThis.window = {
          ...globalThis.window,
          location: { hostname: "test-browser-host" },
        };

        expect(() => {
          const logger = createLogger({ __forceType: "browser" });
          logger.info("Browser hostname test");
        }).not.toThrow();

        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
        delete globalThis.process;
      });

      it("should handle missing window.location gracefully in JSON format", () => {
        globalThis.process = savedProcess;
        process.env.LOG_JSON_FORMAT = "true";
        delete globalThis.process;

        // Remove location to test fallback
        globalThis.window = {
          document: {},
          console: globalThis.window?.console || {},
        };

        expect(() => {
          const logger = createLogger({ __forceType: "browser" });
          logger.info("Browser without location");
        }).not.toThrow();

        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
        delete globalThis.process;
      });
    });

    describe("Node.js JSON Format Tests", () => {
      beforeEach(() => {
        // Restore Node.js environment
        globalThis.process =
          originalProcess ||
          ({
            versions: { node: "20.0.0" },
            env: {},
            platform: "darwin",
          } as typeof process);
        delete globalThis.window;
        delete globalThis.document;
        getEnvironment().clearCache();
      });

      it("should create Node.js logger with JSON format enabled without errors", () => {
```