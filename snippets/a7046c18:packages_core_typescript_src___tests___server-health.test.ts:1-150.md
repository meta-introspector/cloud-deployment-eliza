# a7046c18:packages_core_typescript_src___tests___server-health.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/server-health.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { pingServer, waitForServerReady } from "../utils/server-health";

describe("Server Health Utilities", () => {
  let originalFetch: typeof fetch;
  let fetchMock: ReturnType<typeof mock>;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchMock = mock(() =>
      Promise.resolve(new Response("OK", { status: 200 })),
    );
    globalThis.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    mock.restore();
  });

  describe("pingServer", () => {
    it("should return true when server responds with OK status", async () => {
      fetchMock.mockResolvedValueOnce(new Response("OK", { status: 200 }));

      const result = await pingServer({
        port: 3000,
        endpoint: "/api/health",
      });

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/api/health",
        {
          signal: expect.any(AbortSignal),
        },
      );
    });

    it("should return false when server responds with error status", async () => {
      fetchMock.mockResolvedValueOnce(new Response("Error", { status: 500 }));

      const result = await pingServer({
        port: 3000,
        endpoint: "/api/health",
      });

      expect(result).toBe(false);
    });

    it("should use custom host and protocol", async () => {
      fetchMock.mockResolvedValueOnce(new Response("OK", { status: 200 }));

      await pingServer({
        port: 8080,
        host: "example.com",
        protocol: "https",
        endpoint: "/health",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com:8080/health",
        {
          signal: expect.any(AbortSignal),
        },
      );
    });

    it("should use default endpoint when not provided", async () => {
      fetchMock.mockResolvedValueOnce(new Response("OK", { status: 200 }));

      await pingServer({
        port: 3000,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:3000/api/agents",
        {
          signal: expect.any(AbortSignal),
        },
      );
    });

    it("should handle request timeout", async () => {
      const abortError = new DOMException("Aborted", "AbortError");

      fetchMock.mockImplementationOnce(() => {
        return Promise.reject(abortError);
      });

      await expect(
        pingServer({
          port: 3000,
          requestTimeout: 50,
        }),
      ).rejects.toThrow();
    });
  });

  describe("waitForServerReady", () => {
    it("should resolve when server becomes ready", async () => {
      fetchMock.mockResolvedValueOnce(new Response("OK", { status: 200 }));

      await waitForServerReady({
        port: 3000,
        endpoint: "/api/health",
        maxWaitTime: 5000,
        pollInterval: 100,
      });

      expect(fetchMock).toHaveBeenCalled();
    });

    it("should handle abort signal timeout correctly", async () => {
      let abortSignal: AbortSignal | undefined;
      fetchMock.mockImplementationOnce((_url, options) => {
        abortSignal = options?.signal as AbortSignal;
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new DOMException("Aborted", "AbortError");
            reject(error);
          }, 50);
        });
      });

      await expect(
        waitForServerReady({
          port: 3000,
          maxWaitTime: 200,
          pollInterval: 50,
          requestTimeout: 30,
        }),
      ).rejects.toThrow();

      expect(abortSignal).toBeDefined();
    });

    it("should poll until server is ready", async () => {
      let callCount = 0;
      fetchMock.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.resolve(new Response("Not Ready", { status: 503 }));
        }
        return Promise.resolve(new Response("OK", { status: 200 }));
      });

      await waitForServerReady({
        port: 3000,
        maxWaitTime: 5000,
        pollInterval: 50,
```