# a7046c18:packages_core_typescript_src_types_events.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/events.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { HandlerCallback } from "./components";
import type { Entity, Room, World } from "./environment";
import type { Memory } from "./memory";
import type { ControlMessage } from "./messaging";
import type { ModelTypeName } from "./model";
import type { Content, UUID } from "./primitives";
import type { IAgentRuntime } from "./runtime";

/**
 * Standard event types across all platforms
 */
export enum EventType {
  // World events
  WORLD_JOINED = "WORLD_JOINED",
  WORLD_CONNECTED = "WORLD_CONNECTED",
  WORLD_LEFT = "WORLD_LEFT",

  // Entity events
  ENTITY_JOINED = "ENTITY_JOINED",
  ENTITY_LEFT = "ENTITY_LEFT",
  ENTITY_UPDATED = "ENTITY_UPDATED",

  // Room events
  ROOM_JOINED = "ROOM_JOINED",
  ROOM_LEFT = "ROOM_LEFT",

  // Message events
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
  MESSAGE_SENT = "MESSAGE_SENT",
  MESSAGE_DELETED = "MESSAGE_DELETED",

  // Channel events
  CHANNEL_CLEARED = "CHANNEL_CLEARED",

  // Voice events
  VOICE_MESSAGE_RECEIVED = "VOICE_MESSAGE_RECEIVED",
  VOICE_MESSAGE_SENT = "VOICE_MESSAGE_SENT",

  // Interaction events
  REACTION_RECEIVED = "REACTION_RECEIVED",
  POST_GENERATED = "POST_GENERATED",
  INTERACTION_RECEIVED = "INTERACTION_RECEIVED",

  // Run events
  RUN_STARTED = "RUN_STARTED",
  RUN_ENDED = "RUN_ENDED",
  RUN_TIMEOUT = "RUN_TIMEOUT",

  // Action events
  ACTION_STARTED = "ACTION_STARTED",
  ACTION_COMPLETED = "ACTION_COMPLETED",

  // Evaluator events
  EVALUATOR_STARTED = "EVALUATOR_STARTED",
  EVALUATOR_COMPLETED = "EVALUATOR_COMPLETED",

  // Model events
  MODEL_USED = "MODEL_USED",

  // Embedding events
  EMBEDDING_GENERATION_REQUESTED = "EMBEDDING_GENERATION_REQUESTED",
  EMBEDDING_GENERATION_COMPLETED = "EMBEDDING_GENERATION_COMPLETED",
  EMBEDDING_GENERATION_FAILED = "EMBEDDING_GENERATION_FAILED",

  // Control events
  CONTROL_MESSAGE = "CONTROL_MESSAGE",
}

/**
 * Platform-specific event type prefix
 */
export enum PlatformPrefix {
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
  TWITTER = "TWITTER",
}

/**
 * Base payload interface for all events
 */
export interface EventPayload {
  runtime: IAgentRuntime;
  source: string;
  onComplete?: () => void;
}

/**
 * Payload for world-related events
 */
export interface WorldPayload extends EventPayload {
  world: World;
  rooms: Room[];
  entities: Entity[];
}

/**
 * Payload for entity-related events
 */
export interface EntityPayload extends EventPayload {
  entityId: UUID;
  worldId?: UUID;
  roomId?: UUID;
  metadata?: {
    originalId: string;
    username: string;
    displayName?: string;
    [key: string]: unknown;
  };
}

/**
 * Payload for reaction-related events
 */
export interface MessagePayload extends EventPayload {
  message: Memory;
  callback?: HandlerCallback;
}

/**
 * Payload for channel cleared events
 */
export interface ChannelClearedPayload extends EventPayload {
  roomId: UUID;
  channelId: string;
  memoryCount: number;
}

/**
 * Payload for events that are invoked without a message
 */
export interface InvokePayload extends EventPayload {
  worldId: UUID;
  userId: string;
  roomId: UUID;
  callback?: HandlerCallback;
}

/**
 * Run event payload type
 */
export interface RunEventPayload extends EventPayload {
  runId: UUID;
  messageId: UUID;
  roomId: UUID;
  entityId: UUID;
  startTime: number;
  status: "started" | "completed" | "timeout";
  endTime?: number;
  duration?: number;
  error?: string;
```