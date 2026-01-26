# feb2b8d1:packages_core_typescript_src_runtime.ts:751-900

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:751-900
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
      return value;
    }

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      // Only decrypt string values
      const decrypted = decryptSecret(value, getSalt());
      if (decrypted === "true") return true;
      if (decrypted === "false") return false;
      return decrypted;
    }

    return null;
  }

  getConversationLength() {
    return this.#conversationLength;
  }

  registerDatabaseAdapter(adapter: IDatabaseAdapter) {
    if (this.adapter) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId },
        "Database adapter already registered, ignoring",
      );
    } else {
      this.adapter = adapter;
      this.logger.debug(
        { src: "agent", agentId: this.agentId },
        "Database adapter registered",
      );
    }
  }

  registerProvider(provider: Provider) {
    this.providers.push(provider);
    this.logger.debug(
      { src: "agent", agentId: this.agentId, provider: provider.name },
      "Provider registered",
    );
  }

  registerAction(action: Action) {
    if (this.actions.find((a) => a.name === action.name)) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId, action: action.name },
        "Action already registered, skipping",
      );
    } else {
      this.actions.push(action);
      this.logger.debug(
        { src: "agent", agentId: this.agentId, action: action.name },
        "Action registered",
      );
    }
  }

  registerEvaluator(evaluator: Evaluator) {
    this.evaluators.push(evaluator);
  }

  // Helper functions for immutable action plan updates
  private updateActionPlan<T>(plan: T, updates: Partial<T>): T {
    return { ...plan, ...updates };
  }

  private updateActionStep<T, S>(
    plan: T & { steps: S[] },
    index: number,
    stepUpdates: Partial<S>,
  ): T & { steps: S[] } {
    // Add bounds checking
    if (!plan.steps || index < 0 || index >= plan.steps.length) {
      this.logger.warn(
        {
          src: "agent",
          agentId: this.agentId,
          index,
          stepsCount: (plan.steps && plan.steps.length) || 0,
        },
        "Invalid step index",
      );
      return plan;
    }
    return {
      ...plan,
      steps: plan.steps.map((step: S, i: number) =>
        i === index ? { ...step, ...stepUpdates } : step,
      ),
    };
  }

  async processActions(
    message: Memory,
    responses: Memory[],
    state?: State,
    callback?: HandlerCallback,
    processOptions?: {
      onStreamChunk?: (chunk: string, messageId?: UUID) => Promise<void>;
    },
  ): Promise<void> {
    // Determine if we have multiple actions to execute
    const allActions: string[] = [];
    for (const response of responses) {
      if (response.content && response.content.actions && response.content.actions.length > 0) {
        allActions.push(...response.content.actions);
      }
    }

    const hasMultipleActions = allActions.length > 1;
    const parentRunId = this.getCurrentRunId();
    const runId = this.createRunId();

    // Create action plan if multiple actions
    let actionPlan:
      | {
          runId: UUID;
          totalSteps: number;
          currentStep: number;
          steps: Array<{
            action: string;
            status: "pending" | "completed" | "failed";
            result?: ActionResult;
            error?: string;
          }>;
          thought: string;
          startTime: number;
        }
      | undefined;

    const firstResponse = responses[0];
    const thought =
      (firstResponse && firstResponse.content && firstResponse.content.thought) ||
      `Executing ${allActions.length} actions: ${allActions.join(", ")}`;

    if (hasMultipleActions) {
      // Extract thought from response content

      actionPlan = {
        runId,
        totalSteps: allActions.length,
        currentStep: 0,
        steps: allActions.map((action) => ({
          action,
          status: "pending" as const,
        })),
        thought,
```