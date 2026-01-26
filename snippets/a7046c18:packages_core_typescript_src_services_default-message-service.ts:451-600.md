# a7046c18:packages_core_typescript_src_services_default-message-service.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        runtime.logger.debug(
          { src: "service:message", response },
          "LLM evaluation result",
        );

        const responseObject = parseKeyValueXml(response);
        runtime.logger.debug(
          { src: "service:message", responseObject },
          "Parsed evaluation result",
        );

        // If an action is provided, the agent intends to respond in some way
        const nonResponseActions = ["IGNORE", "NONE"];
        const actionValue = responseObject?.action;
        shouldRespondToMessage =
          typeof actionValue === "string" &&
          !nonResponseActions.includes(actionValue.toUpperCase());
      }

      let responseContent: Content | null = null;
      let responseMessages: Memory[] = [];
      let mode: StrategyMode = "none";

      if (shouldRespondToMessage) {
        const result = opts.useMultiStep
          ? await this.runMultiStepCore(
              runtime,
              message,
              state,
              callback,
              opts,
              responseId,
            )
          : await this.runSingleShotCore(
              runtime,
              message,
              state,
              opts,
              responseId,
            );

        responseContent = result.responseContent;
        responseMessages = result.responseMessages;
        state = result.state;
        mode = result.mode;

        // Race check before we send anything
        const currentResponseId = agentResponses.get(message.roomId);
        if (currentResponseId !== responseId) {
          runtime.logger.info(
            {
              src: "service:message",
              agentId: runtime.agentId,
              roomId: message.roomId,
            },
            "Response discarded - newer message being processed",
          );
          return {
            didRespond: false,
            responseContent: null,
            responseMessages: [],
            state,
            mode: "none",
          };
        }

        if (responseContent && message.id) {
          responseContent.inReplyTo = createUniqueUuid(runtime, message.id);
        }

        if (
          responseContent &&
          responseContent.providers &&
          responseContent.providers.length > 0
        ) {
          state = await runtime.composeState(
            message,
            responseContent.providers,
          );
        }

        if (responseContent) {
          if (mode === "simple") {
            // Log provider usage for simple responses
            if (
              responseContent.providers &&
              responseContent.providers.length > 0
            ) {
              runtime.logger.debug(
                {
                  src: "service:message",
                  providers: responseContent.providers,
                },
                "Simple response used providers",
              );
            }
            if (callback) {
              await callback(responseContent);
            }
          } else if (mode === "actions") {
            // Pass onStreamChunk to processActions so each action can manage its own streaming context
            await runtime.processActions(
              message,
              responseMessages,
              state,
              async (content) => {
                runtime.logger.debug(
                  { src: "service:message", content },
                  "Action callback",
                );
                responseContent!.actionCallbacks = content;
                if (callback) {
                  return callback(content);
                }
                return [];
              },
              { onStreamChunk: opts.onStreamChunk },
            );
          }
        }
      } else {
        // Agent decided not to respond
        runtime.logger.debug(
          { src: "service:message" },
          "Agent decided not to respond",
        );

        // Check if we still have the latest response ID
        const currentResponseId = agentResponses.get(message.roomId);
        const keepResp = parseBooleanFromText(
          String(runtime.getSetting("BOOTSTRAP_KEEP_RESP") || ""),
        );

        if (currentResponseId !== responseId && !keepResp) {
          runtime.logger.info(
            {
              src: "service:message",
              agentId: runtime.agentId,
              roomId: message.roomId,
            },
            "Ignore response discarded - newer message being processed",
          );
          await this.emitRunEnded(
            runtime,
            runId,
            message,
            startTime,
            "replaced",
          );
```