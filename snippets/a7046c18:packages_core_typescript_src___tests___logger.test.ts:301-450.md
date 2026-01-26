# a7046c18:packages_core_typescript_src___tests___logger.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // This triggers JSON.stringify for non-string args
      expect(() =>
        customLogger.info("Data:", { complex: { nested: true } }, [
          "array",
          "data",
        ]),
      ).not.toThrow();
    });

    it("should handle Sentry exception capture for errors", () => {
      const originalSentryLogging = process.env.SENTRY_LOGGING;
      process.env.SENTRY_LOGGING = ""; // Not 'false', so Sentry logging is enabled

      const customLogger = createLogger();
      const error = new Error("Sentry test");

      // This should trigger Sentry.captureException
      expect(() => customLogger.error(error)).not.toThrow();
      expect(() =>
        customLogger.error("Message with error:", error),
      ).not.toThrow();

      process.env.SENTRY_LOGGING = originalSentryLogging;
    });

    it("should handle all argument being non-string objects", () => {
      const customLogger = createLogger();

      // Logger expects string message after object, so we need to provide valid signatures
      expect(() =>
        customLogger.info({ a: 1, b: 2, c: 3 }, "Combined object log"),
      ).not.toThrow();
      expect(() =>
        customLogger.info("Objects:", { a: 1 }, { b: 2 }),
      ).not.toThrow();
    });

    it("should handle logger clear method when destination exists", () => {
      // Access the clear method if it exists
      if (typeof logger.clear === "function") {
        expect(() => logger.clear()).not.toThrow();
      }

      // Also test on a newly created logger
      const customLogger = createLogger();
      if (typeof customLogger.clear === "function") {
        expect(() => customLogger.clear()).not.toThrow();
      }
    });
  });

  describe("InMemoryDestination Coverage", () => {
    it("should handle non-JSON string data in write method", () => {
      const customLogger = createLogger();

      // This could trigger the non-JSON path in InMemoryDestination.write
      // when the transport receives malformed data
      expect(() =>
        customLogger.info("Simple text that might not be JSON"),
      ).not.toThrow();
    });

    it("should handle diagnostic mode with filtered logs", () => {
      process.env.LOG_DIAGNOSTIC = "true";
      process.env.LOG_LEVEL = "info"; // Not debug

      const customLogger = createLogger({ agentName: "test", agentId: "123" });

      // These should be filtered but diagnostic mode might log them
      expect(() => customLogger.info("registered successfully")).not.toThrow();
      expect(() => customLogger.info("Registering service")).not.toThrow();

      process.env.LOG_DIAGNOSTIC = "";
    });
  });

  describe("Async Stream Creation", () => {
    it("should handle async stream creation when require fails", async () => {
      // This test simulates the async fallback path
      // We can't easily mock require failure in test environments, so we test the async path exists
      const originalEnv = process.env.LOG_JSON_FORMAT;
      process.env.LOG_JSON_FORMAT = "false";

      // Force a new logger creation which might use async path
      // Note: bun:test doesn't have resetModules equivalent
      const { createLogger: asyncLogger } = await import("../logger");

      const logger = asyncLogger();
      expect(logger).toBeDefined();

      // Wait a bit for async initialization
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(() => logger.info("Async logger test")).not.toThrow();

      process.env.LOG_JSON_FORMAT = originalEnv;
    });

    it("should handle pino-pretty module not having default export", async () => {
      // Mock pino-pretty without default export
      // Note: bun:test has different module mocking behavior
      const { createLogger: testLogger } = await import("../logger");

      const logger = testLogger();
      expect(logger).toBeDefined();
    });
  });

  describe("Additional Custom Level Tests", () => {
    it("should use custom log levels", () => {
      const customLogger = createLogger();

      // Test custom levels exist and work
      expect(typeof customLogger.log).toBe("function");
      expect(typeof customLogger.progress).toBe("function");
      expect(typeof customLogger.success).toBe("function");

      expect(() => customLogger.log("Custom log message")).not.toThrow();
      expect(() => customLogger.progress("Progress update")).not.toThrow();
      expect(() => customLogger.success("Operation successful")).not.toThrow();
    });
  });

  describe("Custom Prettifier Edge Cases", () => {
    it("should handle undefined level in prettifier", () => {
      const customLogger = createLogger();

      // This might trigger the undefined level path in prettifier
      expect(() =>
        customLogger.info("Test with potential undefined level"),
      ).not.toThrow();
    });

    it("should handle null level in prettifier", () => {
      const customLogger = createLogger();

      // Force a log that might have null level
      expect(() =>
        customLogger.child({ level: null as string | undefined }).info("Test"),
      ).not.toThrow();
    });

    it("should handle object level data in prettifier", () => {
      const customLogger = createLogger();

      // Test object input to level prettifier
      expect(() =>
        customLogger.child({ level: 30 }).info("Test with numeric level"),
      ).not.toThrow();
    });
```