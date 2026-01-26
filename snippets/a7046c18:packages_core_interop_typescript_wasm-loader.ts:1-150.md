# a7046c18:packages_core_interop_typescript_wasm-loader.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/wasm-loader.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * WASM Plugin Loader for elizaOS
 *
 * Loads Rust (or other) plugins compiled to WebAssembly and adapts them
 * to the TypeScript Plugin interface.
 */

import type {
  Action,
  ActionResult,
  EvaluationExample,
  Evaluator,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  Plugin,
  Provider,
  ProviderResult,
  State,
} from "../../typescript/src/types";

import type {
  ActionResultPayload,
  PluginManifest,
  ProviderResultPayload,
  WasmPluginExports,
  WasmPluginInstance,
} from "./types";

/**
 * Options for loading a WASM plugin
 */
export interface WasmLoaderOptions {
  /** Path or URL to the WASM file */
  wasmPath: string;
  /** Optional path to plugin.json manifest (auto-detected if not provided) */
  manifestPath?: string;
  /** Import object for WASM instantiation */
  imports?: WebAssembly.Imports;
}

/**
 * Text encoder/decoder for string passing
 */
const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Load a WASM plugin and return an elizaOS Plugin interface
 */
export async function loadWasmPlugin(
  options: WasmLoaderOptions,
): Promise<Plugin> {
  const { wasmPath, manifestPath } = options;

  // Load the WASM module
  const wasmInstance = await loadWasmModule(wasmPath, options.imports);

  // Get the manifest from the WASM module or external file
  let manifest: PluginManifest;
  if (manifestPath) {
    manifest = await loadManifest(manifestPath);
  } else {
    // Try to get manifest from WASM exports
    const manifestJson = wasmInstance.exports.get_manifest();
    manifest = JSON.parse(manifestJson);
  }

  // Create the plugin adapter
  return createPluginFromWasm(manifest, wasmInstance);
}

/**
 * Load a WASM module and instantiate it
 */
async function loadWasmModule(
  wasmPath: string,
  customImports?: WebAssembly.Imports,
): Promise<WasmPluginInstance> {
  // Default imports for WASM
  const defaultImports: WebAssembly.Imports = {
    env: {
      // Console logging
      console_log: (_ptr: number, _len: number) => {
        // Will be resolved once we have memory
      },
      console_error: (_ptr: number, _len: number) => {
        // Will be resolved once we have memory
      },
      // Abort handler
      abort: (_msg: number, file: number, line: number, column: number) => {
        throw new Error(`WASM abort at ${file}:${line}:${column}`);
      },
    },
    wasi_snapshot_preview1: {
      // Minimal WASI stubs for compatibility
      proc_exit: (code: number) => {
        throw new Error(`WASM exit with code ${code}`);
      },
      fd_write: () => 0,
      fd_read: () => 0,
      fd_close: () => 0,
      fd_seek: () => 0,
      environ_get: () => 0,
      environ_sizes_get: () => 0,
      clock_time_get: () => 0,
      random_get: (_buf: number, _len: number) => {
        // Fill with random bytes
        return 0;
      },
    },
  };

  const imports = { ...defaultImports, ...customImports };

  // Determine if we're in Node.js or browser
  const isNode =
    typeof globalThis.process !== "undefined" &&
    globalThis.process.versions &&
    globalThis.process.versions.node;

  let wasmModule: WebAssembly.Module;
  if (isNode) {
    // Node.js: read file
    const fs = await import("node:fs/promises");
    const wasmBuffer = await fs.readFile(wasmPath);
    wasmModule = await WebAssembly.compile(wasmBuffer);
  } else {
    // Browser: fetch
    const response = await fetch(wasmPath);
    const wasmBuffer = await response.arrayBuffer();
    wasmModule = await WebAssembly.compile(wasmBuffer);
  }

  let instance: WebAssembly.Instance = await WebAssembly.instantiate(
    wasmModule,
    defaultImports,
  );

  instance = await WebAssembly.instantiate(wasmModule, imports);

  // Set up console logging now that we have memory
  const memory = instance.exports.memory as WebAssembly.Memory;
  if (imports.env) {
    const env = imports.env as Record<string, unknown>;
    env.console_log = (ptr: number, len: number) => {
      const bytes = new Uint8Array(memory.buffer, ptr, len);
      console.log(decoder.decode(bytes));
    };
    env.console_error = (ptr: number, len: number) => {
```