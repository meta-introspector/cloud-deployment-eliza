# a789b1dc:packages_project-tee-starter_src___tests___utils_core-test-utils.ts:151-169

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/project-tee-starter/src/__tests__/utils/core-test-utils.ts:151-169
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    entityId: uuidv4(),
    roomId: uuidv4(),
    content: {
      text,
      source: 'test',
    },
  } as Memory;
};

/**
 * Creates a mock state for testing
 */
export const createMockState = (): State => {
  return {
    values: {},
    data: {},
    text: '',
  };
};
```