# 12812d74:packages_core_src_services_default-message-service.ts:1-150

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:1-150
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
import { v4 } from 'uuid';
import type { IAgentRuntime } from '../types/runtime';
import type { Memory } from '../types/memory';
import type { Content, UUID, Media, MentionContext } from '../types/primitives';
import type { State } from '../types/state';
import type { HandlerCallback } from '../types/components';
import type { Room } from '../types/environment';
import {
  type IMessageService,
  type MessageProcessingOptions,
  type MessageProcessingResult,
  type ResponseDecision,
} from './message-service';
import {
  ChannelType,
  EventType,
  ModelType,
  ContentType,
  asUUID,
  createUniqueUuid,
  composePromptFromState,
  imageDescriptionTemplate,
  messageHandlerTemplate,
  shouldRespondTemplate,
  type RunEventPayload,
  multiStepDecisionTemplate,
  multiStepSummaryTemplate,
  parseKeyValueXml,
  parseBooleanFromText,
  truncateToCompleteSentence,
  getLocalServerUrl,
  logger,
  XmlTextStreamExtractor,
} from '../index';
import { runWithStreamingContext } from '../streaming-context';

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
type StrategyMode = 'simple' | 'actions' | 'none';

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
 * This is the standard message handler used by ElizaOS and can be replaced
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
    options?: MessageProcessingOptions
  ): Promise<MessageProcessingResult> {
    const opts = {
      maxRetries: options?.maxRetries ?? 3,
      timeoutDuration: options?.timeoutDuration ?? 60 * 60 * 1000, // 1 hour
      useMultiStep:
        options?.useMultiStep ?? parseBooleanFromText(String(runtime.getSetting('USE_MULTI_STEP') || '')),
      maxMultiStepIterations:
        options?.maxMultiStepIterations ??
        parseInt(String(runtime.getSetting('MAX_MULTISTEP_ITERATIONS') || '6')),
      onStreamChunk: options?.onStreamChunk,
    };

    // Set up timeout monitoring
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    const responseId = v4();

    try {
      runtime.logger.info(
        {
          src: 'service:message',
          agentId: runtime.agentId,
          entityId: message.entityId,
          roomId: message.roomId,
        },
        'Message received'
      );

      // Track this response ID
      if (!latestResponseIds.has(runtime.agentId)) {
        latestResponseIds.set(runtime.agentId, new Map<string, string>());
      }
```