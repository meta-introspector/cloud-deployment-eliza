# 12812d74:packages_core_src_services_default-message-service.ts:301-450

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:301-450
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```

      // Check if LLM is off by default
      const agentUserState = await runtime.getParticipantUserState(message.roomId, runtime.agentId);
      const defLllmOff = parseBooleanFromText(String(runtime.getSetting('BOOTSTRAP_DEFLLMOFF') || ''));

      if (defLllmOff && agentUserState === null) {
        runtime.logger.debug({ src: 'service:message' }, 'LLM is off by default');
        await this.emitRunEnded(runtime, runId, message, startTime, 'off');
        return {
          didRespond: false,
          responseContent: null,
          responseMessages: [],
          state: { values: {}, data: {}, text: '' } as State,
          mode: 'none',
        };
      }

      // Check if room is muted
      if (
        agentUserState === 'MUTED' &&
        !message.content.text?.toLowerCase().includes(runtime.character.name.toLowerCase())
      ) {
        runtime.logger.debug(
          { src: 'service:message', roomId: message.roomId },
          'Ignoring muted room'
        );
        await this.emitRunEnded(runtime, runId, message, startTime, 'muted');
        return {
          didRespond: false,
          responseContent: null,
          responseMessages: [],
          state: { values: {}, data: {}, text: '' } as State,
          mode: 'none',
        };
      }

      // Compose initial state
      let state = await runtime.composeState(
        message,
        ['ANXIETY', 'ENTITIES', 'CHARACTER', 'RECENT_MESSAGES', 'ACTIONS'],
        true
      );

      // Get room and mention context
      const mentionContext = message.content.mentionContext;
      const room = await runtime.getRoom(message.roomId);

      // Process attachments before deciding to respond
      if (message.content.attachments && message.content.attachments.length > 0) {
        message.content.attachments = await this.processAttachments(
          runtime,
          message.content.attachments
        );
        if (message.id) {
          await runtime.updateMemory({ id: message.id, content: message.content });
        }
      }

      // Determine if we should respond
      const responseDecision = this.shouldRespond(
        runtime,
        message,
        room ?? undefined,
        mentionContext
      );

      runtime.logger.debug({ src: 'service:message', responseDecision }, 'Response decision');

      let shouldRespondToMessage = true;

      // If we can skip the evaluation, use the decision directly
      if (responseDecision.skipEvaluation) {
        runtime.logger.debug(
          {
            src: 'service:message',
            agentName: runtime.character.name,
            reason: responseDecision.reason,
          },
          'Skipping LLM evaluation'
        );
        shouldRespondToMessage = responseDecision.shouldRespond;
      } else {
        // Need LLM evaluation for ambiguous case
        const shouldRespondPrompt = composePromptFromState({
          state,
          template: runtime.character.templates?.shouldRespondTemplate || shouldRespondTemplate,
        });

        runtime.logger.debug(
          {
            src: 'service:message',
            agentName: runtime.character.name,
            reason: responseDecision.reason,
          },
          'Using LLM evaluation'
        );

        const response = await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: shouldRespondPrompt,
        });

        runtime.logger.debug({ src: 'service:message', response }, 'LLM evaluation result');

        const responseObject = parseKeyValueXml(response);
        runtime.logger.debug(
          { src: 'service:message', responseObject },
          'Parsed evaluation result'
        );

        // If an action is provided, the agent intends to respond in some way
        const nonResponseActions = ['IGNORE', 'NONE'];
        const actionValue = responseObject?.action;
        shouldRespondToMessage =
          typeof actionValue === 'string' &&
          !nonResponseActions.includes(actionValue.toUpperCase());
      }

      let responseContent: Content | null = null;
      let responseMessages: Memory[] = [];
      let mode: StrategyMode = 'none';

      if (shouldRespondToMessage) {
        const result = opts.useMultiStep
          ? await this.runMultiStepCore(runtime, message, state, callback, opts)
          : await this.runSingleShotCore(runtime, message, state, opts);

        responseContent = result.responseContent;
        responseMessages = result.responseMessages;
        state = result.state;
        mode = result.mode;

        // Race check before we send anything
        const currentResponseId = agentResponses.get(message.roomId);
        if (currentResponseId !== responseId) {
          runtime.logger.info(
            { src: 'service:message', agentId: runtime.agentId, roomId: message.roomId },
            'Response discarded - newer message being processed'
          );
          return {
            didRespond: false,
            responseContent: null,
            responseMessages: [],
            state,
            mode: 'none',
          };
        }

        if (responseContent && message.id) {
          responseContent.inReplyTo = createUniqueUuid(runtime, message.id);
        }
```