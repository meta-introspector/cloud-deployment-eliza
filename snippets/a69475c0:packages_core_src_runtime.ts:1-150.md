# a69475c0:packages_core_src_runtime.ts:1-150

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:1-150
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
import { v4 as uuidv4 } from 'uuid';

interface WorkingMemoryEntry {
  actionName: string;
  result: ActionResult;
  timestamp: number;
}

import { createUniqueUuid } from './entities';
import { getNumberEnv } from './utils/environment';
import { BufferUtils } from './utils/buffer';
import { isPlainObject } from './utils/type-guards';
import { decryptSecret, getSalt } from './index';
import { ActionStreamFilter } from './utils/streaming';
import { getStreamingContext, runWithStreamingContext } from './streaming-context';
import { createLogger } from './logger';
import { DefaultMessageService } from './services/default-message-service';
import type { IMessageService } from './services/message-service';
import {
  ChannelType,
  EventType,
  ModelType,
  MODEL_SETTINGS,
  type Content,
  type ControlMessage,
  type MemoryMetadata,
  type Character,
  type Action,
  type Evaluator,
  type Provider,
  type HandlerCallback,
  type HandlerOptions,
  type ActionContext,
  type IDatabaseAdapter,
  type Entity,
  type Room,
  type World,
  type SendHandlerFunction,
  type TargetInfo,
  type ModelParamsMap,
  type ModelResultMap,
  type ModelTypeName,
  type TextStreamResult,
  type Plugin,
  type RuntimeEventStorage,
  type Route,
  type UUID,
  type Service,
  type ServiceTypeName,
  type State,
  type TaskWorker,
  type Agent,
  type Log,
  type Participant,
  type Relationship,
  type Task,
  type Memory,
  type ModelHandler,
  type RuntimeSettings,
  type Component,
  IAgentRuntime,
  type IElizaOS,
  type ActionResult,
  type GenerateTextParams,
  type GenerateTextOptions,
  type GenerateTextResult,
  type EventPayload,
  type EventPayloadMap,
  type EventHandler,
} from './types';

import { BM25 } from './search';
import { stringToUuid } from './utils';

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
   * Reference to the ElizaOS instance that created this runtime
   * Set by ElizaOS when runtime is registered
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
    'pending' | 'registering' | 'registered' | 'failed'
  >(); // status tracking
  public initPromise: Promise<void>;
  private initResolver: ((value?: void | PromiseLike<void>) => void) | undefined;
```