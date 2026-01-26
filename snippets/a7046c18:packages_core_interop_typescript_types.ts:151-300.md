# a7046c18:packages_core_interop_typescript_types.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/types.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  text?: string;
  error?: string;
  data?: Record<string, unknown>;
  values?: Record<string, unknown>;
}

/**
 * Action validation request
 */
export interface ActionValidateRequest extends IPCMessage {
  type: "action.validate";
  action: string;
  memory: Memory;
  state: State | null;
}

/**
 * Validation result response
 */
export interface ValidationResponse extends IPCMessage {
  type: "validate.result";
  valid: boolean;
}

/**
 * Provider get request
 */
export interface ProviderGetRequest extends IPCMessage {
  type: "provider.get";
  provider: string;
  memory: Memory;
  state: State;
}

/**
 * Provider result response
 */
export interface ProviderResultResponse extends IPCMessage {
  type: "provider.result";
  result: ProviderResultPayload;
}

/**
 * Provider result payload
 */
export interface ProviderResultPayload {
  text?: string;
  values?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

/**
 * Evaluator invocation request
 */
export interface EvaluatorInvokeRequest extends IPCMessage {
  type: "evaluator.invoke";
  evaluator: string;
  memory: Memory;
  state: State | null;
}

/**
 * Service start request
 */
export interface ServiceStartRequest extends IPCMessage {
  type: "service.start";
  service: string;
}

/**
 * Service stop request
 */
export interface ServiceStopRequest extends IPCMessage {
  type: "service.stop";
  service: string;
}

/**
 * Service response
 */
export interface ServiceResponse extends IPCMessage {
  type: "service.response";
  success: boolean;
  error?: string;
}

/**
 * Route handler request
 */
export interface RouteHandlerRequest extends IPCMessage {
  type: "route.handle";
  path: string;
  method: string;
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  headers?: Record<string, string | string[]>;
}

/**
 * Route handler response
 */
export interface RouteHandlerResponse extends IPCMessage {
  type: "route.response";
  status: number;
  headers?: Record<string, string | string[]>;
  body?: unknown;
}

/**
 * Plugin initialization request
 */
export interface PluginInitRequest extends IPCMessage {
  type: "plugin.init";
  config: Record<string, string>;
}

/**
 * Plugin initialization response
 */
export interface PluginInitResponse extends IPCMessage {
  type: "plugin.init.result";
  success: boolean;
  error?: string;
}

/**
 * Error response
 */
export interface ErrorResponse extends IPCMessage {
  type: "error";
  error: string;
  details?: unknown;
}

/**
 * All possible IPC request types
 */
export type IPCRequest =
  | ActionInvokeRequest
  | ActionValidateRequest
  | ProviderGetRequest
  | EvaluatorInvokeRequest
  | ServiceStartRequest
  | ServiceStopRequest
  | RouteHandlerRequest
  | PluginInitRequest;

/**
 * All possible IPC response types
```