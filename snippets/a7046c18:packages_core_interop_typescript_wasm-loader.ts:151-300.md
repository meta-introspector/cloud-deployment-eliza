# a7046c18:packages_core_interop_typescript_wasm-loader.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/wasm-loader.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const bytes = new Uint8Array(memory.buffer, ptr, len);
      console.error(decoder.decode(bytes));
    };
  }

  return {
    exports: instance.exports as unknown as WasmPluginExports,
    memory: { buffer: memory.buffer },
  };
}

/**
 * Load manifest from external JSON file
 */
async function loadManifest(manifestPath: string): Promise<PluginManifest> {
  const isNode =
    typeof globalThis.process !== "undefined" &&
    globalThis.process.versions &&
    globalThis.process.versions.node;

  if (isNode) {
    const fs = await import("node:fs/promises");
    const content = await fs.readFile(manifestPath, "utf-8");
    return JSON.parse(content);
  } else {
    const response = await fetch(manifestPath);
    return response.json();
  }
}

/**
 * Helper to pass a string to WASM and get result
 */
function _callWasmWithString(
  instance: WasmPluginInstance,
  fn: (...args: number[]) => number,
  ...strings: string[]
): string {
  const { exports, memory } = instance;
  const ptrs: number[] = [];
  const lens: number[] = [];

  // Allocate and write strings
  for (const str of strings) {
    const bytes = encoder.encode(str);
    const ptr = exports.alloc(bytes.length);
    const view = new Uint8Array(memory.buffer, ptr, bytes.length);
    view.set(bytes);
    ptrs.push(ptr);
    lens.push(bytes.length);
  }

  // Call the function
  const args: number[] = [];
  for (let i = 0; i < strings.length; i++) {
    args.push(ptrs[i], lens[i]);
  }
  const resultPtr = fn(...args);

  // Read result (assuming null-terminated or length-prefixed)
  // For now, assume it returns a pointer to a null-terminated string
  let resultLen = 0;
  const view = new Uint8Array(memory.buffer);
  while (
    view[resultPtr + resultLen] !== 0 &&
    resultPtr + resultLen < view.length
  ) {
    resultLen++;
  }
  const result = decoder.decode(
    new Uint8Array(memory.buffer, resultPtr, resultLen),
  );

  // Deallocate input strings
  for (let i = 0; i < strings.length; i++) {
    exports.dealloc(ptrs[i], lens[i]);
  }

  return result;
}

/**
 * Create a Plugin from a WASM instance
 */
function createPluginFromWasm(
  manifest: PluginManifest,
  instance: WasmPluginInstance,
): Plugin {
  const { exports } = instance;

  // Create action wrappers
  const actions: Action[] = (manifest.actions ?? []).map((actionDef) => ({
    name: actionDef.name,
    description: actionDef.description,
    similes: actionDef.similes,
    examples: actionDef.examples,

    validate: async (
      _runtime: IAgentRuntime,
      message: Memory,
      state: State | undefined,
    ): Promise<boolean> => {
      const result = exports.validate_action(
        actionDef.name,
        JSON.stringify(message),
        JSON.stringify(state ?? null),
      );
      return typeof result === "boolean" ? result : result !== 0;
    },

    handler: async (
      _runtime: IAgentRuntime,
      message: Memory,
      state: State | undefined,
      options: Record<string, unknown> | undefined,
      _callback?: HandlerCallback,
    ): Promise<ActionResult> => {
      const resultJson = exports.invoke_action(
        actionDef.name,
        JSON.stringify(message),
        JSON.stringify(state ?? null),
        JSON.stringify(options ?? {}),
      );
      const result: ActionResultPayload = JSON.parse(resultJson);
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
        const resultJson = exports.get_provider(
          providerDef.name,
```