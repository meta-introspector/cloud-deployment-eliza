# 5e8c73c1:packages_core_src_runtime.ts:1801-1950

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:1801-1950
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
  getTypedService<T extends Service = Service>(serviceName: ServiceTypeName | string): T | null {
    return this.getService<T>(serviceName);
  }

  /**
   * Get all services of a specific type
   * @template T - The expected service class type
   * @param serviceName - The service type name
   * @returns Array of service instances with proper typing
   */
  getServicesByType<T extends Service = Service>(serviceName: ServiceTypeName | string): T[] {
    const serviceInstances = this.services.get(serviceName as ServiceTypeName);
    if (!serviceInstances || serviceInstances.length === 0) {
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, serviceName },
        'No services found for type'
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
    serviceType: ServiceTypeName | string
  ): 'pending' | 'registering' | 'registered' | 'failed' | 'unknown' {
    return this.serviceRegistrationStatus.get(serviceType as ServiceTypeName) || 'unknown';
  }

  /**
   * Get service health information
   * @returns Object containing service health status
   */
  getServiceHealth(): Record<
    string,
    {
      status: 'pending' | 'registering' | 'registered' | 'failed' | 'unknown';
      instances: number;
      hasPromise: boolean;
    }
  > {
    const health: Record<
      string,
      {
        status: 'pending' | 'registering' | 'registered' | 'failed' | 'unknown';
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
    const serviceName = serviceDef.name || 'Unknown';

    if (!serviceType) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId, serviceName },
        'Service missing serviceType property'
      );
      return;
    }
    this.logger.debug({ src: 'agent', agentId: this.agentId, serviceType }, 'Registering service');

    // Update service status to registering
    this.serviceRegistrationStatus.set(serviceType, 'registering');

    // ALL services wait for initialization to complete with a timeout to prevent hanging
    // This ensures services start after all plugins are registered and runtime is ready
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, serviceType },
      'Service waiting for init'
    );

    // Add timeout protection to prevent indefinite hangs
    const initTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Service ${serviceType} registration timed out waiting for runtime initialization (30s timeout)`
          )
        );
      }, 30000); // 30 second timeout
    });

    await Promise.race([this.initPromise, initTimeout]);

    // Check if service has a start method
    if (typeof serviceDef.start !== 'function') {
      throw new Error(
        `Service ${serviceType} does not have a static start method. All services must implement static async start(runtime: IAgentRuntime): Promise<Service>.`
      );
    }
    const serviceInstance = await serviceDef.start(this as IAgentRuntime);

```