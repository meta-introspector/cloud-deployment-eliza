# 5e8c73c1:packages_core_src___tests___services-by-type.test.ts:151-209

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/services-by-type.test.ts:151-209
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

      // PDF type should have 1 service
      expect(allServices.get(ServiceType.PDF)).toHaveLength(1);
    });
  });

  describe('Service type validation', () => {
    it('should handle hasService correctly with multiple services', async () => {
      expect(runtime.hasService(ServiceType.WALLET)).toBe(false);

      await runtime.registerService(MockWalletService1);
      expect(runtime.hasService(ServiceType.WALLET)).toBe(true);

      await runtime.registerService(MockWalletService2);
      expect(runtime.hasService(ServiceType.WALLET)).toBe(true);
    });

    it('should return correct service types with getRegisteredServiceTypes', async () => {
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockPdfService);

      const serviceTypes = runtime.getRegisteredServiceTypes();
      expect(serviceTypes).toContain(ServiceType.WALLET);
      expect(serviceTypes).toContain(ServiceType.PDF);
      expect(serviceTypes).toHaveLength(2);
    });
  });

  describe('Service lifecycle', () => {
    it('should stop all services of all types', async () => {
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockWalletService2);
      await runtime.registerService(MockPdfService);

      // Mock the stop methods to track calls
      const stopCalls: string[] = [];

      const walletServices = runtime.getServicesByType(ServiceType.WALLET);
      const pdfServices = runtime.getServicesByType(ServiceType.PDF);

      walletServices[0].stop = async () => {
        stopCalls.push('wallet1');
      };
      walletServices[1].stop = async () => {
        stopCalls.push('wallet2');
      };
      pdfServices[0].stop = async () => {
        stopCalls.push('pdf');
      };

      await runtime.stop();

      expect(stopCalls).toContain('wallet1');
      expect(stopCalls).toContain('wallet2');
      expect(stopCalls).toContain('pdf');
      expect(stopCalls).toHaveLength(3);
    });
  });
});
```