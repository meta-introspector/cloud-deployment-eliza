# a69475c0:packages_core_src_runtime.ts:1801-1950

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:1801-1950
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
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

    if (!serviceInstance) {
      throw new Error(
        `Service ${serviceType}  start() method returned null or undefined. It must return a Service instance.`
      );
    }

    // Initialize arrays if they don't exist
    if (!this.services.has(serviceType)) {
      this.services.set(serviceType, []);
    }
    if (!this.serviceTypes.has(serviceType)) {
      this.serviceTypes.set(serviceType, []);
    }

    // Add the service to the arrays
    this.services.get(serviceType)!.push(serviceInstance);
    this.serviceTypes.get(serviceType)!.push(serviceDef);

    // inform everyone that's waiting for this service, that it's now available
    // removes the need for polling and timers
    const handler = this.servicePromiseHandlers.get(serviceType);
    if (handler) {
      handler.resolve(serviceInstance);
      // Clean up the promise handler after resolving
      this.servicePromiseHandlers.delete(serviceType);
    } else {
      this.logger.debug({ src: 'agent', agentId: this.agentId, serviceType }, 'Service has no promise handler');
    }

    if (serviceDef.registerSendHandlers) {
      (serviceDef.constructor as typeof Service).registerSendHandlers?.(this as IAgentRuntime, serviceInstance);
    }
    // Update service status to registered
    this.serviceRegistrationStatus.set(serviceType, 'registered');

    this.logger.debug({ src: 'agent', agentId: this.agentId, serviceType }, 'Service registered');
  }

  /// ensures servicePromises & servicePromiseHandlers for a serviceType
  private _createServiceResolver(serviceType: ServiceTypeName) {
    let resolver: ServiceResolver | undefined;
    let rejecter: ServiceRejecter | undefined;
    this.servicePromises.set(
      serviceType,
      new Promise<Service>((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      })
    );
    if (!resolver) {
      throw new Error(`Failed to create resolver for service ${serviceType}`);
    }
    if (!rejecter) {
      throw new Error(`Failed to create rejecter for service ${serviceType}`);
    }
    this.servicePromiseHandlers.set(serviceType, { resolve: resolver, reject: rejecter });
    return this.servicePromises.get(serviceType)!;
  }

  /// returns a promise that's resolved once this service is loaded
  getServiceLoadPromise(serviceType: ServiceTypeName): Promise<Service> {
    // if this.isInitialized then the this p will exist and already be resolved
    let p = this.servicePromises.get(serviceType);
    if (!p) {
      // not initialized or registered yet, registerPlugin is already smart enough to check to see if we make it here
      p = this._createServiceResolver(serviceType);
    }
    return p;
  }
```