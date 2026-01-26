# feb2b8d1:packages_core_typescript_src_runtime.ts:301-450

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:301-450
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
            config[key] = String(value);
          }
        }
      }
      await plugin.init(config, this as IAgentRuntime);
      this.logger.debug(
        { src: "agent", agentId: this.agentId, plugin: plugin.name },
        "Plugin initialized",
      );
    }
    if (plugin.adapter) {
      this.logger.debug(
        { src: "agent", agentId: this.agentId, plugin: plugin.name },
        "Registering database adapter",
      );
      this.registerDatabaseAdapter(plugin.adapter);
    }
    if (plugin.actions) {
      for (const action of plugin.actions) {
        this.registerAction(action);
      }
    }
    if (plugin.evaluators) {
      for (const evaluator of plugin.evaluators) {
        this.registerEvaluator(evaluator);
      }
    }
    if (plugin.providers) {
      for (const provider of plugin.providers) {
        this.registerProvider(provider);
      }
    }
    if (plugin.models) {
      for (const [modelType, handler] of Object.entries(plugin.models)) {
        this.registerModel(
          modelType as ModelTypeName,
          handler as (params: unknown) => Promise<unknown>,
          plugin.name,
          plugin.priority,
        );
      }
    }
    if (plugin.routes) {
      for (const route of plugin.routes) {
        // namespace plugin name infront of paths
        const routePath = route.path.startsWith("/")
          ? route.path
          : `/${route.path}`;
        this.routes.push({ ...route, path: `/${plugin.name}${routePath}` });
      }
    }
    if (plugin.events) {
      for (const [eventName, eventHandlers] of Object.entries(plugin.events)) {
        for (const eventHandler of eventHandlers) {
          this.registerEvent(
            eventName,
            eventHandler as (params: unknown) => Promise<void>,
          );
        }
      }
    }
    if (plugin.services) {
      for (const service of plugin.services) {
        const serviceType = service.serviceType as ServiceTypeName;

        this.logger.debug(
          {
            src: "agent",
            agentId: this.agentId,
            plugin: plugin.name,
            serviceType,
          },
          "Registering service",
        );

        // ensure we have a promise, so when it's actually loaded via registerService,
        // we can trigger the loading of service dependencies
        if (!this.servicePromises.has(serviceType)) {
          this._createServiceResolver(serviceType);
        }

        // Track service registration status
        this.serviceRegistrationStatus.set(serviceType, "pending");

        // Register service asynchronously; handle errors without rethrowing since
        // we are not awaiting this promise here (to avoid unhandled rejections)
        this.registerService(service).catch((error) => {
          this.logger.error(
            {
              src: "agent",
              agentId: this.agentId,
              plugin: plugin.name,
              serviceType,
              error: error instanceof Error ? error.message : String(error),
            },
            "Service registration failed",
          );

          // Reject the service promise so waiting consumers know about the failure
          const handler = this.servicePromiseHandlers.get(serviceType);
          if (handler) {
            const serviceError = new Error(
              `Service ${serviceType} from plugin ${plugin.name} failed to register: ${error instanceof Error ? error.message : String(error)}`,
            );
            handler.reject(serviceError);
            // Clean up the promise handles
            this.servicePromiseHandlers.delete(serviceType);
            this.servicePromises.delete(serviceType);
          }
          // Update service status
          this.serviceRegistrationStatus.set(serviceType, "failed");
          // Do not rethrow; error is propagated via promise rejection and status update
        });
      }
    }
  }

  getAllServices(): Map<ServiceTypeName, Service[]> {
    return this.services;
  }

  async stop() {
    this.logger.debug(
      { src: "agent", agentId: this.agentId },
      "Stopping runtime",
    );
    for (const [serviceType, services] of this.services) {
      this.logger.debug(
        { src: "agent", agentId: this.agentId, serviceType },
        "Stopping service",
      );
      for (const service of services) {
        await service.stop();
      }
    }

    this.elizaOS = undefined;
  }

  async initialize(options?: { skipMigrations?: boolean }): Promise<void> {
    const pluginRegistrationPromises: Promise<void>[] = [];

    // The resolution is now expected to happen in the CLI layer (e.g., startAgent)
    // The runtime now accepts a pre-resolved, ordered list of plugins.
    const pluginsToLoad = this.characterPlugins;

    for (const plugin of pluginsToLoad) {
      if (plugin) {
        pluginRegistrationPromises.push(this.registerPlugin(plugin));
      }
```