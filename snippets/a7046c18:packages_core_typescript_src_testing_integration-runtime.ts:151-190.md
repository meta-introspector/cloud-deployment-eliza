# a7046c18:packages_core_typescript_src_testing_integration-runtime.ts:151-190

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/integration-runtime.ts:151-190
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  );

  const cleanup = async () => {
    try {
      await runtime.stop();
      logger.debug(
        { src: "integration-test", agentId },
        "Test runtime cleaned up",
      );
    } catch (error) {
      logger.warn(
        {
          src: "integration-test",
          agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        "Error during test cleanup",
      );
    }
  };

  return { runtime, agentId, inferenceProvider, cleanup };
}

/**
 * Convenience wrapper that handles setup and cleanup automatically.
 */
export async function withTestRuntime<T>(
  testFn: (runtime: IAgentRuntime, agentId: UUID) => Promise<T>,
  config: IntegrationTestConfig,
): Promise<T> {
  const { runtime, agentId, cleanup } =
    await createIntegrationTestRuntime(config);

  try {
    return await testFn(runtime, agentId);
  } finally {
    await cleanup();
  }
}
```