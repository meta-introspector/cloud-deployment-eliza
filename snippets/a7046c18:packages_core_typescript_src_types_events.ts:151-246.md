# a7046c18:packages_core_typescript_src_types_events.ts:151-246

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/events.ts:151-246
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

/**
 * Action event payload type
 */
export interface ActionEventPayload extends EventPayload {
  roomId: UUID;
  world: UUID;
  content: Content;
  messageId?: UUID;
}

/**
 * Evaluator event payload type
 */
export interface EvaluatorEventPayload extends EventPayload {
  evaluatorId: UUID;
  evaluatorName: string;
  startTime?: number;
  completed?: boolean;
  error?: Error;
}

/**
 * Model event payload type
 */
export interface ModelEventPayload extends EventPayload {
  provider: string;
  type: ModelTypeName;
  prompt: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

/**
 * Payload for embedding generation events
 */
export interface EmbeddingGenerationPayload extends EventPayload {
  memory: Memory;
  priority?: "high" | "normal" | "low";
  retryCount?: number;
  maxRetries?: number;
  embedding?: number[];
  error?: Error | string | unknown;
  runId?: UUID;
}

/**
 * Payload for control message events
 */
export interface ControlMessagePayload extends EventPayload {
  message: ControlMessage;
}

/**
 * Maps event types to their corresponding payload types
 */
export interface EventPayloadMap {
  [EventType.WORLD_JOINED]: WorldPayload;
  [EventType.WORLD_CONNECTED]: WorldPayload;
  [EventType.WORLD_LEFT]: WorldPayload;
  [EventType.ENTITY_JOINED]: EntityPayload;
  [EventType.ENTITY_LEFT]: EntityPayload;
  [EventType.ENTITY_UPDATED]: EntityPayload;
  [EventType.MESSAGE_RECEIVED]: MessagePayload;
  [EventType.MESSAGE_SENT]: MessagePayload;
  [EventType.MESSAGE_DELETED]: MessagePayload;
  [EventType.VOICE_MESSAGE_RECEIVED]: MessagePayload;
  [EventType.VOICE_MESSAGE_SENT]: MessagePayload;
  [EventType.CHANNEL_CLEARED]: ChannelClearedPayload;
  [EventType.REACTION_RECEIVED]: MessagePayload;
  [EventType.POST_GENERATED]: InvokePayload;
  [EventType.INTERACTION_RECEIVED]: MessagePayload;
  [EventType.RUN_STARTED]: RunEventPayload;
  [EventType.RUN_ENDED]: RunEventPayload;
  [EventType.RUN_TIMEOUT]: RunEventPayload;
  [EventType.ACTION_STARTED]: ActionEventPayload;
  [EventType.ACTION_COMPLETED]: ActionEventPayload;
  [EventType.EVALUATOR_STARTED]: EvaluatorEventPayload;
  [EventType.EVALUATOR_COMPLETED]: EvaluatorEventPayload;
  [EventType.MODEL_USED]: ModelEventPayload;
  [EventType.EMBEDDING_GENERATION_REQUESTED]: EmbeddingGenerationPayload;
  [EventType.EMBEDDING_GENERATION_COMPLETED]: EmbeddingGenerationPayload;
  [EventType.EMBEDDING_GENERATION_FAILED]: EmbeddingGenerationPayload;
  [EventType.CONTROL_MESSAGE]: ControlMessagePayload;
}

/**
 * Event handler function type
 */
export type EventHandler<T extends keyof EventPayloadMap> = (
  payload: EventPayloadMap[T],
) => Promise<void>;
```