# 12812d74:packages_core_src_services_default-message-service.ts:601-750

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/services/default-message-service.ts:601-750
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
          };
        };
      }
      const actionsProvider =
        typeof providersData === 'object' && providersData !== null && 'ACTIONS' in providersData
          ? (providersData as ActionsProviderData).ACTIONS
          : undefined;
      const actionsData = actionsProvider?.data?.actionsData;
      const availableActions = Array.isArray(actionsData)
        ? actionsData.map((a: { name: string }) => a.name)
        : [-1];

      const logData = {
        at: date.toString(),
        timestamp: parseInt('' + date.getTime() / 1000),
        messageId: message.id,
        userEntityId: message.entityId,
        input: message.content.text,
        thought: responseContent?.thought,
        simple: responseContent?.simple,
        availableActions,
        actions: responseContent?.actions,
        providers: responseContent?.providers,
        irt: responseContent?.inReplyTo,
        output: responseContent?.text,
        entityName,
        source: message.content.source,
        channelType: message.content.channelType,
        roomName,
      };

      // Emit run ended event
      await runtime.emitEvent(EventType.RUN_ENDED, {
        runtime,
        source: 'messageHandler',
        runId,
        messageId: message.id,
        roomId: message.roomId,
        entityId: message.entityId,
        startTime,
        status: 'completed',
        endTime: Date.now(),
        duration: Date.now() - startTime,
      } as RunEventPayload);

      return {
        didRespond: shouldRespondToMessage,
        responseContent,
        responseMessages,
        state,
        mode,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      runtime.logger.error(
        { src: 'service:message', agentId: runtime.agentId, error },
        'Error processing message'
      );
      // Emit run ended event with error
      await runtime.emitEvent(EventType.RUN_ENDED, {
        runtime,
        source: 'messageHandler',
        runId,
        messageId: message.id,
        roomId: message.roomId,
        entityId: message.entityId,
        startTime,
        status: 'completed',
        endTime: Date.now(),
        duration: Date.now() - startTime,
        error: errorMessage,
      } as RunEventPayload);
      throw error;
    }
  }

  /**
   * Determines whether the agent should respond to a message.
   * Uses simple rules for obvious cases (DM, mentions) and defers to LLM for ambiguous cases.
   */
  shouldRespond(
    runtime: IAgentRuntime,
    message: Memory,
    room?: Room,
    mentionContext?: MentionContext
  ): ResponseDecision {
    if (!room) {
      return { shouldRespond: false, skipEvaluation: true, reason: 'no room context' };
    }

    function normalizeEnvList(value: unknown): string[] {
      if (!value || typeof value !== 'string') return [];
      const cleaned = value.trim().replace(/^\[|\]$/g, '');
      return cleaned
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }

    // Channel types that always trigger a response (private channels)
    const alwaysRespondChannels = [
      ChannelType.DM,
      ChannelType.VOICE_DM,
      ChannelType.SELF,
      ChannelType.API,
    ];

    // Sources that always trigger a response
    const alwaysRespondSources = ['client_chat'];

    // Support runtime-configurable overrides via env settings
    const customChannels = normalizeEnvList(
      runtime.getSetting('ALWAYS_RESPOND_CHANNELS') ||
      runtime.getSetting('SHOULD_RESPOND_BYPASS_TYPES')
    );
    const customSources = normalizeEnvList(
      runtime.getSetting('ALWAYS_RESPOND_SOURCES') ||
      runtime.getSetting('SHOULD_RESPOND_BYPASS_SOURCES')
    );

    const respondChannels = new Set(
      [...alwaysRespondChannels.map((t) => t.toString()), ...customChannels].map((s: string) =>
        s.trim().toLowerCase()
      )
    );

    const respondSources = [...alwaysRespondSources, ...customSources].map((s: string) =>
      s.trim().toLowerCase()
    );

    const roomType = room.type?.toString().toLowerCase();
    const sourceStr = message.content.source?.toLowerCase() || '';

    // 1. DM/VOICE_DM/API channels: always respond (private channels)
    if (respondChannels.has(roomType)) {
      return { shouldRespond: true, skipEvaluation: true, reason: `private channel: ${roomType}` };
    }

    // 2. Specific sources (e.g., client_chat): always respond
    if (respondSources.some((pattern) => sourceStr.includes(pattern))) {
      return {
        shouldRespond: true,
        skipEvaluation: true,
        reason: `whitelisted source: ${sourceStr}`,
      };
    }

    // 3. Platform mentions and replies: always respond
    const hasPlatformMention = !!(mentionContext?.isMention || mentionContext?.isReply);
    if (hasPlatformMention) {
```