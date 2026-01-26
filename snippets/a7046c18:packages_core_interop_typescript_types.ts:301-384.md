# a7046c18:packages_core_interop_typescript_types.ts:301-384

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/types.ts:301-384
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 */
export type IPCResponse =
  | ActionResultResponse
  | ValidationResponse
  | ProviderResultResponse
  | ServiceResponse
  | RouteHandlerResponse
  | PluginInitResponse
  | ErrorResponse;

// ============================================================================
// WASM Interface Types
// ============================================================================

/**
 * WASM plugin exports interface
 */
export interface WasmPluginExports {
  /** Get plugin manifest as JSON string */
  get_manifest(): string;

  /** Initialize the plugin with config JSON */
  init(config_json: string): void;

  /** Validate an action (returns boolean) */
  validate_action(
    action: string,
    memory_json: string,
    state_json: string,
  ): boolean;

  /** Invoke an action (returns result JSON) */
  invoke_action(
    action: string,
    memory_json: string,
    state_json: string,
    options_json: string,
  ): string;

  /** Get provider data (returns result JSON) */
  get_provider(
    provider: string,
    memory_json: string,
    state_json: string,
  ): string;

  /** Validate an evaluator */
  validate_evaluator(
    evaluator: string,
    memory_json: string,
    state_json: string,
  ): boolean;

  /** Invoke an evaluator (returns result JSON) */
  invoke_evaluator(
    evaluator: string,
    memory_json: string,
    state_json: string,
  ): string;

  /** Handle a route (returns response JSON) */
  handle_route(path: string, method: string, request_json: string): string;

  /** Memory allocation for passing strings */
  alloc(size: number): number;

  /** Memory deallocation */
  dealloc(ptr: number, size: number): void;
}

/**
 * WASM memory interface
 */
export interface WasmMemory {
  buffer: ArrayBuffer;
}

/**
 * WASM instance with memory and exports
 */
export interface WasmPluginInstance {
  exports: WasmPluginExports;
  memory: WasmMemory;
}
```