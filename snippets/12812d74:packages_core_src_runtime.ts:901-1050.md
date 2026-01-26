# 12812d74:packages_core_src_runtime.ts:901-1050

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:901-1050
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
            { src: 'agent', agentId: this.agentId, action: responseAction },
            'Action not found'
          );

          if (actionPlan && actionPlan.steps[actionIndex]) {
            actionPlan = this.updateActionStep(actionPlan, actionIndex, {
              status: 'failed',
              error: errorMsg,
            });
          }

          const actionMemory: Memory = {
            id: uuidv4() as UUID,
            entityId: message.entityId,
            roomId: message.roomId,
            worldId: message.worldId,
            content: {
              thought: errorMsg,
              source: 'auto',
              type: 'action_result',
              actionName: responseAction,
              actionStatus: 'failed',
              runId,
            },
          };
          await this.createMemory(actionMemory, 'messages');
          actionIndex++;
          continue;
        }
        if (!action.handler) {
          this.logger.error(
            { src: 'agent', agentId: this.agentId, action: action.name },
            'Action has no handler'
          );

          // Update plan with error immutably
          if (actionPlan && actionPlan.steps[actionIndex]) {
            actionPlan = this.updateActionStep(actionPlan, actionIndex, {
              status: 'failed',
              error: 'No handler',
            });
          }

          actionIndex++;
          continue;
        }
        this.logger.debug({ src: 'agent', agentId: this.agentId, action: action.name }, 'Executing action');

        const actionId = uuidv4() as UUID;
        this.currentActionContext = {
          actionName: action.name,
          actionId,
          prompts: [],
        };

        // Create action context with plan information
        const actionContext: ActionContext = {
          previousResults: actionResults,
          getPreviousResult: (actionName: string) => {
            return actionResults.find((r) => r.data?.actionName === actionName);
          },
        };

        // Add plan information to options if multiple actions
        const options: HandlerOptions = {
          actionContext: actionContext,
        };

        if (actionPlan) {
          options.actionPlan = {
            totalSteps: actionPlan.totalSteps,
            currentStep: actionPlan.currentStep,
            steps: actionPlan.steps,
            thought: actionPlan.thought,
          };
        }

        // Pass streaming callback to action handlers
        if (processOptions?.onStreamChunk) {
          options.onStreamChunk = processOptions.onStreamChunk;
        }

        await this.emitEvent(EventType.ACTION_STARTED, {
          messageId: actionId,
          roomId: message.roomId,
          world: message.worldId,
          content: {
            text: `Executing action: ${action.name}`,
            actions: [action.name],
            actionStatus: 'executing',
            actionId: actionId,
            runId: runId,
            type: 'agent_action',
            thought: thought,
            source: message.content?.source,
          },
        });

        let storedCallbackData: Content[] = [];

        const storageCallback = async (response: Content) => {
          storedCallbackData.push(response);
          return [];
        };

        // Execute action with context
        const result = await action.handler(
          this as IAgentRuntime,
          message,
          accumulatedState,
          options,
          storageCallback,
          responses
        );

        // Handle backward compatibility for void, null, true, false returns
        const isLegacyReturn =
          result === undefined || result === null || typeof result === 'boolean';

        // Only create ActionResult if we have a proper result
        let actionResult: ActionResult | null = null;

        if (!isLegacyReturn) {
          // Ensure we have an ActionResult with required success field
          if (
            typeof result === 'object' &&
            result !== null &&
            ('values' in result || 'data' in result || 'text' in result)
          ) {
            // Ensure success field exists with default true
            actionResult = {
              ...result,
              success: 'success' in result ? result.success : true, // Default to true if not specified
            } as ActionResult;
          } else {
            actionResult = {
              success: true, // Default success for legacy results
              data: {
                actionName: action.name,
                legacyResult: result,
              },
            };
          }

          actionResults.push(actionResult);

          // Merge returned values into state
          if (actionResult.values) {
            const existingActionResults = Array.isArray(accumulatedState.data?.actionResults) ? accumulatedState.data.actionResults : [];
            accumulatedState = {
```