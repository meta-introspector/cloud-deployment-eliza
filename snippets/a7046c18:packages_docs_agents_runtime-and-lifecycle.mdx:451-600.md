# a7046c18:packages_docs_agents_runtime-and-lifecycle.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/runtime-and-lifecycle.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    if (candidates.length === 0) return null;
    
    // 3. Use LLM to select best action
    const selectedAction = await this.selectWithLLM(
      runtime,
      candidates,
      message,
      state
    );
    
    return selectedAction;
  }
  
  async executeAction(
    runtime: IAgentRuntime,
    action: Action,
    message: Memory,
    state: State
  ): Promise<ActionResult> {
    const startTime = Date.now();
    
    try {
      // Pre-execution hook
      if (runtime.currentPlugin?.beforeAction) {
        const shouldContinue = await runtime.currentPlugin.beforeAction(
          action,
          message,
          runtime
        );
        if (!shouldContinue) {
          return { success: false, reason: 'Blocked by plugin' };
        }
      }
      
      // Execute action
      const result = await action.handler(
        runtime,
        message,
        state,
        {},
        (response) => {
          // Callback for streaming responses
          runtime.emit('action:response', { action: action.name, response });
        }
      );
      
      // Post-execution hook
      if (runtime.currentPlugin?.afterAction) {
        await runtime.currentPlugin.afterAction(action, result, runtime);
      }
      
      // Log execution
      runtime.logger.info(`Action ${action.name} executed in ${Date.now() - startTime}ms`);
      
      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      runtime.logger.error(`Action ${action.name} failed:`, error);
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }
}
```

### Provider Composition

How providers contribute to state:

```typescript
class ProviderOrchestrator {
  async composeState(
    runtime: IAgentRuntime,
    message: Memory
  ): Promise<State> {
    const state: State = {
      messages: [],
      facts: [],
      providers: {},
      context: '',
      metadata: {
        roomId: message.roomId,
        entityId: message.entityId,
        timestamp: Date.now(),
        tokenCount: 0
      }
    };
    
    // 1. Get recent messages
    state.messages = await runtime.getMemories({
      roomId: message.roomId,
      count: runtime.conversationLength
    });
    
    // 2. Run all providers in parallel
    const providerPromises = runtime.providers.map(async provider => {
      try {
        const result = await provider.get(runtime, message, state);
        return { name: provider.name, result };
      } catch (error) {
        runtime.logger.error(`Provider ${provider.name} failed:`, error);
        return null;
      }
    });
    
    const providerResults = await Promise.all(providerPromises);
    
    // 3. Merge provider data into state
    for (const item of providerResults) {
      if (!item) continue;
      
      state.providers[item.name] = {
        text: item.result.text || '',
        data: item.result.data || {}
      };
      
      // Add to context
      if (item.result.text) {
        state.context += `\n[${item.name.toUpperCase()}]\n${item.result.text}\n`;
      }
    }
    
    // 4. Calculate token count
    state.metadata.tokenCount = this.estimateTokens(state.context);
    
    return state;
  }
}
```

### Evaluator Execution

Post-processing with evaluators:

```typescript
class EvaluatorOrchestrator {
  async runEvaluators(
    runtime: IAgentRuntime,
    message: Memory,
    response: Memory,
    state: State
  ): Promise<EvaluationResults> {
    const results: EvaluationResults = {};
```