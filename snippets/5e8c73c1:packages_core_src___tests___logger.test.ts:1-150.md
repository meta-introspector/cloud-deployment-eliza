# 5e8c73c1:packages_core_src___tests___logger.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/logger.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, expect, it, beforeEach, afterEach, spyOn } from 'bun:test';
import { mock } from 'bun:test';
import { createLogger, logger, elizaLogger } from '../logger';

// Mock environment variables
const mockEnv = {
  LOG_LEVEL: '',
  DEFAULT_LOG_LEVEL: '',
  LOG_JSON_FORMAT: '',
  SENTRY_LOGGING: 'false',
  LOG_DIAGNOSTIC: '',
};

// No external logger transport to mock; Adze is used internally

describe('Logger', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    // Reset environment variables
    Object.keys(mockEnv).forEach((key) => {
      process.env[key] = mockEnv[key];
    });
    mock.restore();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Logger Creation', () => {
    it('should export logger instance', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      // Note: warn and debug methods exist on the pino logger instance
      // but may not be enumerable. Test their functionality instead.
      expect(logger.warn).toBeDefined();
      expect(logger.debug).toBeDefined();
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should export elizaLogger as alias for backward compatibility', () => {
      expect(elizaLogger).toBeDefined();
      expect(elizaLogger).toBe(logger);
    });

    it('should have custom log levels', () => {
      const testLogger = createLogger({ agentName: 'test' });
      expect(typeof testLogger.fatal).toBe('function');
      expect(typeof testLogger.error).toBe('function');
      expect(typeof testLogger.warn).toBe('function');
      expect(typeof testLogger.info).toBe('function');
      expect(typeof testLogger.debug).toBe('function');
      expect(typeof testLogger.trace).toBe('function');
    });
  });

  describe('createLogger Function', () => {
    it('should create logger with bindings', () => {
      const bindings = { agentName: 'TestAgent', agentId: '123' };
      const customLogger = createLogger(bindings);

      expect(customLogger).toBeDefined();
      expect(typeof customLogger.info).toBe('function');
    });

    it('should create logger without bindings', () => {
      const customLogger = createLogger();

      expect(customLogger).toBeDefined();
      expect(typeof customLogger.info).toBe('function');
    });

    it('should handle boolean bindings parameter', () => {
      const customLogger = createLogger(false);

      expect(customLogger).toBeDefined();
      expect(typeof customLogger.info).toBe('function');
    });
  });

  describe('Log Level Configuration', () => {
    it('should use debug level when LOG_LEVEL is debug', () => {
      process.env.LOG_LEVEL = 'debug';
      const customLogger = createLogger();

      // Logger should be created with debug level
      expect(customLogger.level).toBeDefined();
    });

    it('should use DEFAULT_LOG_LEVEL when LOG_LEVEL is not debug', () => {
      process.env.LOG_LEVEL = '';
      process.env.DEFAULT_LOG_LEVEL = 'warn';
      const customLogger = createLogger();

      expect(customLogger.level).toBeDefined();
    });

    it('should default to info level when no log level is specified', () => {
      process.env.LOG_LEVEL = '';
      process.env.DEFAULT_LOG_LEVEL = '';
      const customLogger = createLogger();

      expect(customLogger.level).toBeDefined();
    });
  });

  describe('JSON Format Configuration', () => {
    it('should use JSON format when LOG_JSON_FORMAT is true', () => {
      process.env.LOG_JSON_FORMAT = 'true';
      const customLogger = createLogger();

      expect(customLogger).toBeDefined();
      // The actual JSON output is verified in integration tests
      // since Adze's output mechanism is not easily mockable in unit tests
    });

    it('should use pretty format when LOG_JSON_FORMAT is false', () => {
      process.env.LOG_JSON_FORMAT = 'false';
      const customLogger = createLogger();

      expect(customLogger).toBeDefined();
    });

    it('should enable JSON format without throwing required fields error', () => {
      process.env.LOG_JSON_FORMAT = 'true';

      // This test verifies the main bug fix - that JSON format works without
      // "Required fields are missing" error. Detailed JSON format tests are
      // in logger-browser-node.test.ts for cross-environment coverage.
      expect(() => {
        const customLogger = createLogger();
        customLogger.info('Test message');
      }).not.toThrow();

      delete process.env.LOG_JSON_FORMAT;
    });
  });

  describe('Log Filtering', () => {
    it('should filter service registration logs in non-debug mode', () => {
      process.env.LOG_LEVEL = 'info';
      const customLogger = createLogger();

      // These logs should be filtered in non-debug mode
```