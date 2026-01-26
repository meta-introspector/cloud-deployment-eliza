# a7046c18:packages_ts-plugin-starter_src___tests___plugin.test.ts:601-660

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/plugin.test.ts:601-660
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const service = await StarterService.start(runtime);
    expect(service).toBeInstanceOf(StarterService);
    expect(logger.info).toHaveBeenCalled();
  });

  it("should have correct service type", () => {
    expect(StarterService.serviceType).toBe("starter");
  });

  it("should stop service correctly", async () => {
    // Start service
    const service = await StarterService.start(runtime);

    // Create a new runtime with the service registered
    const runtimeWithService = createMockRuntime({
      getService: () => service as Service,
    });

    // Stop service
    await StarterService.stop(runtimeWithService);
    expect(logger.info).toHaveBeenCalled();
  });

  it("should throw error when stopping non-existent service", async () => {
    const emptyRuntime = createMockRuntime({
      getService: () => null,
    });

    await expect(StarterService.stop(emptyRuntime)).rejects.toThrow(
      "Starter service not found",
    );
  });

  it("should handle multiple start/stop cycles", async () => {
    // First cycle
    const service1 = await StarterService.start(runtime);
    expect(service1).toBeInstanceOf(StarterService);

    const runtimeWithService1 = createMockRuntime({
      getService: () => service1 as any,
    });
    await StarterService.stop(runtimeWithService1);

    // Second cycle
    const service2 = await StarterService.start(runtime);
    expect(service2).toBeInstanceOf(StarterService);

    const runtimeWithService2 = createMockRuntime({
      getService: () => service2 as any,
    });
    await StarterService.stop(runtimeWithService2);
  });

  it("should provide capability description", async () => {
    const service = await StarterService.start(runtime);
    expect(service.capabilityDescription).toBe(
      "This is a starter service which is attached to the agent through the starter plugin.",
    );
  });
});
```