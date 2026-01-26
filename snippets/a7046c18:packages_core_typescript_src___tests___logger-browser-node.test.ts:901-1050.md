# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        process.env.LOG_JSON_FORMAT = "true";

        expect(() => {
          const logger = createLogger();
          logger.info("Test Node JSON message", { data: "value" });
        }).not.toThrow();

        delete process.env.LOG_JSON_FORMAT;
      });

      it("should allow customizing name and hostname in Node.js JSON format", () => {
        process.env.LOG_JSON_FORMAT = "true";

        expect(() => {
          const logger = createLogger({
            name: "node-app",
            hostname: "node-server",
          });
          logger.info("Custom Node logger");
        }).not.toThrow();

        delete process.env.LOG_JSON_FORMAT;
      });

      it("should handle Node.js hostname detection for JSON format", () => {
        process.env.LOG_JSON_FORMAT = "true";

        expect(() => {
          const logger = createLogger();
          logger.info("Node hostname test");
        }).not.toThrow();

        delete process.env.LOG_JSON_FORMAT;
      });
    });

    describe("Consistent JSON Behavior Across Environments", () => {
      it("should handle metadata consistently in both environments", () => {
        const savedProcess = globalThis.process;

        // Set up JSON format
        globalThis.process = originalProcess || savedProcess;
        process.env.LOG_JSON_FORMAT = "true";

        const testMetadata = {
          name: "test-app",
          hostname: "test-host",
          environment: "testing",
          version: "1.0.0",
        };

        // Test Node.js
        globalThis.process = originalProcess || savedProcess;
        delete globalThis.window;
        delete globalThis.document;

        expect(() => {
          const nodeLogger = createLogger(testMetadata);
          nodeLogger.info("Node metadata test");
        }).not.toThrow();

        // Test Browser
        globalThis.window = {
          document: {},
          console: { info: mock() },
          location: { hostname: "browser-host" },
        };
        globalThis.document = {};
        delete globalThis.process;

        expect(() => {
          const browserLogger = createLogger({
            ...testMetadata,
            __forceType: "browser",
          });
          browserLogger.info("Browser metadata test");
        }).not.toThrow();

        // Clean up
        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
      });

      it("should handle error objects in JSON format consistently", () => {
        const savedProcess = globalThis.process;

        // Set up JSON format
        globalThis.process = originalProcess || savedProcess;
        process.env.LOG_JSON_FORMAT = "true";

        const testError = new Error("Test error");
        (testError as Error & { code?: string }).code = "ERR_TEST";

        // Node.js
        globalThis.process = originalProcess || savedProcess;
        delete globalThis.window;
        delete globalThis.document;

        expect(() => {
          const nodeLogger = createLogger();
          nodeLogger.error("Node error test", testError);
        }).not.toThrow();

        // Browser
        globalThis.window = {
          document: {},
          console: { error: mock() },
        };
        globalThis.document = {};
        delete globalThis.process;

        expect(() => {
          const browserLogger = createLogger({ __forceType: "browser" });
          browserLogger.error("Browser error test", testError);
        }).not.toThrow();

        // Clean up
        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
      });

      it("should handle all log levels in JSON format across environments", () => {
        const savedProcess = globalThis.process;

        // Set up JSON format
        globalThis.process = originalProcess || savedProcess;
        process.env.LOG_JSON_FORMAT = "true";

        // Node.js
        globalThis.process = originalProcess || savedProcess;
        delete globalThis.window;
        delete globalThis.document;

        expect(() => {
          const nodeLogger = createLogger();
          nodeLogger.trace("Node trace");
          nodeLogger.debug("Node debug");
          nodeLogger.info("Node info");
          nodeLogger.warn("Node warn");
          nodeLogger.error("Node error");
          nodeLogger.fatal("Node fatal");
          nodeLogger.success("Node success");
          nodeLogger.progress("Node progress");
        }).not.toThrow();

        // Browser
        globalThis.window = {
          document: {},
          console: {
            log: mock(),
```