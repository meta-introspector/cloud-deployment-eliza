# 5e8c73c1:packages_core_src_services_default-message-service.ts:1201-1350

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/services/default-message-service.ts:1201-1350
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      if (action) {
        const actionContent = {
          text: `🔎 Executing action: ${action}`,
          actions: [action],
          thought: thought || '',
        };

        await runtime.processActions(
          message,
          [
            {
              id: v4() as UUID,
              entityId: runtime.agentId,
              roomId: message.roomId,
              createdAt: Date.now(),
              content: actionContent,
            },
          ],
          state,
          async () => {
            return [];
          }
        );

        // Get cached action results from runtime
        const cachedState = runtime.stateCache?.get(`${message.id}_action_results`);
        const actionResults = Array.isArray(cachedState?.values?.actionResults)
          ? cachedState.values.actionResults
          : [];
        const result =
          actionResults.length > 0 &&
          typeof actionResults[0] === 'object' &&
          actionResults[0] !== null
            ? actionResults[0]
            : null;
        const success =
          result && 'success' in result && typeof result.success === 'boolean'
            ? result.success
            : false;

        traceActionResult.push({
          data: { actionName: typeof action === 'string' ? action : 'unknown' },
          success,
          text:
            result && 'text' in result && typeof result.text === 'string' ? result.text : undefined,
          values:
            result &&
            'values' in result &&
            typeof result.values === 'object' &&
            result.values !== null
              ? result.values
              : undefined,
          error: success
            ? undefined
            : result && 'text' in result && typeof result.text === 'string'
              ? result.text
              : undefined,
        });
      }
    }

    if (iterationCount >= opts.maxMultiStepIterations) {
      runtime.logger.warn(
        { src: 'service:message', maxIterations: opts.maxMultiStepIterations },
        'Reached maximum iterations, forcing completion'
      );
    }

    accumulatedState = (await runtime.composeState(message, [
      'RECENT_MESSAGES',
      'ACTION_STATE',
    ])) as MultiStepState;
    const summaryPrompt = composePromptFromState({
      state: accumulatedState,
      template: runtime.character.templates?.multiStepSummaryTemplate || multiStepSummaryTemplate,
    });

    const finalOutput = await runtime.useModel(ModelType.TEXT_LARGE, {
      prompt: summaryPrompt,
    });
    const summary = parseKeyValueXml(finalOutput);

    let responseContent: Content | null = null;
    const summaryText = summary?.text;
    if (typeof summaryText === 'string' && summaryText) {
      responseContent = {
        actions: ['MULTI_STEP_SUMMARY'],
        text: summaryText,
        thought:
          (typeof summary.thought === 'string'
            ? summary.thought
            : 'Final user-facing message after task completion.') ||
          'Final user-facing message after task completion.',
        simple: true,
        responseId,
      };
    }

    const responseMessages: Memory[] = responseContent
      ? [
          {
            id: responseId,
            entityId: runtime.agentId,
            agentId: runtime.agentId,
            content: responseContent,
            roomId: message.roomId,
            createdAt: Date.now(),
          },
        ]
      : [];

    return {
      responseContent,
      responseMessages,
      state: accumulatedState,
      mode: responseContent ? 'simple' : 'none',
    };
  }

  /**
   * Helper to emit run ended events
   */
  private async emitRunEnded(
    runtime: IAgentRuntime,
    runId: UUID,
    message: Memory,
    startTime: number,
    status: string
  ): Promise<void> {
    await runtime.emitEvent(EventType.RUN_ENDED, {
      runtime,
      source: 'messageHandler',
      runId,
      messageId: message.id,
      roomId: message.roomId,
      entityId: message.entityId,
      startTime,
      status: status as 'completed' | 'timeout',
      endTime: Date.now(),
      duration: Date.now() - startTime,
    } as RunEventPayload);
  }

  /**
   * Deletes a message from the agent's memory.
   * This method handles the actual deletion logic that was previously in event handlers.
   *
   * @param runtime - The agent runtime instance
   * @param message - The message memory to delete
   * @returns Promise resolving when deletion is complete
```