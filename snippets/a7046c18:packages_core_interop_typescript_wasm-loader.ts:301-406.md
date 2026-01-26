# a7046c18:packages_core_interop_typescript_wasm-loader.ts:301-406

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/wasm-loader.ts:301-406
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          JSON.stringify(message),
          JSON.stringify(state),
        );
        const result: ProviderResultPayload = JSON.parse(resultJson);
        return {
          text: result.text,
          values: result.values,
          data: result.data,
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
        const result = exports.validate_evaluator(
          evalDef.name,
          JSON.stringify(message),
          JSON.stringify(state ?? null),
        );
        return typeof result === "boolean" ? result : result !== 0;
      },

      handler: async (
        _runtime: IAgentRuntime,
        message: Memory,
        state: State | undefined,
      ): Promise<ActionResult | undefined> => {
        const resultJson = exports.invoke_evaluator(
          evalDef.name,
          JSON.stringify(message),
          JSON.stringify(state ?? null),
        );
        if (!resultJson || resultJson === "null") {
          return undefined;
        }
        const result: ActionResultPayload = JSON.parse(resultJson);
        return {
          success: result.success,
          text: result.text,
          error: result.error ? new Error(result.error) : undefined,
          data: result.data,
          values: result.values,
        };
      },
    }),
  );

  // Return the plugin
  return {
    name: manifest.name,
    description: manifest.description,
    config: manifest.config ?? {},
    dependencies: manifest.dependencies,
    actions,
    providers,
    evaluators,
    // Routes would need special handling for WASM
    routes: [],
    // Services need special handling
    services: [],

    async init(config: Record<string, string>) {
      exports.init(JSON.stringify(config));
    },
  };
}

/**
 * Preload and validate a WASM plugin without fully loading it
 */
export async function validateWasmPlugin(wasmPath: string): Promise<{
  valid: boolean;
  manifest?: PluginManifest;
  error?: string;
}> {
  try {
    const instance = await loadWasmModule(wasmPath, {});
    const manifestJson = instance.exports.get_manifest();
    const manifest: PluginManifest = JSON.parse(manifestJson);

    // Basic validation
    if (!manifest.name || !manifest.description) {
      return { valid: false, error: "Missing required manifest fields" };
    }

    return { valid: true, manifest };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
```