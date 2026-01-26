# 5e8c73c1:packages_test-utils_src_testDatabase.ts:901-936

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:901-936
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    this.tempPaths.clear();
    this.testDatabases.clear();

    logger.debug({ src: 'test-utils:test-database' }, 'Successfully cleaned up all test databases');
  }

  /**
   * Get statistics about test databases
   */
  getStats(): {
    activeDatabases: number;
    tempPaths: string[];
    memoryUsage: string;
  } {
    return {
      activeDatabases: this.testDatabases.size,
      tempPaths: Array.from(this.tempPaths),
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    };
  }
}

/**
 * Convenience function to create an isolated test database
 */
export async function createTestDatabase(testId?: string): Promise<{
  adapter: IDatabaseAdapter;
  manager: TestDatabaseManager;
  testId: string;
}> {
  const actualTestId = testId || `test-${uuidv4().slice(0, 8)}`;
  const manager = new TestDatabaseManager();
  const adapter = await manager.createIsolatedDatabase(actualTestId);

  return { adapter, manager, testId: actualTestId };
}
```