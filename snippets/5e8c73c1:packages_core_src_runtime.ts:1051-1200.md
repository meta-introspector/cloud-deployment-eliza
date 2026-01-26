# 5e8c73c1:packages_core_src_runtime.ts:1051-1200

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:1051-1200
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
            const existingActionResults = Array.isArray(accumulatedState.data?.actionResults)
              ? accumulatedState.data.actionResults
              : [];
            accumulatedState = {
              ...accumulatedState,
              values: { ...accumulatedState.values, ...actionResult.values },
              data: {
                ...(accumulatedState.data || {}),
                actionResults: [...existingActionResults, actionResult],
                actionPlan,
              },
            };
          }

          // Store in working memory (in state data) with cleanup
          if (actionResult && accumulatedState.data) {
            if (!accumulatedState.data.workingMemory) accumulatedState.data.workingMemory = {};

            // Add new entry first, then clean up if we exceed the limit
            const responseAction = actionResult.data?.actionName || action.name;
            const memoryKey = `action_${responseAction}_${uuidv4()}`;
            const memoryEntry: WorkingMemoryEntry = {
              actionName: action.name,
              result: actionResult,
              timestamp: Date.now(),
            };
            const workingMemory = accumulatedState.data.workingMemory as Record<
              string,
              WorkingMemoryEntry
            >;
            workingMemory[memoryKey] = memoryEntry;

            // Clean up old entries if we now exceed the limit
            const entries = Object.entries(workingMemory);
            if (entries.length > this.maxWorkingMemoryEntries) {
              // Sort by timestamp (newest first) and keep only the most recent entries
              const sorted = entries.sort((a, b) => {
                const entryA = a[1] as WorkingMemoryEntry | null;
                const entryB = b[1] as WorkingMemoryEntry | null;
                const timestampA = entryA?.timestamp ?? 0;
                const timestampB = entryB?.timestamp ?? 0;
                return timestampB - timestampA;
              });
              // Keep exactly maxWorkingMemoryEntries entries (including the new one we just added)
              accumulatedState.data.workingMemory = Object.fromEntries(
                sorted.slice(0, this.maxWorkingMemoryEntries)
              );
            }
          }

          // Update plan with success immutably
          if (actionPlan && actionPlan.steps[actionIndex]) {
            actionPlan = this.updateActionStep(actionPlan, actionIndex, {
              status: 'completed',
              result: actionResult,
            });
          }
        }

        const isSuccess = actionResult?.success !== false;
        const statusText = isSuccess ? 'completed' : 'failed';

        await this.emitEvent(EventType.ACTION_COMPLETED, {
          messageId: actionId,
          roomId: message.roomId,
          world: message.worldId,
          content: {
            // Use action's actual text, not status message (prevents overwriting streamed content)
            text: actionResult?.text || '',
            actions: [action.name],
            actionStatus: statusText,
            actionId: actionId,
            type: 'agent_action',
            thought: thought,
            actionResult: actionResult,
            source: message.content?.source, // Include original message source
          },
        });

        if (callback) {
          for (const content of storedCallbackData) {
            await callback(content);
          }
        }

```