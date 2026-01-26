# a7046c18:packages_core_typescript_src_types_components.ts:151-211

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/components.ts:151-211
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Result returned by an action after execution
 * Used for action chaining and state management
 */
export interface ActionResult {
  /** Optional text description of the result */
  text?: string;

  /** Values to merge into the state */
  values?: Record<string, unknown>;

  /** Data payload containing action-specific results */
  data?: Record<string, unknown>;

  /** Whether the action succeeded - defaults to true */
  success: boolean;

  /** Error information if the action failed */
  error?: string | Error;
}

/**
 * Context provided to actions during execution
 * Allows actions to access previous results and execution state
 */
export interface ActionContext {
  /** Results from previously executed actions in this run */
  previousResults: ActionResult[];

  /** Get a specific previous result by action name */
  getPreviousResult?: (actionName: string) => ActionResult | undefined;
}

/**
 * Options passed to action handlers during execution
 * Provides context about the current execution and multi-step plans
 */
export interface HandlerOptions {
  /** Context with previous action results and utilities */
  actionContext?: ActionContext;

  /** Multi-step action plan information */
  actionPlan?: {
    /** Total number of steps in the plan */
    totalSteps: number;
    /** Current step being executed (1-based) */
    currentStep: number;
    /** Array of action steps with status tracking */
    steps: Array<{
      action: string;
      status: "pending" | "completed" | "failed";
      result?: ActionResult;
      error?: string;
    }>;
    /** AI's reasoning for this execution plan */
    thought: string;
  };

  /** Allow plugin extensions and custom options */
  [key: string]: unknown;
}
```