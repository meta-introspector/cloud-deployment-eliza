# a7046c18:packages_core_typescript_src_runtime.ts:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
            const existingActionResults = Array.isArray(
              accumulatedState.data?.actionResults,
            )
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
            if (!accumulatedState.data.workingMemory)
              accumulatedState.data.workingMemory = {};

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
                sorted.slice(0, this.maxWorkingMemoryEntries),
              );
            }
          }

          // Update plan with success immutably
          if (actionPlan?.steps[actionIndex]) {
            actionPlan = this.updateActionStep(actionPlan, actionIndex, {
              status: "completed",
              result: actionResult,
            });
          }
        }

        const isSuccess = actionResult?.success !== false;
        const statusText = isSuccess ? "completed" : "failed";

        await this.emitEvent(EventType.ACTION_COMPLETED, {
          messageId: actionId,
          roomId: message.roomId,
          world: message.worldId,
          content: {
            // Use action's actual text, not status message (prevents overwriting streamed content)
            text: actionResult?.text || "",
            actions: [action.name],
            actionStatus: statusText,
            actionId: actionId,
            type: "agent_action",
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

        // Store action result as memory
        const actionMemory: Memory = {
          id: actionId,
          entityId: this.agentId,
          roomId: message.roomId,
          worldId: message.worldId,
          content: {
            text: actionResult?.text || `Executed action: ${action.name}`,
            source: "action",
            type: "action_result",
            actionName: action.name,
            actionStatus: actionResult?.success ? "completed" : "failed",
            actionResult: isLegacyReturn ? { legacy: result } : actionResult,
            runId,
            ...(actionPlan && {
              planStep: `${actionPlan.currentStep}/${actionPlan.totalSteps}`,
              planThought: actionPlan.thought,
            }),
          },
          metadata: {
            type: "action_result",
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
        await this.createMemory(actionMemory, "messages");

        this.logger.debug(
          { src: "agent", agentId: this.agentId, action: action.name },
          "Action completed",
        );

        // log to database with collected prompts
        await this.adapter.log({
          entityId: message.entityId,
          roomId: message.roomId,
          type: "action",
          body: {
            action: action.name,
            actionId,
            message: message.content.text,
            messageId: message.id,
            state: accumulatedState,
            responses,
```