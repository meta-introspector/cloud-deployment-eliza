# a7046c18:packages_core_typescript_src_runtime.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { v4 as uuidv4 } from "uuid";

interface WorkingMemoryEntry {
  actionName: string;
  result: ActionResult;
  timestamp: number;
}

import { createUniqueUuid } from "./entities";
import { decryptSecret, getSalt } from "./index";
import { createLogger } from "./logger";
import { BM25 } from "./search";
import { DefaultMessageService } from "./services/default-message-service";
import type { IMessageService } from "./services/message-service";
import {
  getStreamingContext,
  runWithStreamingContext,
} from "./streaming-context";
import {
  type Action,
  type ActionContext,
  type ActionResult,
  type Agent,
  ChannelType,
  type Character,
  type Component,
  type Content,
  type ControlMessage,
  type Entity,
  type Evaluator,
  type EventHandler,
  type EventPayload,
  type EventPayloadMap,
  EventType,
  type GenerateTextOptions,
  type GenerateTextParams,
  type GenerateTextResult,
  type HandlerCallback,
  type HandlerOptions,
  type IAgentRuntime,
  type IDatabaseAdapter,
  type IElizaOS,
  type Log,
  type Memory,
  type MemoryMetadata,
  MODEL_SETTINGS,
  type ModelHandler,
  type ModelParamsMap,
  type ModelResultMap,
  ModelType,
  type ModelTypeName,
  type Participant,
  type Plugin,
  type Provider,
  type Relationship,
  type Room,
  type Route,
  type RuntimeEventStorage,
  type RuntimeSettings,
  type SendHandlerFunction,
  type Service,
  type ServiceTypeName,
  type State,
  type TargetInfo,
  type Task,
  type TaskWorker,
  type TextStreamResult,
  type UUID,
  type World,
} from "./types";
import { stringToUuid } from "./utils";
import { BufferUtils } from "./utils/buffer";
import { getNumberEnv } from "./utils/environment";
import { ActionStreamFilter } from "./utils/streaming";
import { isPlainObject } from "./utils/type-guards";

const environmentSettings: RuntimeSettings = {};

export class Semaphore {
  private permits: number;
  private waiting: Array<() => void> = [];
  constructor(count: number) {
    this.permits = count;
  }
  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits -= 1;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }
  release(): void {
    this.permits += 1;
    const nextResolve = this.waiting.shift();
    if (nextResolve && this.permits > 0) {
      this.permits -= 1;
      nextResolve();
    }
  }
}

type ServiceResolver = (service: Service) => void;
type ServiceRejecter = (reason: Error | string) => void;
type ServicePromiseHandler = {
  resolve: ServiceResolver;
  reject: ServiceRejecter;
};

export class AgentRuntime implements IAgentRuntime {
  readonly #conversationLength = 32 as number;
  readonly agentId: UUID;
  readonly character: Character;
  public adapter!: IDatabaseAdapter;
  readonly actions: Action[] = [];
  readonly evaluators: Evaluator[] = [];
  readonly providers: Provider[] = [];
  readonly plugins: Plugin[] = [];
  events: RuntimeEventStorage = {};
  stateCache = new Map<string, State>();
  readonly fetch = fetch;
  services = new Map<ServiceTypeName, Service[]>();
  private serviceTypes = new Map<ServiceTypeName, (typeof Service)[]>();
  models = new Map<string, ModelHandler[]>();
  routes: Route[] = [];
  private taskWorkers = new Map<string, TaskWorker>();
  private sendHandlers = new Map<string, SendHandlerFunction>();
  private eventHandlers: Map<string, ((data: unknown) => void)[]> = new Map();

  /**
   * Reference to the elizaOS instance that created this runtime
   * Set by elizaOS when runtime is registered
   * @optional
   */
  elizaOS?: IElizaOS;

  // A map of all plugins available to the runtime, keyed by name, for dependency resolution.
  private allAvailablePlugins = new Map<string, Plugin>();
  // The initial list of plugins specified by the character configuration.
  private characterPlugins: Plugin[] = [];

  public logger;
  private settings: RuntimeSettings;
  private servicePromiseHandlers = new Map<string, ServicePromiseHandler>(); // Combined handlers for resolve/reject
  private servicePromises = new Map<string, Promise<Service>>(); // read
  private serviceRegistrationStatus = new Map<
    ServiceTypeName,
    "pending" | "registering" | "registered" | "failed"
  >(); // status tracking
```