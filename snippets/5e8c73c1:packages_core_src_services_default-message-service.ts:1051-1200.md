# 5e8c73c1:packages_core_src_services_default-message-service.ts:1051-1200

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/services/default-message-service.ts:1051-1200
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
      mode: isSimple && responseContent.text ? 'simple' : 'actions',
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
    responseId: UUID
  ): Promise<StrategyResult> {
    const traceActionResult: MultiStepActionResult[] = [];
    let accumulatedState: MultiStepState = state as MultiStepState;
    let iterationCount = 0;

    while (iterationCount < opts.maxMultiStepIterations) {
      iterationCount++;
      runtime.logger.debug(
        {
          src: 'service:message',
          iteration: iterationCount,
          maxIterations: opts.maxMultiStepIterations,
        },
        'Starting multi-step iteration'
      );

      accumulatedState = (await runtime.composeState(message, [
        'RECENT_MESSAGES',
        'ACTION_STATE',
      ])) as MultiStepState;
      accumulatedState.data.actionResults = traceActionResult;

      const prompt = composePromptFromState({
        state: accumulatedState,
        template:
          runtime.character.templates?.multiStepDecisionTemplate || multiStepDecisionTemplate,
      });

      const stepResultRaw = await runtime.useModel(ModelType.TEXT_LARGE, { prompt });
      const parsedStep = parseKeyValueXml(stepResultRaw);

      if (!parsedStep) {
        runtime.logger.warn(
          { src: 'service:message', iteration: iterationCount },
          'Failed to parse multi-step result'
        );
        traceActionResult.push({
          data: { actionName: 'parse_error' },
          success: false,
          error: 'Failed to parse step result',
        });
        break;
      }

      const thought = typeof parsedStep.thought === 'string' ? parsedStep.thought : undefined;
      const providers = Array.isArray(parsedStep.providers) ? parsedStep.providers : [];
      const action = typeof parsedStep.action === 'string' ? parsedStep.action : undefined;
      const isFinish = parsedStep.isFinish;

      // Check for completion condition
      if (isFinish === 'true' || isFinish === true) {
        runtime.logger.info(
          { src: 'service:message', agentId: runtime.agentId, iteration: iterationCount },
          'Multi-step task completed'
        );
        if (callback) {
          await callback({
            text: '',
            thought: typeof thought === 'string' ? thought : '',
          });
        }
        break;
      }

      // Validate that we have something to do
      const providersArray = Array.isArray(providers) ? providers : [];
      if ((!providersArray || providersArray.length === 0) && !action) {
        runtime.logger.warn(
          { src: 'service:message', iteration: iterationCount },
          'No providers or action specified, forcing completion'
        );
        break;
      }

      for (const providerName of providersArray) {
        if (typeof providerName !== 'string') continue;
        const provider = runtime.providers.find((p) => p.name === providerName);
        if (!provider) {
          runtime.logger.warn({ src: 'service:message', providerName }, 'Provider not found');
          traceActionResult.push({
            data: { actionName: providerName },
            success: false,
            error: `Provider not found: ${providerName}`,
          });
          continue;
        }

        const providerResult = await provider.get(runtime, message, state);
        if (!providerResult) {
          runtime.logger.warn(
            { src: 'service:message', providerName },
            'Provider returned no result'
          );
          traceActionResult.push({
            data: { actionName: providerName },
            success: false,
            error: `Provider returned no result`,
          });
          continue;
        }

        const success = !!providerResult.text;

        traceActionResult.push({
          data: { actionName: providerName },
          success,
          text: success ? providerResult.text : undefined,
          error: success ? undefined : 'Provider returned no result',
        });

        if (callback) {
          await callback({
            text: `🔎 Provider executed: ${providerName}`,
            actions: [providerName],
            thought: typeof thought === 'string' ? thought : '',
          });
        }
      }

```