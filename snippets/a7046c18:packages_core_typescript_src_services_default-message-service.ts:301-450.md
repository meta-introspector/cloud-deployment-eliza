# a7046c18:packages_core_typescript_src_services_default-message-service.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Save the incoming message to memory
      runtime.logger.debug(
        { src: "service:message" },
        "Saving message to memory",
      );
      let memoryToQueue: Memory;

      if (message.id) {
        const existingMemory = await runtime.getMemoryById(message.id);
        if (existingMemory) {
          runtime.logger.debug(
            { src: "service:message" },
            "Memory already exists, skipping creation",
          );
          memoryToQueue = existingMemory;
        } else {
          const createdMemoryId = await runtime.createMemory(
            message,
            "messages",
          );
          memoryToQueue = { ...message, id: createdMemoryId };
        }
        await runtime.queueEmbeddingGeneration(memoryToQueue, "high");
      } else {
        const memoryId = await runtime.createMemory(message, "messages");
        message.id = memoryId;
        memoryToQueue = { ...message, id: memoryId };
        await runtime.queueEmbeddingGeneration(memoryToQueue, "normal");
      }

      // Check if LLM is off by default
      const agentUserState = await runtime.getParticipantUserState(
        message.roomId,
        runtime.agentId,
      );
      const defLllmOff = parseBooleanFromText(
        String(runtime.getSetting("BOOTSTRAP_DEFLLMOFF") || ""),
      );

      if (defLllmOff && agentUserState === null) {
        runtime.logger.debug(
          { src: "service:message" },
          "LLM is off by default",
        );
        await this.emitRunEnded(runtime, runId, message, startTime, "off");
        return {
          didRespond: false,
          responseContent: null,
          responseMessages: [],
          state: { values: {}, data: {}, text: "" } as State,
          mode: "none",
        };
      }

      // Check if room is muted
      if (
        agentUserState === "MUTED" &&
        !message.content.text
          ?.toLowerCase()
          .includes(runtime.character.name.toLowerCase())
      ) {
        runtime.logger.debug(
          { src: "service:message", roomId: message.roomId },
          "Ignoring muted room",
        );
        await this.emitRunEnded(runtime, runId, message, startTime, "muted");
        return {
          didRespond: false,
          responseContent: null,
          responseMessages: [],
          state: { values: {}, data: {}, text: "" } as State,
          mode: "none",
        };
      }

      // Compose initial state
      let state = await runtime.composeState(
        message,
        ["ANXIETY", "ENTITIES", "CHARACTER", "RECENT_MESSAGES", "ACTIONS"],
        true,
      );

      // Get room and mention context
      const mentionContext = message.content.mentionContext;
      const room = await runtime.getRoom(message.roomId);

      // Process attachments before deciding to respond
      if (
        message.content.attachments &&
        message.content.attachments.length > 0
      ) {
        message.content.attachments = await this.processAttachments(
          runtime,
          message.content.attachments,
        );
        if (message.id) {
          await runtime.updateMemory({
            id: message.id,
            content: message.content,
          });
        }
      }

      // Determine if we should respond
      const responseDecision = this.shouldRespond(
        runtime,
        message,
        room ?? undefined,
        mentionContext,
      );

      runtime.logger.debug(
        { src: "service:message", responseDecision },
        "Response decision",
      );

      let shouldRespondToMessage = true;

      // If we can skip the evaluation, use the decision directly
      if (responseDecision.skipEvaluation) {
        runtime.logger.debug(
          {
            src: "service:message",
            agentName: runtime.character.name,
            reason: responseDecision.reason,
          },
          "Skipping LLM evaluation",
        );
        shouldRespondToMessage = responseDecision.shouldRespond;
      } else {
        // Need LLM evaluation for ambiguous case
        const shouldRespondPrompt = composePromptFromState({
          state,
          template:
            runtime.character.templates?.shouldRespondTemplate ||
            shouldRespondTemplate,
        });

        runtime.logger.debug(
          {
            src: "service:message",
            agentName: runtime.character.name,
            reason: responseDecision.reason,
          },
          "Using LLM evaluation",
        );

        const response = await runtime.useModel(ModelType.TEXT_SMALL, {
          prompt: shouldRespondPrompt,
        });
```