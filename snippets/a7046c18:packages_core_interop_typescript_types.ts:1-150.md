# a7046c18:packages_core_interop_typescript_types.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/types.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Cross-language interop types for elizaOS
 *
 * These types define the wire format for communication between
 * different language runtimes (Rust, TypeScript, Python).
 */

import type { Content, Memory, State } from "../../typescript/src/types";

/**
 * Supported interop protocols
 */
export type InteropProtocol = "wasm" | "ffi" | "ipc" | "native";

/**
 * Supported plugin languages
 */
export type PluginLanguage = "typescript" | "rust" | "python";

/**
 * Plugin interop configuration
 */
export interface PluginInteropConfig {
  /** Communication protocol */
  protocol: InteropProtocol;
  /** Path to WASM module (for wasm protocol) */
  wasmPath?: string;
  /** Path to shared library (for ffi protocol) */
  sharedLibPath?: string;
  /** IPC command to spawn subprocess */
  ipcCommand?: string;
  /** IPC port for TCP communication */
  ipcPort?: number;
  /** Working directory for subprocess */
  cwd?: string;
}

/**
 * Cross-language plugin manifest
 */
export interface PluginManifest {
  name: string;
  description: string;
  version: string;
  language: PluginLanguage;
  interop?: PluginInteropConfig;
  config?: Record<string, string | number | boolean | null>;
  dependencies?: string[];
  actions?: ActionManifest[];
  providers?: ProviderManifest[];
  evaluators?: EvaluatorManifest[];
  services?: ServiceManifest[];
  routes?: RouteManifest[];
  events?: Record<string, string[]>;
}

/**
 * Action manifest (metadata only, no handlers)
 */
export interface ActionManifest {
  name: string;
  description: string;
  similes?: string[];
  examples?: ActionExample[][];
}

/**
 * Action example for documentation
 */
export interface ActionExample {
  name: string;
  content: Content;
}

/**
 * Provider manifest
 */
export interface ProviderManifest {
  name: string;
  description?: string;
  dynamic?: boolean;
  position?: number;
  private?: boolean;
}

/**
 * Evaluator manifest
 */
export interface EvaluatorManifest {
  name: string;
  description: string;
  alwaysRun?: boolean;
  similes?: string[];
}

/**
 * Service manifest
 */
export interface ServiceManifest {
  type: string;
  description?: string;
}

/**
 * Route manifest
 */
export interface RouteManifest {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "STATIC";
  name?: string;
  public?: boolean;
  isMultipart?: boolean;
}

// ============================================================================
// IPC Message Types
// ============================================================================

/**
 * Base IPC message
 */
export interface IPCMessage {
  type: string;
  id: string;
}

/**
 * Action invocation request
 */
export interface ActionInvokeRequest extends IPCMessage {
  type: "action.invoke";
  action: string;
  memory: Memory;
  state: State | null;
  options: Record<string, unknown> | null;
}

/**
 * Action result response
 */
export interface ActionResultResponse extends IPCMessage {
  type: "action.result";
  result: ActionResultPayload;
}

/**
 * Action result payload
 */
export interface ActionResultPayload {
  success: boolean;
```