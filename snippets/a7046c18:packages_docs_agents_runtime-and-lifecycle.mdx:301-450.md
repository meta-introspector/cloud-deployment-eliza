# a7046c18:packages_docs_agents_runtime-and-lifecycle.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/runtime-and-lifecycle.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }
    
    return Array.from(resolved.values());
  }
  
  async registerPlugin(plugin: Plugin): Promise<void> {
    this.logger.info(`Registering plugin: ${plugin.name}`);
    
    // 1. Call plugin's init function
    if (plugin.init) {
      await plugin.init(plugin.config || {}, this);
    }
    
    // 2. Register services
    if (plugin.services) {
      for (const ServiceClass of plugin.services) {
        await this.registerService(ServiceClass);
      }
    }
    
    // 3. Register actions
    if (plugin.actions) {
      for (const action of plugin.actions) {
        this.registerAction(action);
      }
    }
    
    // 4. Register providers
    if (plugin.providers) {
      for (const provider of plugin.providers) {
        this.registerProvider(provider);
      }
    }
    
    // 5. Register evaluators
    if (plugin.evaluators) {
      for (const evaluator of plugin.evaluators) {
        this.registerEvaluator(evaluator);
      }
    }
    
    // 6. Register models
    if (plugin.models) {
      for (const [type, handler] of Object.entries(plugin.models)) {
        this.registerModel(type, handler, plugin.name, plugin.priority);
      }
    }
    
    this.plugins.push(plugin);
    this.logger.info(`Plugin ${plugin.name} registered successfully`);
  }
}
```

### Plugin Lifecycle Hooks

Plugins can hook into various lifecycle events:

```typescript
interface Plugin {
  // Initialization - called when plugin is loaded
  init?: (config: any, runtime: IAgentRuntime) => Promise<void>;
  
  // Start - called when runtime starts
  start?: (runtime: IAgentRuntime) => Promise<void>;
  
  // Stop - called when runtime stops
  stop?: (runtime: IAgentRuntime) => Promise<void>;
  
  // Message hooks
  beforeMessage?: (message: Memory, runtime: IAgentRuntime) => Promise<Memory>;
  afterMessage?: (message: Memory, response: Memory, runtime: IAgentRuntime) => Promise<void>;
  
  // Action hooks
  beforeAction?: (action: Action, message: Memory, runtime: IAgentRuntime) => Promise<boolean>;
  afterAction?: (action: Action, result: any, runtime: IAgentRuntime) => Promise<void>;
}

// Example plugin with lifecycle hooks
const lifecyclePlugin: Plugin = {
  name: 'lifecycle-example',
  
  async init(config, runtime) {
    console.log('Plugin initializing...');
    // Setup plugin resources
  },
  
  async start(runtime) {
    console.log('Plugin starting...');
    // Start background tasks
  },
  
  async stop(runtime) {
    console.log('Plugin stopping...');
    // Cleanup resources
  },
  
  async beforeMessage(message, runtime) {
    // Modify or validate message before processing
    return {
      ...message,
      metadata: {
        ...message.metadata,
        preprocessed: true
      }
    };
  },
  
  async afterMessage(message, response, runtime) {
    // Log, analyze, or store conversation
    await runtime.createMemory({
      content: {
        text: `Processed: ${message.content.text}`,
        metadata: { type: 'conversation_log' }
      }
    });
  }
};
```

## Component Orchestration

### Action Selection and Execution

How the runtime selects and executes actions:

```typescript
class ActionOrchestrator {
  async selectAction(
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ): Promise<Action | null> {
    // 1. Get all available actions
    const availableActions = runtime.actions;
    
    // 2. Validate which actions can handle this message
    const validActions = await Promise.all(
      availableActions.map(async action => {
        try {
          const isValid = await action.validate?.(runtime, message, state);
          return isValid ? action : null;
        } catch (error) {
          runtime.logger.error(`Validation error for ${action.name}:`, error);
          return null;
        }
      })
    );
    
    const candidates = validActions.filter(Boolean);
```