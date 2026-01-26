# a7046c18:packages_docs_agents_runtime-and-lifecycle.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/runtime-and-lifecycle.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```typescript
export class AgentRuntime implements IAgentRuntime {
  readonly agentId: UUID;
  readonly character: Character;
  public adapter!: IDatabaseAdapter;
  readonly actions: Action[] = [];
  readonly evaluators: Evaluator[] = [];
  readonly providers: Provider[] = [];
  readonly plugins: Plugin[] = [];
  services = new Map<ServiceTypeName, Service[]>();
  models = new Map<string, ModelHandler[]>();
  
  constructor(opts: {
    character: Character;
    adapter?: IDatabaseAdapter;
    plugins?: Plugin[];
    settings?: RuntimeSettings;
  }) {
    this.agentId = opts.character.id || stringToUuid(opts.character.name);
    this.character = opts.character;
    
    if (opts.adapter) {
      this.registerDatabaseAdapter(opts.adapter);
    }
    
    this.characterPlugins = opts.plugins || [];
    this.settings = opts.settings || {};
    
    this.logger = createLogger({
      namespace: this.character.name
    });
  }
  
  async initialize(): Promise<void> {
    this.logger.info('Initializing AgentRuntime...');
    
    // 1. Connect to database
    await this.adapter.init();
    
    // 2. Resolve and load plugins
    await this.loadPlugins();
    
    // 3. Start services
    await this.startServices();
    
    // 4. Initialize providers
    await this.initializeProviders();
    
    // 5. Set agent status
    await this.updateAgentStatus(AgentStatus.ACTIVE);
    
    this.isInitialized = true;
    this.logger.info('AgentRuntime initialized successfully');
  }
}
```

### Component Management

How the runtime manages different component types:

```typescript
class AgentRuntime {
  // Action registration and management
  registerAction(action: Action): void {
    if (this.actions.find(a => a.name === action.name)) {
      throw new Error(`Action ${action.name} already registered`);
    }
    
    this.actions.push(action);
    this.logger.debug(`Registered action: ${action.name}`);
  }
  
  // Provider registration and management
  registerProvider(provider: Provider): void {
    if (this.providers.find(p => p.name === provider.name)) {
      throw new Error(`Provider ${provider.name} already registered`);
    }
    
    this.providers.push(provider);
    this.logger.debug(`Registered provider: ${provider.name}`);
  }
  
  // Service registration and lifecycle
  async registerService(ServiceClass: typeof Service): Promise<Service> {
    const serviceName = ServiceClass.serviceType;
    
    // Check if already registered
    if (this.services.has(serviceName)) {
      return this.services.get(serviceName)[0];
    }
    
    // Create and start service
    const service = new ServiceClass(this);
    await service.start();
    
    this.services.set(serviceName, [service]);
    this.logger.info(`Service ${serviceName} started`);
    
    return service;
  }
  
  // Get a registered service
  getService<T extends Service>(name: ServiceTypeName): T | null {
    const services = this.services.get(name);
    return services?.[0] as T || null;
  }
}
```

## Plugin Integration

### Plugin Loading Process

The complete plugin loading lifecycle:

```typescript
class AgentRuntime {
  private async loadPlugins(): Promise<void> {
    // 1. Resolve all plugin dependencies
    const pluginsToLoad = await this.resolvePluginDependencies(this.characterPlugins);
    
    // 2. Sort plugins by dependency order
    const sortedPlugins = this.topologicalSort(pluginsToLoad);
    
    // 3. Load each plugin in order
    for (const plugin of sortedPlugins) {
      await this.registerPlugin(plugin);
    }
  }
  
  private async resolvePluginDependencies(plugins: Plugin[]): Promise<Plugin[]> {
    const resolved = new Map<string, Plugin>();
    const queue = [...plugins];
    
    while (queue.length > 0) {
      const plugin = queue.shift()!;
      
      if (resolved.has(plugin.name)) continue;
      resolved.set(plugin.name, plugin);
      
      // Add dependencies to queue
      if (plugin.dependencies) {
        for (const depName of plugin.dependencies) {
          const dep = this.allAvailablePlugins.get(depName);
          if (dep && !resolved.has(depName)) {
            queue.push(dep);
          }
        }
      }
```