# a7046c18:packages_core_typescript_src_runtime.ts:1951-2100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:1951-2100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const newState = {
      values: {
        ...aggregatedStateValues,
        providers: providersText,
      },
      data: {
        ...(cachedState.data || {}),
        providers: currentProviderResults,
      },
      text: providersText,
    } as State;
    if (message.id) {
      this.stateCache.set(message.id, newState);
    }
    return newState;
  }

  getService<T extends Service = Service>(
    serviceName: ServiceTypeName | string,
  ): T | null {
    const serviceInstances = this.services.get(serviceName as ServiceTypeName);
    if (!serviceInstances || serviceInstances.length === 0) {
      // it's not a warn, a plugin might just not be installed
      this.logger.debug(
        { src: "agent", agentId: this.agentId, serviceName },
        "Service not found",
      );
      return null;
    }
    return serviceInstances[0] as T;
  }

  /**
   * Type-safe service getter that ensures the correct service type is returned
   * @template T - The expected service class type
   * @param serviceName - The service type name
   * @returns The service instance with proper typing, or null if not found
   */
  getTypedService<T extends Service = Service>(
    serviceName: ServiceTypeName | string,
  ): T | null {
    return this.getService<T>(serviceName);
  }

  /**
   * Get all services of a specific type
   * @template T - The expected service class type
   * @param serviceName - The service type name
   * @returns Array of service instances with proper typing
   */
  getServicesByType<T extends Service = Service>(
    serviceName: ServiceTypeName | string,
  ): T[] {
    const serviceInstances = this.services.get(serviceName as ServiceTypeName);
    if (!serviceInstances || serviceInstances.length === 0) {
      this.logger.debug(
        { src: "agent", agentId: this.agentId, serviceName },
        "No services found for type",
      );
      return [];
    }
    return serviceInstances as T[];
  }

  /**
   * Get all registered service types
   * @returns Array of registered service type names
   */
  getRegisteredServiceTypes(): ServiceTypeName[] {
    return Array.from(this.services.keys());
  }

  /**
   * Check if a service type is registered
   * @param serviceType - The service type to check
   * @returns true if the service is registered
   */
  hasService(serviceType: ServiceTypeName | string): boolean {
    const serviceInstances = this.services.get(serviceType as ServiceTypeName);
    return serviceInstances !== undefined && serviceInstances.length > 0;
  }

  /**
   * Get the registration status of a service
   * @param serviceType - The service type to check
   * @returns the current registration status
   */
  getServiceRegistrationStatus(
    serviceType: ServiceTypeName | string,
  ): "pending" | "registering" | "registered" | "failed" | "unknown" {
    return (
      this.serviceRegistrationStatus.get(serviceType as ServiceTypeName) ||
      "unknown"
    );
  }

  /**
   * Get service health information
   * @returns Object containing service health status
   */
  getServiceHealth(): Record<
    string,
    {
      status: "pending" | "registering" | "registered" | "failed" | "unknown";
      instances: number;
      hasPromise: boolean;
    }
  > {
    const health: Record<
      string,
      {
        status: "pending" | "registering" | "registered" | "failed" | "unknown";
        instances: number;
        hasPromise: boolean;
      }
    > = {};

    // Check all registered services
    for (const [serviceType, instances] of this.services) {
      health[serviceType] = {
        status: this.getServiceRegistrationStatus(serviceType),
        instances: instances.length,
        hasPromise: this.servicePromises.has(serviceType),
      };
    }

    // Check services that have registration status but no instances yet
    for (const [serviceType, status] of this.serviceRegistrationStatus) {
      if (!health[serviceType]) {
        health[serviceType] = {
          status,
          instances: 0,
          hasPromise: this.servicePromises.has(serviceType),
        };
      }
    }

    return health;
  }

  async registerService(serviceDef: typeof Service): Promise<void> {
    const serviceType = serviceDef.serviceType as ServiceTypeName;
    const serviceName = serviceDef.name || "Unknown";

    if (!serviceType) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId, serviceName },
        "Service missing serviceType property",
      );
      return;
```