# a69475c0:packages_core_src_runtime.ts:901-1050

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:901-1050
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
          this.logger.error(
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
        // Separate ID for streamed response message (independent from action badge)
        const responseMessageId = uuidv4() as UUID;

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
          // Use responseMessageId for the text response (separate from action badge)
          response.responseId = responseMessageId;
          storedCallbackData.push(response);
          return [];
        };

        // Create streaming context using responseMessageId (separate from actionId)
        // This ensures streamed text goes to its own message, independent from action badge
        //
        // Actions may have multiple useModel calls (e.g., JSON extraction + text generation).
        // onStreamEnd is called after each useModel stream completes, allowing us to reset
        // the filter so content type detection from one call doesn't affect the next.
        let actionStreamingContext: { messageId: UUID; onStreamChunk: (chunk: string, messageId?: UUID) => Promise<void>; onStreamEnd: () => void } | undefined;
        if (processOptions?.onStreamChunk) {
          let currentFilter: ActionStreamFilter | null = null;

          actionStreamingContext = {
            messageId: responseMessageId,
            onStreamChunk: async (chunk: string, msgId?: UUID) => {
              if (!currentFilter) {
                currentFilter = new ActionStreamFilter();
              }
              const textToStream = currentFilter.push(chunk);
              if (textToStream) {
                await processOptions.onStreamChunk!(textToStream, msgId);
              }
            },
            onStreamEnd: () => {
              // Reset filter for next useModel call
              currentFilter = null;
            },
          };
        }

        // Execute action with its own streaming context
        const result = await runWithStreamingContext(actionStreamingContext, () =>
          action.handler(
            this as IAgentRuntime,
            message,
            accumulatedState,
            options,
            storageCallback,
            responses
          )
        );
```