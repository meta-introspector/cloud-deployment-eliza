# 5e8c73c1:packages_core_src_runtime.ts:1201-1350

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:1201-1350
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        // Store action result as memory
        const actionMemory: Memory = {
          id: actionId,
          entityId: this.agentId,
          roomId: message.roomId,
          worldId: message.worldId,
          content: {
            text: actionResult?.text || `Executed action: ${action.name}`,
            source: 'action',
            type: 'action_result',
            actionName: action.name,
            actionStatus: actionResult?.success ? 'completed' : 'failed',
            actionResult: isLegacyReturn ? { legacy: result } : actionResult,
            runId,
            ...(actionPlan && {
              planStep: `${actionPlan.currentStep}/${actionPlan.totalSteps}`,
              planThought: actionPlan.thought,
            }),
          },
          metadata: {
            type: 'action_result',
            actionName: action.name,
            runId,
            parentRunId,
            actionId,
            ...(actionPlan && {
              totalSteps: actionPlan.totalSteps,
              currentStep: actionPlan.currentStep,
            }),
          },
        };
        await this.createMemory(actionMemory, 'messages');

        this.logger.debug(
          { src: 'agent', agentId: this.agentId, action: action.name },
          'Action completed'
        );

        // log to database with collected prompts
        await this.adapter.log({
          entityId: message.entityId,
          roomId: message.roomId,
          type: 'action',
          body: {
            action: action.name,
            actionId,
            message: message.content.text,
            messageId: message.id,
            state: accumulatedState,
            responses,
            result: isLegacyReturn ? { legacy: result } : actionResult,
            isLegacyReturn,
            prompts: this.currentActionContext?.prompts || [],
            promptCount: this.currentActionContext?.prompts.length || 0,
            runId,
            parentRunId,
            ...(actionPlan && {
              planStep: `${actionPlan.currentStep}/${actionPlan.totalSteps}`,
              planThought: actionPlan.thought,
            }),
          },
        });

        // Clear action context
        this.currentActionContext = undefined;

        actionIndex++;
      }

      // Store accumulated results for evaluators and providers
      if (message.id) {
        this.stateCache.set(`${message.id}_action_results`, {
          values: { actionResults },
          data: { actionResults, actionPlan },
          text: JSON.stringify(actionResults),
        });
      }
    }
  }

  getActionResults(messageId: UUID): ActionResult[] {
    const cachedState = this.stateCache?.get(`${messageId}_action_results`);
    return (cachedState?.data?.actionResults as ActionResult[]) || [];
  }

  async evaluate(
    message: Memory,
    state: State,
    didRespond?: boolean,
    callback?: HandlerCallback,
    responses?: Memory[]
  ) {
    const evaluatorPromises = this.evaluators.map(async (evaluator: Evaluator) => {
      if (!evaluator.handler) {
        return null;
      }
      if (!didRespond && !evaluator.alwaysRun) {
        return null;
      }
      const result = await evaluator.validate(this as IAgentRuntime, message, state);
      if (result) {
        return evaluator;
      }
      return null;
    });
    const evaluators = (await Promise.all(evaluatorPromises)).filter(Boolean) as Evaluator[];
    if (evaluators.length === 0) {
      return [];
    }
    state = await this.composeState(message, ['RECENT_MESSAGES', 'EVALUATORS']);
    await Promise.all(
      evaluators.map(async (evaluator) => {
        if (evaluator.handler) {
          await evaluator.handler(this as IAgentRuntime, message, state, {}, callback, responses);
          this.adapter.log({
            entityId: message.entityId,
            roomId: message.roomId,
            type: 'evaluator',
            body: {
              evaluator: evaluator.name,
              messageId: message.id,
              message: message.content.text,
              state,
              runId: this.getCurrentRunId(),
            },
          });
        }
      })
    );
    return evaluators;
  }

  // highly SQL optimized queries
  async ensureConnections(
    entities: Entity[],
    rooms: Room[],
    source: string,
    world: World
  ): Promise<void> {
    // guards
    if (!entities) {
      this.logger.error(
        { src: 'agent', agentId: this.agentId },
        'ensureConnections called without entities'
      );
      return;
    }
    if (!rooms || rooms.length === 0) {
      this.logger.error(
        { src: 'agent', agentId: this.agentId },
```