# a7046c18:packages_core_typescript_src_types_components.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/components.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Memory } from "./memory";
import type { Content } from "./primitives";
import type { IAgentRuntime } from "./runtime";
import type { State } from "./state";

/**
 * Example content with associated user for demonstration purposes
 */
export interface ActionExample {
  /** User associated with the example */
  name: string;

  /** Content of the example */
  content: Content;
}

/**
 * Callback function type for handlers
 */
export type HandlerCallback = (response: Content) => Promise<Memory[]>;

/**
 * Handler function type for processing messages
 */
export type Handler = (
  runtime: IAgentRuntime,
  message: Memory,
  state?: State,
  options?: HandlerOptions,
  callback?: HandlerCallback,
  responses?: Memory[],
) => Promise<ActionResult | undefined | undefined>;

/**
 * Validator function type for actions/evaluators
 */
export type Validator = (
  runtime: IAgentRuntime,
  message: Memory,
  state?: State,
) => Promise<boolean>;

/**
 * Represents an action the agent can perform
 */
export interface Action {
  /** Similar action descriptions */
  similes?: string[];

  /** Detailed description */
  description: string;

  /** Example usages */
  examples?: ActionExample[][];

  /** Handler function */
  handler: Handler;

  /** Action name */
  name: string;

  /** Validation function */
  validate: Validator;

  /** Allow extensions and custom options */
  [key: string]: unknown;
}

/**
 * Example for evaluating agent behavior
 */
export interface EvaluationExample {
  /** Evaluation context */
  prompt: string;

  /** Example messages */
  messages: Array<ActionExample>;

  /** Expected outcome */
  outcome: string;
}

/**
 * Evaluator for assessing agent responses
 */
export interface Evaluator {
  /** Whether to always run */
  alwaysRun?: boolean;

  /** Detailed description */
  description: string;

  /** Similar evaluator descriptions */
  similes?: string[];

  /** Example evaluations */
  examples: EvaluationExample[];

  /** Handler function */
  handler: Handler;

  /** Evaluator name */
  name: string;

  /** Validation function */
  validate: Validator;
}

export interface ProviderResult {
  /** Human-readable text for LLM prompt inclusion */
  text?: string;

  /** Key-value pairs for template variable substitution */
  values?: Record<string, unknown>;

  /** Structured data for programmatic access by other components */
  data?: Record<string, unknown>;
}

/**
 * Provider for external data/services
 */
export interface Provider {
  /** Provider name */
  name: string;

  /** Description of the provider */
  description?: string;

  /** Whether the provider is dynamic */
  dynamic?: boolean;

  /** Position of the provider in the provider list, positive or negative */
  position?: number;

  /**
   * Whether the provider is private
   *
   * Private providers are not displayed in the regular provider list, they have to be called explicitly
   */
  private?: boolean;

  /** Data retrieval function */
  get: (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
  ) => Promise<ProviderResult>;
}

```