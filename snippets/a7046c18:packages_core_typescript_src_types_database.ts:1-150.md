# a7046c18:packages_core_typescript_src_types_database.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/database.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Agent } from "./agent";
import type {
  Component,
  Entity,
  Participant,
  Relationship,
  Room,
  World,
} from "./environment";
import type { Memory, MemoryMetadata } from "./memory";
import type { Metadata, UUID } from "./primitives";
import type { Task } from "./task";

/**
 * Base log body type with common properties
 */
export interface BaseLogBody {
  runId?: string | UUID;
  status?: string;
  messageId?: UUID;
  roomId?: UUID;
  entityId?: UUID;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Log body for action logs
 */
export interface ActionLogBody extends BaseLogBody {
  action?: string;
  actionId?: UUID | string;
  message?: string;
  messageId?: UUID;
  state?: unknown;
  responses?: unknown;
  content?: {
    actions?: string[];
    [key: string]: unknown;
  };
  result?: {
    success?: boolean;
    data?: unknown;
    text?: string;
    error?: string | Error;
    [key: string]: unknown;
  };
  isLegacyReturn?: boolean;
  prompts?: Array<{
    modelType: string;
    prompt: string;
    timestamp: number;
  }>;
  promptCount?: number;
  planStep?: string;
  planThought?: string;
}

/**
 * Log body for evaluator logs
 */
export interface EvaluatorLogBody extends BaseLogBody {
  evaluator?: string;
  messageId?: UUID;
  message?: string;
  state?: unknown;
}

/**
 * Log body for model logs
 */
export interface ModelLogBody extends BaseLogBody {
  modelType?: string;
  modelKey?: string;
  params?: Record<string, unknown>;
  prompt?: string;
  systemPrompt?: string | null;
  timestamp?: number;
  executionTime?: number;
  provider?: string;
  actionContext?: {
    actionName: string;
    actionId: UUID;
  };
  response?: unknown;
}

/**
 * Log body for embedding logs
 */
export interface EmbeddingLogBody extends BaseLogBody {
  status?: string;
  memoryId?: string;
  duration?: number;
}

/**
 * Union type for all possible log body types
 */
export type LogBody =
  | BaseLogBody
  | ActionLogBody
  | EvaluatorLogBody
  | ModelLogBody
  | EmbeddingLogBody;

/**
 * Represents a log entry
 */
export interface Log {
  /** Optional unique identifier */
  id?: UUID;

  /** Associated entity ID */
  entityId: UUID;

  /** Associated room ID */
  roomId?: UUID;

  /** Log body - can be any of the log body types */
  body: LogBody;

  /** Log type */
  type: string;

  /** Log creation timestamp */
  createdAt: Date;
}

export type RunStatus = "started" | "completed" | "timeout" | "error";

export interface AgentRunCounts {
  actions: number;
  modelCalls: number;
  errors: number;
  evaluators: number;
}

export interface AgentRunSummary {
  runId: string;
  status: RunStatus;
  startedAt: number | null;
  endedAt: number | null;
  durationMs: number | null;
  messageId?: UUID;
  roomId?: UUID;
  entityId?: UUID;
  metadata?: Record<string, unknown>;
  counts?: AgentRunCounts;
}
```