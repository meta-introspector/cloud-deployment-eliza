# a7046c18:packages_core_typescript_src___tests___server-health.test.ts:151-216

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/server-health.test.ts:151-216
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      });

      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("should throw error when server does not become ready within maxWaitTime", async () => {
      fetchMock.mockResolvedValue(new Response("Not Ready", { status: 503 }));

      await expect(
        waitForServerReady({
          port: 3000,
          maxWaitTime: 200,
          pollInterval: 50,
        }),
      ).rejects.toThrow("Server failed to become ready");
    });

    it("should use custom options", async () => {
      fetchMock.mockResolvedValueOnce(new Response("OK", { status: 200 }));

      await waitForServerReady({
        port: 8080,
        host: "example.com",
        protocol: "https",
        endpoint: "/health",
        maxWaitTime: 10000,
        pollInterval: 200,
        requestTimeout: 3000,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com:8080/health",
        {
          signal: expect.any(AbortSignal),
        },
      );
    });

    it("should wait for stabilization after server becomes ready", async () => {
      const startTime = Date.now();
      fetchMock.mockResolvedValueOnce(new Response("OK", { status: 200 }));

      await waitForServerReady({
        port: 3000,
        maxWaitTime: 5000,
        pollInterval: 100,
      });

      const elapsed = Date.now() - startTime;
      // Allow some tolerance for test execution time
      expect(elapsed).toBeGreaterThanOrEqual(900);
    });

    it("should handle network errors gracefully", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));

      await expect(
        waitForServerReady({
          port: 3000,
          maxWaitTime: 200,
          pollInterval: 50,
        }),
      ).rejects.toThrow();
    });
  });
});
```