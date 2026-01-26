# a69475c0:packages_core_src_services_default-message-service.ts:1051-1200

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:1051-1200
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```

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
          runtime.logger.warn({ src: 'service:message', providerName }, 'Provider returned no result');
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
        const actionResults = Array.isArray(cachedState?.values?.actionResults) ? cachedState.values.actionResults : [];
        const result = actionResults.length > 0 && typeof actionResults[0] === 'object' && actionResults[0] !== null ? actionResults[0] : null;
        const success = result && 'success' in result && typeof result.success === 'boolean' ? result.success : false;

        traceActionResult.push({
          data: { actionName: typeof action === 'string' ? action : 'unknown' },
          success,
          text: result && 'text' in result && typeof result.text === 'string' ? result.text : undefined,
          values: result && 'values' in result && typeof result.values === 'object' && result.values !== null ? result.values : undefined,
          error: success ? undefined : (result && 'text' in result && typeof result.text === 'string' ? result.text : undefined),
        });
      }
```