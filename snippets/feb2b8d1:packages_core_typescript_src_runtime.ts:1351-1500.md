# feb2b8d1:packages_core_typescript_src_runtime.ts:1351-1500

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:1351-1500
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
            state: accumulatedState,
            responses,
            result: isLegacyReturn ? { legacy: result } : actionResult,
            isLegacyReturn,
            prompts: (this.currentActionContext && this.currentActionContext.prompts) || [],
            promptCount: (this.currentActionContext && this.currentActionContext.prompts && this.currentActionContext.prompts.length) || 0,
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
    const cachedState = this.stateCache && this.stateCache.get(`${messageId}_action_results`);
    return (cachedState && cachedState.data && cachedState.data.actionResults as ActionResult[]) || [];
  }

  async evaluate(
    message: Memory,
    state: State,
    didRespond?: boolean,
    callback?: HandlerCallback,
    responses?: Memory[],
  ) {
    const evaluatorPromises = this.evaluators.map(
      async (evaluator: Evaluator) => {
        if (!evaluator.handler) {
          return null;
        }
        if (!didRespond && !evaluator.alwaysRun) {
          return null;
        }
        const result = await evaluator.validate(
          this as IAgentRuntime,
          message,
          state,
        );
        if (result) {
          return evaluator;
        }
        return null;
      },
    );
    const evaluators = (await Promise.all(evaluatorPromises)).filter(
      Boolean,
    ) as Evaluator[];
    if (evaluators.length === 0) {
      return [];
    }
    state = await this.composeState(message, ["RECENT_MESSAGES", "EVALUATORS"]);
    await Promise.all(
      evaluators.map(async (evaluator) => {
        if (evaluator.handler) {
          await evaluator.handler(
            this as IAgentRuntime,
            message,
            state,
            {},
            callback,
            responses,
          );
          this.adapter.log({
            entityId: message.entityId,
            roomId: message.roomId,
            type: "evaluator",
            body: {
              evaluator: evaluator.name,
              messageId: message.id,
              message: message.content.text,
              state,
              runId: this.getCurrentRunId(),
            },
          });
        }
      }),
    );
    return evaluators;
  }

  // highly SQL optimized queries
  async ensureConnections(
    entities: Entity[],
    rooms: Room[],
    source: string,
    world: World,
  ): Promise<void> {
    // guards
    if (!entities) {
      this.logger.error(
        { src: "agent", agentId: this.agentId },
        "ensureConnections called without entities",
      );
      return;
    }
    if (!rooms || rooms.length === 0) {
      this.logger.error(
        { src: "agent", agentId: this.agentId },
        "ensureConnections called without rooms",
      );
      return;
    }

    // Create/ensure the world exists for this server
    await this.ensureWorldExists({ ...world, agentId: this.agentId });

    const firstRoom = rooms[0];

    // Helper function for chunking arrays
    const chunkArray = <T>(arr: T[], size: number): T[][] =>
      arr.reduce((chunks: T[][], item: T, i: number) => {
        if (i % size === 0) chunks.push([]);
        chunks[chunks.length - 1].push(item);
        return chunks;
      }, []);

    // Step 1: Create all rooms FIRST (before adding any participants)
    const roomIds = rooms.map((r: { id: UUID }) => r.id);
    const roomExistsCheck = await this.getRoomsByIds(roomIds);
    const roomsIdExists = roomExistsCheck && roomExistsCheck.map((r: { id: UUID }) => r.id);
    const roomsToCreate = roomIds.filter(
      (id: UUID) => !(roomsIdExists && roomsIdExists.includes(id)),
    );

    const rf = {
      worldId: world.id,
      messageServerId: world.messageServerId,
      source,
      agentId: this.agentId,
    };

```