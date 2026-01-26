# a69475c0:packages_core_src_runtime.ts:1651-1800

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:1651-1800
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    if (filterList && filterList.length > 0) {
      filterList.forEach((name) => providerNames.add(name));
    } else {
      this.providers
        .filter((p) => !p.private && !p.dynamic)
        .forEach((p) => providerNames.add(p.name));
    }
    if (!filterList && includeList && includeList.length > 0) {
      includeList.forEach((name) => providerNames.add(name));
    }
    const providersToGet = Array.from(
      new Set(this.providers.filter((p) => providerNames.has(p.name)))
    ).sort((a, b) => (a.position || 0) - (b.position || 0));
    const providerData = await Promise.all(
      providersToGet.map(async (provider) => {
        const start = Date.now();
        const result = await provider.get(this as IAgentRuntime, message, cachedState);
        const duration = Date.now() - start;

        // only need to inform if it's taking a long time
        if (duration > 100) {
          this.logger.debug(
            { src: 'agent', agentId: this.agentId, provider: provider.name, duration },
            'Slow provider'
          );
        }
        return {
          ...result,
          providerName: provider.name,
        };
      })
    );
    const currentProviderResults: Record<string, { text?: string; values?: Record<string, unknown>; providerName: string }> = { ...(cachedState.data?.providers as Record<string, { text?: string; values?: Record<string, unknown>; providerName: string }> || {}) };
    for (const freshResult of providerData) {
      currentProviderResults[freshResult.providerName] = freshResult;
    }
    const orderedTexts: string[] = [];
    for (const provider of providersToGet) {
      const result = currentProviderResults[provider.name];
      if (result && result.text && typeof result.text === 'string' && result.text.trim() !== '') {
        orderedTexts.push(result.text);
      }
    }
    const providersText = orderedTexts.join('\n');
    const aggregatedStateValues: Record<string, unknown> = { ...(cachedState.values || {}) };
    for (const provider of providersToGet) {
      const providerResult = currentProviderResults[provider.name];
      if (providerResult && providerResult.values && typeof providerResult.values === 'object' && providerResult.values !== null) {
        Object.assign(aggregatedStateValues, providerResult.values);
      }
    }
    for (const providerName in currentProviderResults) {
      if (!providersToGet.some((p) => p.name === providerName)) {
        const providerResult = currentProviderResults[providerName];
        if (providerResult && providerResult.values && typeof providerResult.values === 'object' && providerResult.values !== null) {
          Object.assign(aggregatedStateValues, providerResult.values);
        }
      }
    }
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

  getService<T extends Service = Service>(serviceName: ServiceTypeName | string): T | null {
    const serviceInstances = this.services.get(serviceName as ServiceTypeName);
    if (!serviceInstances || serviceInstances.length === 0) {
      // it's not a warn, a plugin might just not be installed
      this.logger.debug({ src: 'agent', agentId: this.agentId, serviceName }, 'Service not found');
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
```