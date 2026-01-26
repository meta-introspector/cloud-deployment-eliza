# feb2b8d1:packages_core_typescript_src_runtime.ts:901-1050

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:901-1050
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
        startTime: Date.now(),
      };
    }

    let actionIndex = 0;

    for (const response of responses) {
      if (!response.content || !response.content.actions || response.content.actions.length === 0) {
        this.logger.warn(
          { src: "agent", agentId: this.agentId },
          "No action found in response",
        );
        continue;
      }
      const actions = response.content.actions;

      const actionResults: ActionResult[] = [];
      let accumulatedState = state;

      function normalizeAction(actionString: string) {
        return actionString.toLowerCase().replace(/_/g, "");
      }
      this.logger.trace(
        {
          src: "agent",
          agentId: this.agentId,
          actions: this.actions.map((a) => normalizeAction(a.name)),
        },
        "Available actions",
      );

      for (const responseAction of actions) {
        // Update current step in plan immutably
        if (actionPlan) {
          actionPlan = this.updateActionPlan(actionPlan, {
            currentStep: actionIndex + 1,
          });
        }

        // Compose state with previous action results and plan
        accumulatedState = await this.composeState(message, [
          "RECENT_MESSAGES",
          "ACTION_STATE", // This will include the action plan
        ]);

        // Add action plan to state if it exists
        if (actionPlan && accumulatedState.data) {
          accumulatedState.data.actionPlan = actionPlan;
          accumulatedState.data.actionResults = actionResults;
        }

        this.logger.debug(
          { src: "agent", agentId: this.agentId, action: responseAction },
          "Processing action",
        );
        const normalizedResponseAction = normalizeAction(responseAction);

        // First try exact match
        let action = this.actions.find(
          (a: { name: string }) =>
            normalizeAction(a.name) === normalizedResponseAction,
        );

        if (!action) {
          // Then try fuzzy matching
          action = this.actions.find(
            (a: { name: string }) =>
              normalizeAction(a.name).includes(normalizedResponseAction) ||
              normalizedResponseAction.includes(normalizeAction(a.name)),
          );
        }

        if (!action) {
          // Try similes
          for (const _action of this.actions) {
            const exactSimileMatch = (_action.similes && _action.similes.find(
              (simile) => normalizeAction(simile) === normalizedResponseAction,
            ));

            if (exactSimileMatch) {
              action = _action;
              this.logger.debug(
                {
                  src: "agent",
                  agentId: this.agentId,
                  action: action.name,
                  match: "simile",
                },
                "Action resolved via simile",
              );
              break;
            }

            const fuzzySimileMatch = (_action.similes && _action.similes.find(
              (simile) =>
                normalizeAction(simile).includes(normalizedResponseAction) ||
                normalizedResponseAction.includes(normalizeAction(simile)),
            ));

            if (fuzzySimileMatch) {
              action = _action;
              this.logger.debug(
                {
                  src: "agent",
                  agentId: this.agentId,
                  action: action.name,
                  match: "fuzzy",
                },
                "Action resolved via fuzzy match",
              );
              break;
            }
          }
        }
        if (!action) {
          const errorMsg = `Action not found: ${responseAction}`;
          this.logger.error(
            { src: "agent", agentId: this.agentId, action: responseAction },
            "Action not found",
          );

          if (actionPlan && actionPlan.steps && actionPlan.steps[actionIndex]) {
            actionPlan = this.updateActionStep(actionPlan, actionIndex, {
              status: "failed",
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
              source: "auto",
              type: "action_result",
              actionName: responseAction,
              actionStatus: "failed",
              runId,
            },
          };
          await this.createMemory(actionMemory, "messages");
          actionIndex++;
          continue;
        }
        if (!action.handler) {
          this.logger.error(
            { src: "agent", agentId: this.agentId, action: action.name },
            "Action has no handler",
```