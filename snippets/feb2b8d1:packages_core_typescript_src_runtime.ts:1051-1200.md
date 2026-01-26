# feb2b8d1:packages_core_typescript_src_runtime.ts:1051-1200

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:1051-1200
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
          );

          // Update plan with error immutably
          if (actionPlan && actionPlan.steps && actionPlan.steps[actionIndex]) {
            actionPlan = this.updateActionStep(actionPlan, actionIndex, {
              status: "failed",
              error: "No handler",
            });
          }

          actionIndex++;
          continue;
        }
        this.logger.debug(
          { src: "agent", agentId: this.agentId, action: action.name },
          "Executing action",
        );

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
            return actionResults.find((r) => r.data && r.data.actionName === actionName);
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
        if (processOptions && processOptions.onStreamChunk) {
          options.onStreamChunk = processOptions.onStreamChunk;
        }

        await this.emitEvent(EventType.ACTION_STARTED, {
          messageId: actionId,
          roomId: message.roomId,
          world: message.worldId,
          content: {
            text: `Executing action: ${action.name}`,
            actions: [action.name],
            actionStatus: "executing",
            actionId: actionId,
            runId: runId,
            type: "agent_action",
            thought: thought,
            source: (message.content && message.content.source),
          },
        });

        const storedCallbackData: Content[] = [];

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
        let actionStreamingContext:
          | {
              messageId: UUID;
              onStreamChunk: (chunk: string, messageId?: UUID) => Promise<void>;
              onStreamEnd: () => void;
            }
          | undefined;
        if (processOptions && processOptions.onStreamChunk) {
          let currentFilter: ActionStreamFilter | null = null;
          const onStreamChunk = processOptions.onStreamChunk;

          actionStreamingContext = {
            messageId: responseMessageId,
            onStreamChunk: async (chunk: string, msgId?: UUID) => {
              if (!currentFilter) {
                currentFilter = new ActionStreamFilter();
              }
              const textToStream = currentFilter.push(chunk);
              if (textToStream && onStreamChunk) {
                await onStreamChunk(textToStream, msgId);
              }
            },
            onStreamEnd: () => {
              // Reset filter for next useModel call
              currentFilter = null;
            },
          };
        }

        // Execute action with its own streaming context
        const result = await runWithStreamingContext(
          actionStreamingContext,
          () =>
            action.handler(
              this as IAgentRuntime,
              message,
              accumulatedState,
              options,
              storageCallback,
              responses,
            ),
        );

        // Handle backward compatibility for void, null, true, false returns
        const isLegacyReturn =
          result === undefined ||
          result === null ||
          typeof result === "boolean";

        // Only create ActionResult if we have a proper result
        let actionResult: ActionResult | null = null;

        if (!isLegacyReturn) {
          // Ensure we have an ActionResult with required success field
          if (
            typeof result === "object" &&
            result !== null &&
            ("values" in result || "data" in result || "text" in result)
          ) {
            // Ensure success field exists with default true
            actionResult = {
              ...result,
              success: "success" in result ? result.success : true, // Default to true if not specified
            } as ActionResult;
```