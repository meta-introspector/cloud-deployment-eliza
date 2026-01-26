# a7046c18:packages_core_typescript_src_services_default-message-service.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { v4 } from "uuid";
import {
  asUUID,
  ChannelType,
  ContentType,
  composePromptFromState,
  createUniqueUuid,
  EventType,
  getLocalServerUrl,
  imageDescriptionTemplate,
  logger,
  ModelType,
  messageHandlerTemplate,
  multiStepDecisionTemplate,
  multiStepSummaryTemplate,
  parseBooleanFromText,
  parseKeyValueXml,
  type RunEventPayload,
  shouldRespondTemplate,
  truncateToCompleteSentence,
} from "../index";
import { runWithStreamingContext } from "../streaming-context";
import type { HandlerCallback } from "../types/components";
import type { Room } from "../types/environment";
import type { Memory } from "../types/memory";
import type { Content, Media, MentionContext, UUID } from "../types/primitives";
import type { IAgentRuntime } from "../types/runtime";
import type { State } from "../types/state";
import { ResponseStreamExtractor } from "../utils/streaming";
import type {
  IMessageService,
  MessageProcessingOptions,
  MessageProcessingResult,
  ResponseDecision,
} from "./message-service";

/**
 * Image description response from the model
 */
interface ImageDescriptionResponse {
  description: string;
  title?: string;
}

/**
 * Resolved message options with defaults applied.
 * Required numeric options + optional streaming callback.
 */
type ResolvedMessageOptions = {
  maxRetries: number;
  timeoutDuration: number;
  useMultiStep: boolean;
  maxMultiStepIterations: number;
  onStreamChunk?: (chunk: string, messageId?: UUID) => Promise<void>;
};

/**
 * Multi-step workflow execution result
 */
interface MultiStepActionResult {
  data: { actionName: string };
  success: boolean;
  text?: string;
  error?: string | Error;
  values?: Record<string, unknown>;
}

/**
 * Multi-step workflow state
 */
interface MultiStepState extends State {
  data: {
    actionResults: MultiStepActionResult[];
    [key: string]: unknown;
  };
}

/**
 * Strategy mode for response generation
 */
type StrategyMode = "simple" | "actions" | "none";

/**
 * Strategy result from core processing
 */
interface StrategyResult {
  responseContent: Content | null;
  responseMessages: Memory[];
  state: State;
  mode: StrategyMode;
}

/**
 * Tracks the latest response ID per agent+room to handle message superseding
 */
const latestResponseIds = new Map<string, Map<string, string>>();

/**
 * Default implementation of the MessageService interface.
 * This service handles the complete message processing pipeline including:
 * - Message validation and memory creation
 * - Smart response decision (shouldRespond)
 * - Single-shot or multi-step processing strategies
 * - Action execution and evaluation
 * - Attachment processing
 * - Message deletion and channel clearing
 *
 * This is the standard message handler used by elizaOS and can be replaced
 * with custom implementations via the IMessageService interface.
 */
export class DefaultMessageService implements IMessageService {
  /**
   * Main message handling entry point
   */
  async handleMessage(
    runtime: IAgentRuntime,
    message: Memory,
    callback?: HandlerCallback,
    options?: MessageProcessingOptions,
  ): Promise<MessageProcessingResult> {
    const opts = {
      maxRetries: options?.maxRetries ?? 3,
      timeoutDuration: options?.timeoutDuration ?? 60 * 60 * 1000, // 1 hour
      useMultiStep:
        options?.useMultiStep ??
        parseBooleanFromText(
          String(runtime.getSetting("USE_MULTI_STEP") || ""),
        ),
      maxMultiStepIterations:
        options?.maxMultiStepIterations ??
        parseInt(
          String(runtime.getSetting("MAX_MULTISTEP_ITERATIONS") || "6"),
          10,
        ),
      onStreamChunk: options?.onStreamChunk,
    };

    // Set up timeout monitoring
    let timeoutId: NodeJS.Timeout | undefined;
    // Single ID used for tracking, streaming, and the final message
    const responseId = asUUID(v4());

    try {
      runtime.logger.info(
        {
          src: "service:message",
          agentId: runtime.agentId,
          entityId: message.entityId,
          roomId: message.roomId,
        },
```