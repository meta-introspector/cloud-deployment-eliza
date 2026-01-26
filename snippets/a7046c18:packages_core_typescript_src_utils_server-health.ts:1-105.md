# a7046c18:packages_core_typescript_src_utils_server-health.ts:1-105

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/server-health.ts:1-105
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Server health check utilities for waiting for servers to be ready
 */

export interface ServerHealthOptions {
  port: number;
  endpoint?: string;
  maxWaitTime?: number;
  pollInterval?: number;
  requestTimeout?: number;
  host?: string;
  protocol?: "http" | "https";
}

/**
 * Wait for server to be ready by polling health endpoint
 * @param options - Configuration options for server health check
 */
export async function waitForServerReady(
  options: ServerHealthOptions,
): Promise<void> {
  const {
    port,
    endpoint = "/api/agents",
    maxWaitTime = 30000, // 30 seconds default
    pollInterval = 1000, // 1 second
    requestTimeout = 2000, // 2 seconds
    host = "localhost",
    protocol = "http",
  } = options;

  const url = `${protocol}://${host}:${port}${endpoint}`;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    let controller: AbortController | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    controller = new AbortController();
    timeoutId = setTimeout(() => {
      if (controller) {
        controller.abort();
      }
    }, requestTimeout);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }

    if (response.ok) {
      // Server is ready, give it one more second to stabilize
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(
    `Server failed to become ready at ${url} within ${maxWaitTime}ms`,
  );
}

/**
 * Simple ping check for server availability (no stabilization wait)
 * @param options - Configuration options for server ping
 */
export async function pingServer(
  options: ServerHealthOptions,
): Promise<boolean> {
  const {
    port,
    endpoint = "/api/agents",
    requestTimeout = 2000,
    host = "localhost",
    protocol = "http",
  } = options;

  const url = `${protocol}://${host}:${port}${endpoint}`;
  let controller: AbortController | undefined;
  let timeoutId: NodeJS.Timeout | undefined;

  controller = new AbortController();
  timeoutId = setTimeout(() => {
    if (controller) {
      controller.abort();
    }
  }, requestTimeout);

  const response = await fetch(url, {
    signal: controller.signal,
  });

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }

  return response.ok;
}
```