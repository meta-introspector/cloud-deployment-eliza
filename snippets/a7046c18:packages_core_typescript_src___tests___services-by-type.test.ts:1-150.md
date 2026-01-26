# a7046c18:packages_core_typescript_src___tests___services-by-type.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/services-by-type.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { AgentRuntime } from "../runtime";
import { ServiceType, type UUID } from "../types";
import type { IAgentRuntime } from "../types/runtime";
import { Service } from "../types/service";

// Mock service classes for testing
class MockWalletService1 extends Service {
  static override readonly serviceType = ServiceType.WALLET;
  readonly capabilityDescription = "Mock wallet service 1";

  static async start(runtime: IAgentRuntime): Promise<MockWalletService1> {
    return new MockWalletService1(runtime);
  }

  async stop(): Promise<void> {
    // Mock stop implementation
  }
}

class MockWalletService2 extends Service {
  static override readonly serviceType = ServiceType.WALLET;
  readonly capabilityDescription = "Mock wallet service 2";

  static async start(runtime: IAgentRuntime): Promise<MockWalletService2> {
    return new MockWalletService2(runtime);
  }

  async stop(): Promise<void> {
    // Mock stop implementation
  }
}

class MockPdfService extends Service {
  static override readonly serviceType = ServiceType.PDF;
  readonly capabilityDescription = "Mock PDF service";

  static async start(runtime: IAgentRuntime): Promise<MockPdfService> {
    return new MockPdfService(runtime);
  }

  async stop(): Promise<void> {
    // Mock stop implementation
  }
}

describe("Service Type System", () => {
  let runtime: AgentRuntime;

  beforeEach(async () => {
    runtime = new AgentRuntime({
      agentId: uuidv4() as UUID,
      character: {
        name: "Test Agent",
        username: "test",
        clients: [],
      },
    });
    // Resolve initPromise directly since these tests don't require DB setup
    // Access private resolver for test purposes
    const resolver = (
      runtime as AgentRuntime & { initResolver?: (() => void) | undefined }
    ).initResolver;
    if (resolver) resolver();
  });

  describe("Multiple services of same type", () => {
    it("should allow registering multiple services of the same type", async () => {
      // Register two wallet services
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockWalletService2);

      // Both should be registered
      expect(runtime.hasService(ServiceType.WALLET)).toBe(true);

      // Get all wallet services
      const walletServices = runtime.getServicesByType(ServiceType.WALLET);
      expect(walletServices).toHaveLength(2);

      // Check that both service instances are different
      expect(walletServices[0]).toBeInstanceOf(MockWalletService1);
      expect(walletServices[1]).toBeInstanceOf(MockWalletService2);
    });

    it("should return first service when using getService", async () => {
      // Register two wallet services
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockWalletService2);

      // getService should return the first registered service
      const firstService = runtime.getService(ServiceType.WALLET);
      expect(firstService).toBeInstanceOf(MockWalletService1);
    });

    it("should return empty array for non-existent service type", () => {
      const services = runtime.getServicesByType("non-existent-type");
      expect(services).toHaveLength(0);
    });

    it("should return null for non-existent service type with getService", () => {
      const service = runtime.getService("non-existent-type");
      expect(service).toBe(null);
    });
  });

  describe("Mixed service types", () => {
    it("should handle multiple service types correctly", async () => {
      // Register services of different types
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockWalletService2);
      await runtime.registerService(MockPdfService);

      // Check wallet services
      const walletServices = runtime.getServicesByType(ServiceType.WALLET);
      expect(walletServices).toHaveLength(2);

      // Check PDF services
      const pdfServices = runtime.getServicesByType(ServiceType.PDF);
      expect(pdfServices).toHaveLength(1);
      expect(pdfServices[0]).toBeInstanceOf(MockPdfService);

      // Check non-existent service type
      const videoServices = runtime.getServicesByType(ServiceType.VIDEO);
      expect(videoServices).toHaveLength(0);
    });

    it("should return correct services with getAllServices", async () => {
      await runtime.registerService(MockWalletService1);
      await runtime.registerService(MockWalletService2);
      await runtime.registerService(MockPdfService);

      const allServices = runtime.getAllServices();

      // Should have 2 service types
      expect(allServices.size).toBe(2);

      // Wallet type should have 2 services
      expect(allServices.get(ServiceType.WALLET)).toHaveLength(2);

      // PDF type should have 1 service
      expect(allServices.get(ServiceType.PDF)).toHaveLength(1);
    });
  });

  describe("Service type validation", () => {
    it("should handle hasService correctly with multiple services", async () => {
      expect(runtime.hasService(ServiceType.WALLET)).toBe(false);

      await runtime.registerService(MockWalletService1);
```