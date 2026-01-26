# a7046c18:packages_ts-plugin-starter_src___tests___test-utils.ts:301-390

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/test-utils.ts:301-390
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Apply any overrides
    ...overrides,
  };

  // Setup logger spies if not already overridden
  if (!overrides.logger) {
    spyOn(logger, "info").mockImplementation(() => {});
    spyOn(logger, "warn").mockImplementation(() => {});
    spyOn(logger, "error").mockImplementation(() => {});
    spyOn(logger, "debug").mockImplementation(() => {});
  }

  return mockRuntime;
}

/**
 * Creates test fixtures for event payloads
 */
export const testFixtures = {
  messagePayload: (overrides: any = {}) => ({
    content: {
      text: "Test message",
      source: "test",
    },
    userId: createUUID(),
    roomId: createUUID(),
    runtime: createMockRuntime(),
    source: "test",
    ...overrides,
  }),

  worldPayload: (overrides: any = {}) => ({
    content: {
      text: "World event",
      world: "test-world",
    },
    userId: createUUID(),
    roomId: createUUID(),
    runtime: createMockRuntime(),
    source: "test",
    ...overrides,
  }),
};

/**
 * Type guard to check if a value is a mock function
 */
export function isMockFunction(value: any): value is ReturnType<typeof mock> {
  return value && typeof value.mock === "object";
}

/**
 * Helper to assert spy was called with specific arguments
 */
export function assertSpyCalledWith(spy: any, ...args: any[]) {
  if (!isMockFunction(spy)) {
    throw new Error("Not a mock function");
  }

  const calls = spy.mock.calls;
  const found = calls.some((call: any[]) =>
    args.every((arg, index) => {
      if (typeof arg === "object" && arg !== null) {
        return JSON.stringify(arg) === JSON.stringify(call[index]);
      }
      return arg === call[index];
    }),
  );

  if (!found) {
    throw new Error(
      `Spy was not called with expected arguments: ${JSON.stringify(args)}`,
    );
  }
}

/**
 * Setup logger spies for testing
 */
export function setupLoggerSpies() {
  spyOn(logger, "info").mockImplementation(() => {});
  spyOn(logger, "warn").mockImplementation(() => {});
  spyOn(logger, "error").mockImplementation(() => {});
  spyOn(logger, "debug").mockImplementation(() => {});
}

/**
 * Type definition for the mock runtime (for backward compatibility)
 */
export type MockRuntime = IAgentRuntime;
```