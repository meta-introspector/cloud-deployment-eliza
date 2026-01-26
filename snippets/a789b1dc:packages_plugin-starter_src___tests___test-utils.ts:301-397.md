# a789b1dc:packages_plugin-starter_src___tests___test-utils.ts:301-397

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-starter/src/__tests__/test-utils.ts:301-397
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```

    // Cache methods
    getCache: mock().mockResolvedValue(undefined),
    setCache: mock().mockResolvedValue(true),
    deleteCache: mock().mockResolvedValue(true),

    // Other missing database methods
    getMemoriesByWorldId: mock().mockResolvedValue([]),

    // Apply any overrides
    ...overrides,
  };

  // Setup logger spies if not already overridden
  if (!overrides.logger) {
    spyOn(logger, 'info').mockImplementation(() => {});
    spyOn(logger, 'warn').mockImplementation(() => {});
    spyOn(logger, 'error').mockImplementation(() => {});
    spyOn(logger, 'debug').mockImplementation(() => {});
  }

  return mockRuntime;
}

/**
 * Creates test fixtures for event payloads
 */
export const testFixtures = {
  messagePayload: (overrides: any = {}) => ({
    content: {
      text: 'Test message',
      source: 'test',
    },
    userId: createUUID(),
    roomId: createUUID(),
    runtime: createMockRuntime(),
    source: 'test',
    ...overrides,
  }),

  worldPayload: (overrides: any = {}) => ({
    content: {
      text: 'World event',
      world: 'test-world',
    },
    userId: createUUID(),
    roomId: createUUID(),
    runtime: createMockRuntime(),
    source: 'test',
    ...overrides,
  }),
};

/**
 * Type guard to check if a value is a mock function
 */
export function isMockFunction(value: any): value is ReturnType<typeof mock> {
  return value && typeof value.mock === 'object';
}

/**
 * Helper to assert spy was called with specific arguments
 */
export function assertSpyCalledWith(spy: any, ...args: any[]) {
  if (!isMockFunction(spy)) {
    throw new Error('Not a mock function');
  }

  const calls = spy.mock.calls;
  const found = calls.some((call: any[]) =>
    args.every((arg, index) => {
      if (typeof arg === 'object' && arg !== null) {
        return JSON.stringify(arg) === JSON.stringify(call[index]);
      }
      return arg === call[index];
    })
  );

  if (!found) {
    throw new Error(`Spy was not called with expected arguments: ${JSON.stringify(args)}`);
  }
}

/**
 * Setup logger spies for testing
 */
export function setupLoggerSpies() {
  spyOn(logger, 'info').mockImplementation(() => {});
  spyOn(logger, 'warn').mockImplementation(() => {});
  spyOn(logger, 'error').mockImplementation(() => {});
  spyOn(logger, 'debug').mockImplementation(() => {});
}

/**
 * Type definition for the mock runtime (for backward compatibility)
 */
export type MockRuntime = IAgentRuntime;
```