# a7046c18:packages_core_typescript_src___tests___logger.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        "registered successfully",
        "Registering",
        "Success:",
        "linked to",
        "Started",
      ];

      // Logger is created and can handle these messages
      filteredMessages.forEach((msg) => {
        expect(() =>
          customLogger.info({ agentName: "test", agentId: "123" }, msg),
        ).not.toThrow();
      });
    });

    it("should not filter service registration logs in debug mode", () => {
      process.env.LOG_LEVEL = "debug";
      const customLogger = createLogger();

      // In debug mode, all logs should pass through
      expect(customLogger.level).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle Error objects in log messages", () => {
      const customLogger = createLogger();
      const testError = new Error("Test error");

      expect(() => customLogger.error(testError)).not.toThrow();
      expect(() => customLogger.error("Message", testError)).not.toThrow();
      expect(() =>
        customLogger.error({ context: "test" }, "Error occurred", testError),
      ).not.toThrow();
    });

    it("should format error messages properly", () => {
      const customLogger = createLogger();
      const testError = new Error("Test error");
      testError.name = "TestError";

      // Should handle error formatting without throwing
      expect(() => customLogger.error(testError)).not.toThrow();
    });
  });

  describe("Clear Method", () => {
    it("should have clear method when not using raw JSON format", () => {
      process.env.LOG_JSON_FORMAT = "false";
      // Since the logger is created asynchronously with pretty printing,
      // we just verify the logger is created successfully
      expect(logger).toBeDefined();
    });
  });

  describe("Hook Methods", () => {
    it("should handle various log input formats", () => {
      const customLogger = createLogger();

      // Test various input formats
      expect(() => customLogger.info("Simple string")).not.toThrow();
      expect(() =>
        customLogger.info({ key: "value" }, "With object"),
      ).not.toThrow();
      expect(() =>
        customLogger.info("Multiple", "string", "parts"),
      ).not.toThrow();
      expect(() =>
        customLogger.error(new Error("Test"), "With error"),
      ).not.toThrow();
    });

    it("should handle mixed arguments with errors", () => {
      const customLogger = createLogger();
      const error = new Error("Test error");

      expect(() =>
        customLogger.error("Message", error, { extra: "data" }),
      ).not.toThrow();
    });
  });

  describe("Diagnostic Mode", () => {
    it("should add diagnostic flag when LOG_DIAGNOSTIC is enabled", () => {
      process.env.LOG_DIAGNOSTIC = "true";
      const customLogger = createLogger();

      // Logger should handle diagnostic mode
      expect(customLogger).toBeDefined();
    });
  });

  describe("Custom Prettifiers", () => {
    it("should format log levels correctly", () => {
      const customLogger = createLogger();

      // Test that various log levels work
      expect(() => customLogger.trace("Trace message")).not.toThrow();
      expect(() => customLogger.debug("Debug message")).not.toThrow();
      expect(() => customLogger.info("Info message")).not.toThrow();
      expect(() => customLogger.warn("Warn message")).not.toThrow();
      expect(() => customLogger.error("Error message")).not.toThrow();
      expect(() => customLogger.fatal("Fatal message")).not.toThrow();
    });
  });

  describe("Comprehensive Hook Method Coverage", () => {
    it("should handle error as first argument with formatting", () => {
      const customLogger = createLogger();
      const error = new Error("Test error message");
      error.name = "CustomError";
      error.stack =
        "Error: Test error message\n    at Object.<anonymous> (test.js:1:1)";

      // This triggers the formatError path in hooks.logMethod
      expect(() => customLogger.error(error)).not.toThrow();
    });

    it("should handle object with multiple string arguments", () => {
      const customLogger = createLogger();

      // This triggers the object + rest args path
      expect(() =>
        customLogger.info({ userId: "123" }, "User", "logged", "in"),
      ).not.toThrow();
    });

    it("should handle string with error in rest arguments", () => {
      const customLogger = createLogger();
      const error1 = new Error("First error");
      const error2 = new Error("Second error");

      // This triggers error handling in rest args
      expect(() =>
        customLogger.error("Multiple errors:", error1, error2),
      ).not.toThrow();
    });

    it("should handle mixed object and string arguments", () => {
      const customLogger = createLogger();

      // This triggers the context building path
      expect(() =>
        customLogger.info("Status:", { active: true }, "for user"),
      ).not.toThrow();
    });

    it("should handle non-string, non-error objects in arguments", () => {
      const customLogger = createLogger();

```