# 12812d74:packages_core_src_runtime.ts:751-900

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:751-900
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
    message: Memory,
    responses: Memory[],
    state?: State,
    callback?: HandlerCallback,
    processOptions?: { onStreamChunk?: (chunk: string, messageId?: UUID) => Promise<void> }
  ): Promise<void> {
    // Determine if we have multiple actions to execute
    const allActions: string[] = [];
    for (const response of responses) {
      if (response.content?.actions && response.content.actions.length > 0) {
        allActions.push(...response.content.actions);
      }
    }

    const hasMultipleActions = allActions.length > 1;
    const parentRunId = this.getCurrentRunId();
    const runId = this.createRunId();

    // Create action plan if multiple actions
    let actionPlan: {
      runId: UUID;
      totalSteps: number;
      currentStep: number;
      steps: Array<{
        action: string;
        status: 'pending' | 'completed' | 'failed';
        result?: ActionResult;
        error?: string;
      }>;
      thought: string;
      startTime: number;
    } | undefined = undefined;

    const thought =
      responses[0]?.content?.thought ||
      `Executing ${allActions.length} actions: ${allActions.join(', ')}`;

    if (hasMultipleActions) {
      // Extract thought from response content

      actionPlan = {
        runId,
        totalSteps: allActions.length,
        currentStep: 0,
        steps: allActions.map((action) => ({
          action,
          status: 'pending' as const,
        })),
        thought,
        startTime: Date.now(),
      };
    }

    let actionIndex = 0;

    for (const response of responses) {
      if (!response.content?.actions || response.content.actions.length === 0) {
        this.logger.warn({ src: 'agent', agentId: this.agentId }, 'No action found in response');
        continue;
      }
      const actions = response.content.actions;

      const actionResults: ActionResult[] = [];
      let accumulatedState = state;

      function normalizeAction(actionString: string) {
        return actionString.toLowerCase().replace(/_/g, '');
      }
      this.logger.trace(
        {
          src: 'agent',
          agentId: this.agentId,
          actions: this.actions.map((a) => normalizeAction(a.name)),
        },
        'Available actions'
      );

      for (const responseAction of actions) {
        // Update current step in plan immutably
        if (actionPlan) {
          actionPlan = this.updateActionPlan(actionPlan, { currentStep: actionIndex + 1 });
        }

        // Compose state with previous action results and plan
        accumulatedState = await this.composeState(message, [
          'RECENT_MESSAGES',
          'ACTION_STATE', // This will include the action plan
        ]);

        // Add action plan to state if it exists
        if (actionPlan && accumulatedState.data) {
          accumulatedState.data.actionPlan = actionPlan;
          accumulatedState.data.actionResults = actionResults;
        }

        this.logger.debug(
          { src: 'agent', agentId: this.agentId, action: responseAction },
          'Processing action'
        );
        const normalizedResponseAction = normalizeAction(responseAction);

        // First try exact match
        let action = this.actions.find(
          (a: { name: string }) => normalizeAction(a.name) === normalizedResponseAction
        );

        if (!action) {
          // Then try fuzzy matching
          action = this.actions.find(
            (a: { name: string }) =>
              normalizeAction(a.name).includes(normalizedResponseAction) ||
              normalizedResponseAction.includes(normalizeAction(a.name))
          );
        }

        if (!action) {
          // Try similes
          for (const _action of this.actions) {
            const exactSimileMatch = _action.similes?.find(
              (simile) => normalizeAction(simile) === normalizedResponseAction
            );

            if (exactSimileMatch) {
              action = _action;
              this.logger.debug(
                { src: 'agent', agentId: this.agentId, action: action.name, match: 'simile' },
                'Action resolved via simile'
              );
              break;
            }

            const fuzzySimileMatch = _action.similes?.find(
              (simile) =>
                normalizeAction(simile).includes(normalizedResponseAction) ||
                normalizedResponseAction.includes(normalizeAction(simile))
            );

            if (fuzzySimileMatch) {
              action = _action;
              this.logger.debug(
                { src: 'agent', agentId: this.agentId, action: action.name, match: 'fuzzy' },
                'Action resolved via fuzzy match'
              );
              break;
            }
          }
        }
        if (!action) {
          const errorMsg = `Action not found: ${responseAction}`;
          this.logger.error(
```