# a7046c18:packages_core_typescript_src___tests___services-by-type.test.ts:151-198

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/services-by-type.test.ts:151-198
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(runtime.hasService(ServiceType.WALLET)).toBe(true);

      await runtime.registerService(MockWalletService2);
      expect(runtime.hasService(ServiceType.WALLET)).toBe(true);
    });

    it("should return correct service types with getRegisteredServiceTypes", async () => {
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockPdfService);

      const serviceTypes = runtime.getRegisteredServiceTypes();
      expect(serviceTypes).toContain(ServiceType.WALLET);
      expect(serviceTypes).toContain(ServiceType.PDF);
      expect(serviceTypes).toHaveLength(2);
    });
  });

  describe("Service lifecycle", () => {
    it("should stop all services of all types", async () => {
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockWalletService2);
      await runtime.registerService(MockPdfService);

      // Mock the stop methods to track calls
      const stopCalls: string[] = [];

      const walletServices = runtime.getServicesByType(ServiceType.WALLET);
      const pdfServices = runtime.getServicesByType(ServiceType.PDF);

      walletServices[0].stop = async () => {
        stopCalls.push("wallet1");
      };
      walletServices[1].stop = async () => {
        stopCalls.push("wallet2");
      };
      pdfServices[0].stop = async () => {
        stopCalls.push("pdf");
      };

      await runtime.stop();

      expect(stopCalls).toContain("wallet1");
      expect(stopCalls).toContain("wallet2");
      expect(stopCalls).toContain("pdf");
      expect(stopCalls).toHaveLength(3);
    });
  });
});
```