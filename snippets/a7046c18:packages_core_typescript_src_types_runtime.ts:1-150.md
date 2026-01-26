# a7046c18:packages_core_typescript_src_types_runtime.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/runtime.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Logger } from "../logger";
import type { IMessageService } from "../services/message-service";
import type { Character } from "./agent";
import type {
  Action,
  ActionResult,
  Evaluator,
  HandlerCallback,
  Provider,
} from "./components";
import type { IDatabaseAdapter } from "./database";
import type { IElizaOS } from "./elizaos";
import type { ChannelType, Entity, Room, World } from "./environment";
import type { EventHandler, EventPayload, EventPayloadMap } from "./events";
import type { Memory, MemoryMetadata } from "./memory";
import type { SendHandlerFunction, TargetInfo } from "./messaging";
import type {
  GenerateTextOptions,
  GenerateTextParams,
  GenerateTextResult,
  ModelParamsMap,
  ModelResultMap,
  ModelTypeName,
  TextGenerationModelType,
} from "./model";
import type { Plugin, Route, RuntimeEventStorage } from "./plugin";
import type { Content, UUID } from "./primitives";
import type { Service, ServiceTypeName } from "./service";
import type { State } from "./state";
import type { TaskWorker } from "./task";

/**
 * Represents the core runtime environment for an agent.
 * Defines methods for database interaction, plugin management, event handling,
 * state composition, model usage, and task management.
 */

export interface IAgentRuntime extends IDatabaseAdapter {
  // Properties
  agentId: UUID;
  character: Character;
  initPromise: Promise<void>;
  messageService: IMessageService | null;
  providers: Provider[];
  actions: Action[];
  evaluators: Evaluator[];
  plugins: Plugin[];
  services: Map<ServiceTypeName, Service[]>;
  events: RuntimeEventStorage;
  fetch?: typeof fetch | null;
  routes: Route[];
  logger: Logger;
  stateCache: Map<string, State>;
  elizaOS?: IElizaOS;

  // Methods
  registerPlugin(plugin: Plugin): Promise<void>;

  initialize(options?: { skipMigrations?: boolean }): Promise<void>;

  getConnection(): Promise<unknown>;

  getService<T extends Service>(service: ServiceTypeName | string): T | null;

  getServicesByType<T extends Service>(service: ServiceTypeName | string): T[];

  getAllServices(): Map<ServiceTypeName, Service[]>;

  registerService(service: typeof Service): Promise<void>;

  getServiceLoadPromise(serviceType: ServiceTypeName): Promise<Service>;

  getRegisteredServiceTypes(): ServiceTypeName[];

  hasService(serviceType: ServiceTypeName | string): boolean;

  hasElizaOS(): this is IAgentRuntime & { elizaOS: IElizaOS };

  // Keep these methods for backward compatibility
  registerDatabaseAdapter(adapter: IDatabaseAdapter): void;

  setSetting(
    key: string,
    value: string | boolean | null,
    secret?: boolean,
  ): void;

  getSetting(key: string): string | boolean | number | null;

  getConversationLength(): number;

  processActions(
    message: Memory,
    responses: Memory[],
    state?: State,
    callback?: HandlerCallback,
    options?: {
      onStreamChunk?: (chunk: string, messageId?: UUID) => Promise<void>;
    },
  ): Promise<void>;

  getActionResults(messageId: UUID): ActionResult[];

  evaluate(
    message: Memory,
    state?: State,
    didRespond?: boolean,
    callback?: HandlerCallback,
    responses?: Memory[],
  ): Promise<Evaluator[] | null>;

  registerProvider(provider: Provider): void;

  registerAction(action: Action): void;

  registerEvaluator(evaluator: Evaluator): void;

  ensureConnections(
    entities: Entity[],
    rooms: Room[],
    source: string,
    world: World,
  ): Promise<void>;
  ensureConnection({
    entityId,
    roomId,
    metadata,
    userName,
    worldName,
    name,
    source,
    channelId,
    messageServerId,
    type,
    worldId,
    userId,
  }: {
    entityId: UUID;
    roomId: UUID;
    userName?: string;
    name?: string;
    worldName?: string;
    source?: string;
    channelId?: string;
    messageServerId?: UUID;
    type?: ChannelType | string;
    worldId: UUID;
    userId?: UUID;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
```