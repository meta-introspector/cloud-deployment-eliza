# a69475c0:packages_core_src_services_default-message-service.ts:901-1050

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:901-1050
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    responseId: UUID
  ): Promise<StrategyResult> {
    state = await runtime.composeState(message, ['ACTIONS']);

    if (!state.values?.actionNames) {
      runtime.logger.warn({ src: 'service:message' }, 'actionNames data missing from state');
    }

    const prompt = composePromptFromState({
      state,
      template: runtime.character.templates?.messageHandlerTemplate || messageHandlerTemplate,
    });

    let responseContent: Content | null = null;

    // Retry if missing required fields
    let retries = 0;

    while (retries < opts.maxRetries && (!responseContent?.thought || !responseContent?.actions)) {
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt,
      });

      runtime.logger.info(
        { src: 'service:message', responseLength: response.length, responsePreview: response.substring(0, 500) },
        'Raw LLM response received'
      );

      const parsedXml = parseKeyValueXml(response);
      runtime.logger.info(
        {
          src: 'service:message',
          parsedXml: parsedXml ? {
            hasThought: !!parsedXml.thought,
            thoughtPreview: typeof parsedXml.thought === 'string' ? parsedXml.thought.substring(0, 100) : null,
            hasActions: !!parsedXml.actions,
            actions: parsedXml.actions,
            hasText: !!parsedXml.text,
            textPreview: typeof parsedXml.text === 'string' ? parsedXml.text.substring(0, 100) : null,
          } : null,
        },
        'Parsed XML content'
      );

      if (parsedXml) {
        const thought = typeof parsedXml.thought === 'string' ? parsedXml.thought : '';
        const actions = Array.isArray(parsedXml.actions)
          ? parsedXml.actions.filter((a): a is string => typeof a === 'string')
          : (typeof parsedXml.actions === 'string' ? [parsedXml.actions] : ['IGNORE']);
        const providers = Array.isArray(parsedXml.providers)
          ? parsedXml.providers.filter((p): p is string => typeof p === 'string')
          : [];
        const text = typeof parsedXml.text === 'string' ? parsedXml.text : '';
        const simple = typeof parsedXml.simple === 'boolean' ? parsedXml.simple : false;

        responseContent = {
          ...parsedXml,
          thought,
          actions,
          providers,
          text,
          simple,
        };
      } else {
        responseContent = null;
        runtime.logger.warn(
          { src: 'service:message', responsePreview: response.substring(0, 300) },
          'parseKeyValueXml returned null - XML parsing failed'
        );
      }

      retries++;
      if (!responseContent?.thought || !responseContent?.actions) {
        runtime.logger.warn(
          {
            src: 'service:message',
            retries,
            maxRetries: opts.maxRetries,
            hasThought: !!responseContent?.thought,
            hasActions: !!responseContent?.actions,
            actionsValue: responseContent?.actions,
          },
          'Missing required fields (thought or actions), retrying'
        );
      }
    }

    if (!responseContent) {
      return { responseContent: null, responseMessages: [], state, mode: 'none' };
    }

    // LLM IGNORE/REPLY ambiguity handling
    if (responseContent.actions && responseContent.actions.length > 1) {
      const isIgnore = (a: unknown) => typeof a === 'string' && a.toUpperCase() === 'IGNORE';
      const hasIgnore = responseContent.actions.some(isIgnore);

      if (hasIgnore) {
        if (!responseContent.text || responseContent.text.trim() === '') {
          responseContent.actions = ['IGNORE'];
        } else {
          const filtered = responseContent.actions.filter((a) => !isIgnore(a));
          responseContent.actions = filtered.length ? filtered : ['REPLY'];
        }
      }
    }

    // Automatically determine if response is simple
    const isSimple =
      responseContent.actions?.length === 1 &&
      typeof responseContent.actions[0] === 'string' &&
      responseContent.actions[0].toUpperCase() === 'REPLY' &&
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
```