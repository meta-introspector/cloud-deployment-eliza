# a7046c18:packages_core_typescript_src_testing_test-helpers.ts:151-196

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/test-helpers.ts:151-196
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 */
export async function measureTime<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; durationMs: number }> {
  const start = performance.now();
  const result = await fn();
  const durationMs = performance.now() - start;
  return { result, durationMs };
}

/**
 * Test data generators
 */
export const testDataGenerators = {
  /** Generate a random UUID */
  uuid: (): UUID => uuidv4() as UUID,

  /** Generate a random string */
  randomString: (length = 10): string => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /** Generate a random sentence */
  randomSentence: (): string => {
    const words = [
      "hello",
      "world",
      "test",
      "agent",
      "memory",
      "runtime",
      "integration",
    ];
    const length = 5 + Math.floor(Math.random() * 10);
    return Array.from(
      { length },
      () => words[Math.floor(Math.random() * words.length)],
    ).join(" ");
  },
};
```