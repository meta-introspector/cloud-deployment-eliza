# a7046c18:packages_core_typescript_src_types_plugin.ts:1-119

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/plugin.ts:1-119
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Character } from "./agent";
import type { Action, Evaluator, Provider } from "./components";
import type { IDatabaseAdapter } from "./database";
import type { EventHandler, EventPayloadMap } from "./events";
import type { ModelParamsMap, PluginModelResult } from "./model";
import type { IAgentRuntime } from "./runtime";
import type { Service } from "./service";
import type { TestSuite } from "./testing";

/**
 * Minimal request interface
 * Plugins can use this type for route handlers
 */
export interface RouteRequest {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
  path?: string;
  url?: string;
}

/**
 * Minimal response interface
 * Plugins can use this type for route handlers
 */
export interface RouteResponse {
  status: (code: number) => RouteResponse;
  json: (data: unknown) => RouteResponse;
  send: (data: unknown) => RouteResponse;
  end: () => RouteResponse;
  setHeader?: (name: string, value: string | string[]) => RouteResponse;
  headersSent?: boolean;
}

export type Route = {
  type: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "STATIC";
  path: string;
  filePath?: string;
  public?: boolean;
  name?: string extends { public: true } ? string : string | undefined;
  handler?: (
    req: RouteRequest,
    res: RouteResponse,
    runtime: IAgentRuntime,
  ) => Promise<void>;
  isMultipart?: boolean; // Indicates if the route expects multipart/form-data (file uploads)
};

/**
 * Plugin for extending agent functionality
 */

export type PluginEvents = {
  [K in keyof EventPayloadMap]?: EventHandler<K>[];
};

/** Internal type for runtime event storage - allows dynamic access for event registration */
export type RuntimeEventStorage = PluginEvents & {
  [key: string]: ((params: unknown) => Promise<void>)[] | undefined;
};

export interface Plugin {
  name: string;
  description: string;

  // Initialize plugin with runtime services
  init?: (
    config: Record<string, string>,
    runtime: IAgentRuntime,
  ) => Promise<void>;

  // Configuration
  config?: { [key: string]: string | number | boolean | null | undefined };

  services?: (typeof Service)[];

  // Entity component definitions
  componentTypes?: {
    name: string;
    schema: Record<string, unknown>;
    validator?: (data: unknown) => boolean;
  }[];

  // Optional plugin features
  actions?: Action[];
  providers?: Provider[];
  evaluators?: Evaluator[];
  adapter?: IDatabaseAdapter;
  models?: {
    [K in keyof ModelParamsMap]?: (
      runtime: IAgentRuntime,
      params: ModelParamsMap[K],
    ) => Promise<PluginModelResult<K>>;
  };
  events?: PluginEvents;
  routes?: Route[];
  tests?: TestSuite[];

  dependencies?: string[];

  testDependencies?: string[];

  priority?: number;

  schema?: Record<string, unknown>;
}

export interface ProjectAgent {
  character: Character;
  init?: (runtime: IAgentRuntime) => Promise<void>;
  plugins?: Plugin[];
  tests?: TestSuite | TestSuite[];
}

export interface Project {
  agents: ProjectAgent[];
}
```