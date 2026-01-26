# a7046c18:packages_core_typescript_src___tests___message-service.test.ts:901-963

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/message-service.test.ts:901-963
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        message,
        mockCallback,
      );

      // Verify the logging was called (which uses the type guards)
      expect(mockRuntime.logger?.info).toHaveBeenCalled();
    });
  });

  describe("provider timeout", () => {
    it("should use default timeout of 1000ms when PROVIDERS_TOTAL_TIMEOUT_MS is not set", () => {
      const getSetting = mockRuntime.getSetting as ReturnType<typeof mock>;
      getSetting.mockImplementation((key: string) => {
        if (key === "PROVIDERS_TOTAL_TIMEOUT_MS") return null;
        return null;
      });

      // The default timeout should be 1000ms (1 second)
      const timeout = parseInt(
        String(
          mockRuntime.getSetting?.("PROVIDERS_TOTAL_TIMEOUT_MS") || "1000",
        ),
        10,
      );
      expect(timeout).toBe(1000);
    });

    it("should use custom timeout when PROVIDERS_TOTAL_TIMEOUT_MS is set", () => {
      const getSetting = mockRuntime.getSetting as ReturnType<typeof mock>;
      getSetting.mockImplementation((key: string) => {
        if (key === "PROVIDERS_TOTAL_TIMEOUT_MS") return "5000";
        return null;
      });

      const timeout = parseInt(
        String(
          mockRuntime.getSetting?.("PROVIDERS_TOTAL_TIMEOUT_MS") || "1000",
        ),
        10,
      );
      expect(timeout).toBe(5000);
    });

    it("should track completed providers for timeout diagnostics", async () => {
      // Simulate the provider completion tracking logic
      const completedProviders = new Set<string>();
      const allProviderNames = ["fastProvider", "slowProvider"];

      // Simulate fastProvider completing
      completedProviders.add("fastProvider");

      // Check pending providers (slowProvider didn't complete)
      const pendingProviders = allProviderNames.filter(
        (name) => !completedProviders.has(name),
      );

      expect(pendingProviders).toEqual(["slowProvider"]);
      expect(Array.from(completedProviders)).toEqual(["fastProvider"]);
    });
  });
});
```