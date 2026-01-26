# a7046c18:packages_docs_agents_runtime-and-lifecycle.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/runtime-and-lifecycle.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    // Filter evaluators that should run
    const evaluatorsToRun = runtime.evaluators.filter(evaluator => {
      // Always run if marked as alwaysRun
      if (evaluator.alwaysRun) return true;
      
      // Run if agent responded
      if (response) return true;
      
      // Check custom conditions
      return evaluator.shouldRun?.(message, state);
    });
    
    // Run evaluators in parallel
    const evaluationPromises = evaluatorsToRun.map(async evaluator => {
      try {
        const result = await evaluator.handler(
          runtime,
          message,
          state,
          {},
          () => {},  // Callback
          [response]  // Response array
        );
        
        return { name: evaluator.name, result };
      } catch (error) {
        runtime.logger.error(`Evaluator ${evaluator.name} failed:`, error);
        return { name: evaluator.name, error };
      }
    });
    
    const evaluations = await Promise.all(evaluationPromises);
    
    // Process results
    for (const evaluation of evaluations) {
      if (evaluation.error) {
        results[evaluation.name] = { success: false, error: evaluation.error };
      } else {
        results[evaluation.name] = { success: true, data: evaluation.result };
      }
    }
    
    // Store evaluation results
    await this.storeEvaluations(runtime, message, response, results);
    
    return results;
  }
}
```

## Service Management

### Service Registration

Services are long-running components:

```typescript
abstract class Service {
  static serviceType: ServiceTypeName;
  status: ServiceStatus = ServiceStatus.STOPPED;
  runtime: IAgentRuntime;
  
  constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
  }
  
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}

// Example service implementation
class WebSocketService extends Service {
  static serviceType = 'websocket' as ServiceTypeName;
  private ws: WebSocket | null = null;
  
  async start(): Promise<void> {
    this.ws = new WebSocket(this.runtime.getSetting('WS_URL'));
    
    this.ws.on('open', () => {
      this.status = ServiceStatus.RUNNING;
      this.runtime.logger.info('WebSocket connected');
    });
    
    this.ws.on('message', async (data) => {
      await this.handleMessage(data);
    });
    
    this.ws.on('error', (error) => {
      this.runtime.logger.error('WebSocket error:', error);
      this.status = ServiceStatus.ERROR;
    });
  }
  
  async stop(): Promise<void> {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.status = ServiceStatus.STOPPED;
  }
  
  private async handleMessage(data: any) {
    // Process incoming websocket messages
    const message = JSON.parse(data);
    await this.runtime.processMessage(message);
  }
}
```

### Service Lifecycle

Managing service dependencies and lifecycle:

```typescript
class ServiceManager {
  private services = new Map<ServiceTypeName, Service>();
  private startOrder: ServiceTypeName[] = [];
  
  async startServices(runtime: IAgentRuntime): Promise<void> {
    // Determine start order based on dependencies
    this.startOrder = this.resolveServiceDependencies();
    
    for (const serviceName of this.startOrder) {
      const ServiceClass = this.getServiceClass(serviceName);
      if (!ServiceClass) continue;
      
      try {
        const service = new ServiceClass(runtime);
        await service.start();
        this.services.set(serviceName, service);
        runtime.logger.info(`Service ${serviceName} started`);
      } catch (error) {
        runtime.logger.error(`Failed to start service ${serviceName}:`, error);
        // Decide whether to continue or abort
        if (this.isRequiredService(serviceName)) {
          throw error;
        }
      }
    }
  }
  
  async stopServices(runtime: IAgentRuntime): Promise<void> {
    // Stop in reverse order
    const stopOrder = [...this.startOrder].reverse();
    
    for (const serviceName of stopOrder) {
      const service = this.services.get(serviceName);
      if (!service) continue;
      
```