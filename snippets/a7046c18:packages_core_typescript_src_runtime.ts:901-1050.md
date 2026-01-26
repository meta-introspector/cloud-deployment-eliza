# a7046c18:packages_core_typescript_src_runtime.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      };
    }

    let actionIndex = 0;

    for (const response of responses) {
      if (!response.content?.actions || response.content.actions.length === 0) {
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
            const exactSimileMatch = _action.similes?.find(
              (simile) => normalizeAction(simile) === normalizedResponseAction,
            );

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

            const fuzzySimileMatch = _action.similes?.find(
              (simile) =>
                normalizeAction(simile).includes(normalizedResponseAction) ||
                normalizedResponseAction.includes(normalizeAction(simile)),
            );

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

          if (actionPlan?.steps[actionIndex]) {
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
          );
```