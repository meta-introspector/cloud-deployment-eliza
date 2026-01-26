# a7046c18:packages_core_typescript_src_services_default-message-service.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        channelType: message.content.channelType,
        roomName,
      };

      // Emit run ended event
      await runtime.emitEvent(EventType.RUN_ENDED, {
        runtime,
        source: "messageHandler",
        runId,
        messageId: message.id,
        roomId: message.roomId,
        entityId: message.entityId,
        startTime,
        status: "completed",
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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      runtime.logger.error(
        { src: "service:message", agentId: runtime.agentId, error },
        "Error processing message",
      );
      // Emit run ended event with error
      await runtime.emitEvent(EventType.RUN_ENDED, {
        runtime,
        source: "messageHandler",
        runId,
        messageId: message.id,
        roomId: message.roomId,
        entityId: message.entityId,
        startTime,
        status: "completed",
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
    mentionContext?: MentionContext,
  ): ResponseDecision {
    if (!room) {
      return {
        shouldRespond: false,
        skipEvaluation: true,
        reason: "no room context",
      };
    }

    function normalizeEnvList(value: unknown): string[] {
      if (!value || typeof value !== "string") return [];
      const cleaned = value.trim().replace(/^\[|\]$/g, "");
      return cleaned
        .split(",")
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
    const alwaysRespondSources = ["client_chat"];

    // Support runtime-configurable overrides via env settings
    const customChannels = normalizeEnvList(
      runtime.getSetting("ALWAYS_RESPOND_CHANNELS") ||
        runtime.getSetting("SHOULD_RESPOND_BYPASS_TYPES"),
    );
    const customSources = normalizeEnvList(
      runtime.getSetting("ALWAYS_RESPOND_SOURCES") ||
        runtime.getSetting("SHOULD_RESPOND_BYPASS_SOURCES"),
    );

    const respondChannels = new Set(
      [
        ...alwaysRespondChannels.map((t) => t.toString()),
        ...customChannels,
      ].map((s: string) => s.trim().toLowerCase()),
    );

    const respondSources = [...alwaysRespondSources, ...customSources].map(
      (s: string) => s.trim().toLowerCase(),
    );

    const roomType = room.type?.toString().toLowerCase();
    const sourceStr = message.content.source?.toLowerCase() || "";

    // 1. DM/VOICE_DM/API channels: always respond (private channels)
    if (respondChannels.has(roomType)) {
      return {
        shouldRespond: true,
        skipEvaluation: true,
        reason: `private channel: ${roomType}`,
      };
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
    const hasPlatformMention = !!(
      mentionContext?.isMention || mentionContext?.isReply
    );
    if (hasPlatformMention) {
      const mentionType = mentionContext?.isMention ? "mention" : "reply";
      return {
        shouldRespond: true,
        skipEvaluation: true,
        reason: `platform ${mentionType}`,
      };
    }

    // 4. All other cases: let the LLM decide
    return {
      shouldRespond: false,
      skipEvaluation: false,
      reason: "needs LLM evaluation",
    };
  }
```