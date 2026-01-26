# 5e8c73c1:packages_test-utils_src_TestInfrastructure.ts:301-318

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/TestInfrastructure.ts:301-318
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      memories.push(memory);
    }
    return memories;
  }
}

// Global test setup and teardown
if (typeof globalThis !== 'undefined') {
  // Clean up any remaining test environments on process exit
  const cleanup = () => {
    TestEnvironment.teardownAll().catch(console.error);
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('uncaughtException', cleanup);
}
```