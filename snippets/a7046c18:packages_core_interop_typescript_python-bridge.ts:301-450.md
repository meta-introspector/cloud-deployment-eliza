# a7046c18:packages_core_interop_typescript_python-bridge.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/python-bridge.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    examples: actionDef.examples,

    validate: async (
      _runtime: IAgentRuntime,
      message: Memory,
      state: State | undefined,
    ): Promise<boolean> => {
      const response = await bridge.sendRequest<ValidationResponse>({
        type: "action.validate",
        id: "",
        action: actionDef.name,
        memory: message,
        state: state ?? null,
      });
      return response.valid;
    },

    handler: async (
      _runtime: IAgentRuntime,
      message: Memory,
      state: State | undefined,
      options: Record<string, unknown> | undefined,
      _callback?: HandlerCallback,
    ): Promise<ActionResult> => {
      const response = await bridge.sendRequest<ActionResultResponse>({
        type: "action.invoke",
        id: "",
        action: actionDef.name,
        memory: message,
        state: state ?? null,
        options: options ?? null,
      });
      const result = response.result;
      return {
        success: result.success,
        text: result.text,
        error: result.error ? new Error(result.error) : undefined,
        data: result.data,
        values: result.values,
      };
    },
  }));

  // Create provider wrappers
  const providers: Provider[] = (manifest.providers ?? []).map(
    (providerDef) => ({
      name: providerDef.name,
      description: providerDef.description,
      dynamic: providerDef.dynamic,
      position: providerDef.position,
      private: providerDef.private,

      get: async (
        _runtime: IAgentRuntime,
        message: Memory,
        state: State,
      ): Promise<ProviderResult> => {
        const response = await bridge.sendRequest<ProviderResultResponse>({
          type: "provider.get",
          id: "",
          provider: providerDef.name,
          memory: message,
          state: state,
        });
        return {
          text: response.result.text,
          values: response.result.values,
          data: response.result.data,
        };
      },
    }),
  );

  // Create evaluator wrappers
  const evaluators: Evaluator[] = (manifest.evaluators ?? []).map(
    (evalDef) => ({
      name: evalDef.name,
      description: evalDef.description,
      alwaysRun: evalDef.alwaysRun,
      similes: evalDef.similes,
      examples: [] as EvaluationExample[],

      validate: async (
        _runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
      ): Promise<boolean> => {
        const response = await bridge.sendRequest<ValidationResponse>({
          type: "action.validate",
          id: "",
          action: evalDef.name,
          memory: message,
          state: state ?? null,
        });
        return response.valid;
      },

      handler: async (
        _runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
      ): Promise<ActionResult | undefined> => {
        const response = await bridge.sendRequest<ActionResultResponse>({
          type: "evaluator.invoke",
          id: "",
          evaluator: evalDef.name,
          memory: message,
          state: state ?? null,
        });
        if (!response.result) {
          return undefined;
        }
        return {
          success: response.result.success,
          text: response.result.text,
          error: response.result.error
            ? new Error(response.result.error)
            : undefined,
          data: response.result.data,
          values: response.result.values,
        };
      },
    }),
  );

  // Store bridge reference for cleanup
  const bridgeRef = { current: bridge };

  return {
    name: manifest.name,
    description: manifest.description,
    config: manifest.config ?? {},
    dependencies: manifest.dependencies,
    actions,
    providers,
    evaluators,
    routes: [],
    services: [],

    async init(config: Record<string, string>) {
      await bridge.sendRequest({
        type: "plugin.init",
        id: "",
        config,
      });
    },

    // Extension for cleanup
    _bridge: bridgeRef,
  } as Plugin & { _bridge: { current: PythonPluginBridge } };
```