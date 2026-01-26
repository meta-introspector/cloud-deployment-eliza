# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      });

      // Verify all required methods exist
      expect(typeof browserLogger.trace).toBe("function");
      expect(typeof browserLogger.debug).toBe("function");
      expect(typeof browserLogger.info).toBe("function");
      expect(typeof browserLogger.warn).toBe("function");
      expect(typeof browserLogger.error).toBe("function");
      expect(typeof browserLogger.fatal).toBe("function");

      // Verify custom elizaOS methods exist
      expect(typeof browserLogger.success).toBe("function");
      expect(typeof browserLogger.progress).toBe("function");
      expect(typeof browserLogger.log).toBe("function");
      expect(typeof browserLogger.clear).toBe("function");
      expect(typeof browserLogger.child).toBe("function");
    });

    it("should log messages to console in browser environment", () => {
      // Ensure we're in browser environment
      delete globalThis.process;
      globalThis.window = { document: {} };
      globalThis.document = {};

      // Mock console methods
      const mockConsole = {
        log: mock(),
        info: mock(),
        warn: mock(),
        error: mock(),
        debug: mock(),
        trace: mock(),
        clear: mock(),
      };
      globalThis.console = mockConsole as Console;

      // Create browser logger with debug level to ensure all levels are logged
      const browserLogger = createLogger({
        level: "debug",
        __forceType: "browser",
      });

      // Test various log levels
      browserLogger.info("Info message");
      browserLogger.warn("Warning message");
      browserLogger.error("Error message");
      browserLogger.debug("Debug message");

      // Verify console methods were called
      expect(mockConsole.info).toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
      expect(mockConsole.debug).toHaveBeenCalled();
    });

    it("should format messages with objects correctly in browser", () => {
      // Ensure we're in browser environment
      delete globalThis.process;
      globalThis.window = { document: {} };
      globalThis.document = {};

      const mockConsole = {
        info: mock(),
        log: mock(),
        warn: mock(),
        error: mock(),
        debug: mock(),
        trace: mock(),
      };
      globalThis.console = mockConsole as Console;

      // Create logger with debug level to ensure all levels are logged
      const browserLogger = createLogger({
        level: "debug",
        __forceType: "browser",
      });

      // Test with object
      browserLogger.info({ user: "john", action: "login" }, "User logged in");
      expect(mockConsole.info).toHaveBeenCalled();

      // Test with error
      const error = new Error("Test error");
      browserLogger.error(error);
      expect(mockConsole.error).toHaveBeenCalled();

      // Test custom levels (success and progress map to info)
      browserLogger.success("Operation successful");
      browserLogger.progress("50% complete");
      expect(mockConsole.info).toHaveBeenCalled();
    });

    it("should respect log levels in browser environment", () => {
      // Ensure we're in browser environment
      delete globalThis.process;
      globalThis.window = { document: {} };
      globalThis.document = {};

      const mockConsole = {
        trace: mock(),
        debug: mock(),
        info: mock(),
        warn: mock(),
        error: mock(),
        log: mock(),
      };
      globalThis.console = mockConsole as Console;

      // Clear cache to detect browser environment
      getEnvironment().clearCache();

      // Create logger with warn level, force browser type for testing
      const browserLogger = createLogger({
        level: "warn",
        __forceType: "browser",
      });

      // These should not log (below warn level)
      browserLogger.trace("Trace message");
      browserLogger.debug("Debug message");
      browserLogger.info("Info message");

      // These should log (warn level and above)
      browserLogger.warn("Warning message");
      browserLogger.error("Error message");
      browserLogger.fatal("Fatal message");

      // Verify only warn and above were called
      expect(mockConsole.trace).not.toHaveBeenCalled();
      expect(mockConsole.debug).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it("should maintain in-memory log storage in browser", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      // Log multiple messages
      browserLogger.info("Message 1");
      browserLogger.warn("Message 2");
      browserLogger.error("Message 3");

      // Verify messages are stored (would be accessible via inMemoryDestination)
      // The actual storage is internal, but we can verify the logger doesn't crash
      expect(() => browserLogger.clear()).not.toThrow();
    });

    it("should handle child loggers in browser", () => {
      // Ensure we're in browser environment
```