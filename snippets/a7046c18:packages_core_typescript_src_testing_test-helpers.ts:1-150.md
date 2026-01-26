# a7046c18:packages_core_typescript_src_testing_test-helpers.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/testing/test-helpers.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * @fileoverview Test Helper Utilities
 *
 * Pure utility functions for testing that don't involve mocking.
 * These are helpers for creating test data, assertions, and common patterns.
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, Content, Memory, UUID } from "../types";

/**
 * Generate a random UUID for testing
 */
export function generateTestId(): UUID {
  return uuidv4() as UUID;
}

/**
 * Create a test memory object with sensible defaults
 */
export function createTestMemory(params: {
  entityId?: UUID;
  roomId?: UUID;
  agentId?: UUID;
  content: Content | string;
  tableName?: string;
}): Memory {
  const id = generateTestId();
  const entityId = params.entityId ?? generateTestId();
  const roomId = params.roomId ?? generateTestId();

  return {
    id,
    entityId,
    roomId,
    agentId: params.agentId,
    content:
      typeof params.content === "string"
        ? { text: params.content }
        : params.content,
    createdAt: Date.now(),
  };
}

/**
 * Create a minimal test character
 */
export function createTestCharacter(
  overrides: Partial<Character> = {},
): Character {
  return {
    name: overrides.name ?? "TestAgent",
    system: overrides.system ?? "You are a test agent.",
    bio: overrides.bio ?? ["Test agent"],
    messageExamples: overrides.messageExamples ?? [],
    postExamples: overrides.postExamples ?? [],
    topics: overrides.topics ?? ["testing"],
    knowledge: overrides.knowledge ?? [],
    plugins: overrides.plugins ?? [],
    settings: overrides.settings ?? {},
    ...overrides,
  };
}

/**
 * Wait for a condition to be true with timeout
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {},
): Promise<void> {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms timeout`);
}

/**
 * Expect a promise to reject with an error
 */
export async function expectRejection(
  promise: Promise<unknown>,
  expectedMessage?: string | RegExp,
): Promise<Error> {
  try {
    await promise;
    throw new Error("Expected promise to reject but it resolved");
  } catch (error) {
    if (!(error instanceof Error)) {
      throw new Error(`Expected Error but got: ${typeof error}`);
    }

    if (error.message === "Expected promise to reject but it resolved") {
      throw error;
    }

    if (expectedMessage) {
      if (typeof expectedMessage === "string") {
        if (!error.message.includes(expectedMessage)) {
          throw new Error(
            `Expected error message to include "${expectedMessage}" but got: "${error.message}"`,
          );
        }
      } else {
        if (!expectedMessage.test(error.message)) {
          throw new Error(
            `Expected error message to match ${expectedMessage} but got: "${error.message}"`,
          );
        }
      }
    }

    return error;
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number } = {},
): Promise<T> {
  const { maxRetries = 3, baseDelay = 100 } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = baseDelay * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Measure execution time of an async function
```