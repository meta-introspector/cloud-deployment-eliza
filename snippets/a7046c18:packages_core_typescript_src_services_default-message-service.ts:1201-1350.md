# a7046c18:packages_core_typescript_src_services_default-message-service.ts:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          "Missing required fields (thought or actions), retrying",
        );
      }
    }

    if (!responseContent) {
      return {
        responseContent: null,
        responseMessages: [],
        state,
        mode: "none",
      };
    }

    // LLM IGNORE/REPLY ambiguity handling
    if (responseContent.actions && responseContent.actions.length > 1) {
      const isIgnore = (a: unknown) =>
        typeof a === "string" && a.toUpperCase() === "IGNORE";
      const hasIgnore = responseContent.actions.some(isIgnore);

      if (hasIgnore) {
        if (!responseContent.text || responseContent.text.trim() === "") {
          responseContent.actions = ["IGNORE"];
        } else {
          const filtered = responseContent.actions.filter((a) => !isIgnore(a));
          responseContent.actions = filtered.length ? filtered : ["REPLY"];
        }
      }
    }

    // Automatically determine if response is simple
    const isSimple =
      responseContent.actions?.length === 1 &&
      typeof responseContent.actions[0] === "string" &&
      responseContent.actions[0].toUpperCase() === "REPLY" &&
      (!responseContent.providers || responseContent.providers.length === 0);

    responseContent.simple = isSimple;
    // Include message ID for streaming coordination (so broadcast uses same ID)
    responseContent.responseId = responseId;

    const responseMessages: Memory[] = [
      {
        id: responseId,
        entityId: runtime.agentId,
        agentId: runtime.agentId,
        content: responseContent,
        roomId: message.roomId,
        createdAt: Date.now(),
      },
    ];

    return {
      responseContent,
      responseMessages,
      state,
      mode: isSimple && responseContent.text ? "simple" : "actions",
    };
  }

  /**
   * Multi-step strategy: iterative action execution with final summary
   */
  private async runMultiStepCore(
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    callback: HandlerCallback | undefined,
    opts: ResolvedMessageOptions,
    responseId: UUID,
  ): Promise<StrategyResult> {
    const traceActionResult: MultiStepActionResult[] = [];
    let accumulatedState: MultiStepState = state as MultiStepState;
    let iterationCount = 0;

    while (iterationCount < opts.maxMultiStepIterations) {
      iterationCount++;
      runtime.logger.debug(
        {
          src: "service:message",
          iteration: iterationCount,
          maxIterations: opts.maxMultiStepIterations,
        },
        "Starting multi-step iteration",
      );

      accumulatedState = (await runtime.composeState(message, [
        "RECENT_MESSAGES",
        "ACTION_STATE",
      ])) as MultiStepState;
      accumulatedState.data.actionResults = traceActionResult;

      const prompt = composePromptFromState({
        state: accumulatedState,
        template:
          runtime.character.templates?.multiStepDecisionTemplate ||
          multiStepDecisionTemplate,
      });

      const stepResultRaw = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt,
      });
      const parsedStep = parseKeyValueXml(stepResultRaw);

      if (!parsedStep) {
        runtime.logger.warn(
          { src: "service:message", iteration: iterationCount },
          "Failed to parse multi-step result",
        );
        traceActionResult.push({
          data: { actionName: "parse_error" },
          success: false,
          error: "Failed to parse step result",
        });
        break;
      }

      const thought =
        typeof parsedStep.thought === "string" ? parsedStep.thought : undefined;
      const providers = Array.isArray(parsedStep.providers)
        ? parsedStep.providers
        : [];
      const action =
        typeof parsedStep.action === "string" ? parsedStep.action : undefined;
      const isFinish = parsedStep.isFinish;

      // Check for completion condition
      if (isFinish === "true" || isFinish === true) {
        runtime.logger.info(
          {
            src: "service:message",
            agentId: runtime.agentId,
            iteration: iterationCount,
          },
          "Multi-step task completed",
        );
        if (callback) {
          await callback({
            text: "",
            thought: typeof thought === "string" ? thought : "",
          });
        }
        break;
      }

      // Validate that we have something to do
      const providersArray = Array.isArray(providers) ? providers : [];
      if ((!providersArray || providersArray.length === 0) && !action) {
        runtime.logger.warn(
          { src: "service:message", iteration: iterationCount },
```