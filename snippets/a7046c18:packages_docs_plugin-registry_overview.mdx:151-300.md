# a7046c18:packages_docs_plugin-registry_overview.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/overview.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  runtime: IAgentRuntime,
  message: Memory,
  state?: State,
  options?: { [key: string]: unknown },
  callback?: HandlerCallback,
  responses?: Memory[]
) => Promise<unknown>;
```

### Provider Interface
```typescript
export interface Provider {
  name: string;                         // Unique identifier
  description?: string;                 // What data it provides
  dynamic?: boolean;                    // Dynamic data source
  position?: number;                    // Execution order
  private?: boolean;                    // Hidden from provider list
  get: (runtime: IAgentRuntime, message: Memory, state: State) => Promise<ProviderResult>;
}

interface ProviderResult {
  values?: { [key: string]: any };
  data?: { [key: string]: any };
  text?: string;
}
```

### Evaluator Interface
```typescript
export interface Evaluator {
  alwaysRun?: boolean;                  // Run on every response
  description: string;                  // What it evaluates
  similes?: string[];                   // Alternative names
  examples: EvaluationExample[];        // Example evaluations
  handler: Handler;                     // Evaluation logic
  name: string;                         // Unique identifier
  validate: Validator;                  // Should evaluator run?
}
```

## 3. Plugin Initialization Lifecycle

Based on `/Users/studio/Documents/GitHub/eliza/packages/core/src/runtime.ts`, the initialization process:

1. **Plugin Registration** (`registerPlugin` method):
   - Validates plugin has a name
   - Checks for duplicate plugins
   - Adds to active plugins list
   - Calls plugin's `init()` method if present
   - Handles configuration errors gracefully

2. **Component Registration Order**:
   ```typescript
   // 1. Database adapter (if provided)
   if (plugin.adapter) {
     this.registerDatabaseAdapter(plugin.adapter);
   }
   
   // 2. Actions
   if (plugin.actions) {
     for (const action of plugin.actions) {
       this.registerAction(action);
     }
   }
   
   // 3. Evaluators
   if (plugin.evaluators) {
     for (const evaluator of plugin.evaluators) {
       this.registerEvaluator(evaluator);
     }
   }
   
   // 4. Providers
   if (plugin.providers) {
     for (const provider of plugin.providers) {
       this.registerProvider(provider);
     }
   }
   
   // 5. Models
   if (plugin.models) {
     for (const [modelType, handler] of Object.entries(plugin.models)) {
       this.registerModel(modelType, handler, plugin.name, plugin.priority);
     }
   }
   
   // 6. Routes
   if (plugin.routes) {
     for (const route of plugin.routes) {
       this.routes.push(route);
     }
   }
   
   // 7. Events
   if (plugin.events) {
     for (const [eventName, eventHandlers] of Object.entries(plugin.events)) {
       for (const eventHandler of eventHandlers) {
         this.registerEvent(eventName, eventHandler);
       }
     }
   }
   
   // 8. Services (delayed if runtime not initialized)
   if (plugin.services) {
     for (const service of plugin.services) {
       if (this.isInitialized) {
         await this.registerService(service);
       } else {
         this.servicesInitQueue.add(service);
       }
     }
   }
   ```

## 4. Service System Integration

From `/Users/studio/Documents/GitHub/eliza/packages/core/src/types/service.ts`:

### Service Abstract Class
```typescript
export abstract class Service {
  protected runtime!: IAgentRuntime;
  
  constructor(runtime?: IAgentRuntime) {
    if (runtime) {
      this.runtime = runtime;
    }
  }
  
  abstract stop(): Promise<void>;
  static serviceType: string;
  abstract capabilityDescription: string;
  config?: Metadata;
  
  static async start(_runtime: IAgentRuntime): Promise<Service> {
    throw new Error('Not implemented');
  }
}
```

### Service Types
The system includes predefined service types:
- TRANSCRIPTION, VIDEO, BROWSER, PDF
- REMOTE_FILES (AWS S3)
- WEB_SEARCH, EMAIL, TEE
- TASK, WALLET, LP_POOL, TOKEN_DATA
- DATABASE_MIGRATION
- PLUGIN_MANAGER, PLUGIN_CONFIGURATION, PLUGIN_USER_INTERACTION

## 5. Route Definitions for HTTP Endpoints
```