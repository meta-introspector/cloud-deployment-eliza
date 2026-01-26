# 5e8c73c1:packages_core_src_runtime.ts:1951-2100

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:1951-2100
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
      this.logger.debug(
        { src: 'agent', agentId: this.agentId, serviceType },
        'Service has no promise handler'
      );
    }

    if (serviceDef.registerSendHandlers) {
      (serviceDef.constructor as typeof Service).registerSendHandlers?.(
        this as IAgentRuntime,
        serviceInstance
      );
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

  registerModel(
    modelType: ModelTypeName | string,
    handler: (runtime: IAgentRuntime, params: Record<string, unknown>) => Promise<unknown>,
    provider: string,
    priority?: number
  ): void {
    const modelKey = typeof modelType === 'string' ? modelType : ModelType[modelType];
    if (!this.models.has(modelKey)) {
      this.models.set(modelKey, []);
    }

    const registrationOrder = Date.now();
    this.models.get(modelKey)?.push({
      handler,
      provider,
      priority: priority || 0,
      registrationOrder,
    });
    this.models.get(modelKey)?.sort((a, b) => {
      if ((b.priority || 0) !== (a.priority || 0)) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return (a.registrationOrder || 0) - (b.registrationOrder || 0);
    });
  }

  getModel(
    modelType: ModelTypeName | string
  ): ((runtime: IAgentRuntime, params: Record<string, unknown>) => Promise<unknown>) | undefined {
    const modelKey = typeof modelType === 'string' ? modelType : ModelType[modelType];
    const models = this.models.get(modelKey);
    if (!models?.length) {
      return undefined;
    }

    // Return highest priority handler (first in array after sorting)
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, model: modelKey, provider: models[0].provider },
      'Using model'
    );
    return models[0].handler;
  }

  /**
   * Retrieves model configuration settings from character settings with support for
   * model-specific overrides and default fallbacks.
   *
   * Precedence order (highest to lowest):
   * 1. Model-specific settings (e.g., TEXT_SMALL_TEMPERATURE)
   * 2. Default settings (e.g., DEFAULT_TEMPERATURE)
   * 3. Legacy settings for backwards compatibility (e.g., MODEL_TEMPERATURE)
   *
   * @param modelType The specific model type to get settings for
   * @returns Object containing model parameters if they exist, or null if no settings are configured
   */
  private getModelSettings(modelType?: ModelTypeName): Record<string, number> | null {
    const modelSettings: Record<string, number> = {};

    // Helper to get a setting value with fallback chain
    const getSettingWithFallback = (
      param:
        | 'MAX_TOKENS'
        | 'TEMPERATURE'
        | 'TOP_P'
        | 'TOP_K'
        | 'MIN_P'
        | 'SEED'
        | 'REPETITION_PENALTY'
        | 'FREQUENCY_PENALTY'
        | 'PRESENCE_PENALTY',
      legacyKey?: string
    ): number | null => {
      // Try model-specific setting first
      if (modelType) {
```