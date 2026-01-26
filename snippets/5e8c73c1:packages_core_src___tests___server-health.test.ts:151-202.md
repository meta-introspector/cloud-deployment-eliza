# 5e8c73c1:packages_core_src___tests___server-health.test.ts:151-202

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/server-health.test.ts:151-202
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          maxWaitTime: 200,
          pollInterval: 50,
        })
      ).rejects.toThrow('Server failed to become ready');
    });

    it('should use custom options', async () => {
      fetchMock.mockResolvedValueOnce(new Response('OK', { status: 200 }));

      await waitForServerReady({
        port: 8080,
        host: 'example.com',
        protocol: 'https',
        endpoint: '/health',
        maxWaitTime: 10000,
        pollInterval: 200,
        requestTimeout: 3000,
      });

      expect(fetchMock).toHaveBeenCalledWith('https://example.com:8080/health', {
        signal: expect.any(AbortSignal),
      });
    });

    it('should wait for stabilization after server becomes ready', async () => {
      const startTime = Date.now();
      fetchMock.mockResolvedValueOnce(new Response('OK', { status: 200 }));

      await waitForServerReady({
        port: 3000,
        maxWaitTime: 5000,
        pollInterval: 100,
      });

      const elapsed = Date.now() - startTime;
      // Allow some tolerance for test execution time
      expect(elapsed).toBeGreaterThanOrEqual(900);
    });

    it('should handle network errors gracefully', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'));

      await expect(
        waitForServerReady({
          port: 3000,
          maxWaitTime: 200,
          pollInterval: 50,
        })
      ).rejects.toThrow();
    });
  });
});
```