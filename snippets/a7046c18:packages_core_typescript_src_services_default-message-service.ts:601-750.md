# a7046c18:packages_core_typescript_src_services_default-message-service.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          return {
            didRespond: false,
            responseContent: null,
            responseMessages: [],
            state,
            mode: "none",
          };
        }

        if (!message.id) {
          runtime.logger.error(
            { src: "service:message", agentId: runtime.agentId },
            "Message ID is missing, cannot create ignore response",
          );
          await this.emitRunEnded(
            runtime,
            runId,
            message,
            startTime,
            "noMessageId",
          );
          return {
            didRespond: false,
            responseContent: null,
            responseMessages: [],
            state,
            mode: "none",
          };
        }

        // Construct a minimal content object indicating ignore
        const ignoreContent: Content = {
          thought: "Agent decided not to respond to this message.",
          actions: ["IGNORE"],
          simple: true,
          inReplyTo: createUniqueUuid(runtime, message.id),
        };

        // Call the callback with the ignore content
        if (callback) {
          await callback(ignoreContent);
        }

        // Save this ignore action/thought to memory
        const ignoreMemory: Memory = {
          id: asUUID(v4()),
          entityId: runtime.agentId,
          agentId: runtime.agentId,
          content: ignoreContent,
          roomId: message.roomId,
          createdAt: Date.now(),
        };
        await runtime.createMemory(ignoreMemory, "messages");
        runtime.logger.debug(
          { src: "service:message", memoryId: ignoreMemory.id },
          "Saved ignore response to memory",
        );
      }

      // Clean up the response ID
      agentResponses.delete(message.roomId);
      if (agentResponses.size === 0) {
        latestResponseIds.delete(runtime.agentId);
      }

      // Run evaluators
      await runtime.evaluate(
        message,
        state,
        shouldRespondToMessage,
        async (content) => {
          runtime.logger.debug(
            { src: "service:message", content },
            "Evaluate callback",
          );
          if (responseContent) {
            responseContent.evalCallbacks = content;
          }
          if (callback) {
            return callback(content);
          }
          return [];
        },
        responseMessages,
      );

      // Collect metadata for logging
      let entityName = "noname";
      if (
        message.metadata &&
        "entityName" in message.metadata &&
        typeof message.metadata.entityName === "string"
      ) {
        entityName = message.metadata.entityName;
      }

      const isDM = message.content?.channelType === ChannelType.DM;
      let roomName = entityName;

      if (!isDM) {
        const roomDatas = await runtime.getRoomsByIds([message.roomId]);
        if (roomDatas?.length) {
          const roomData = roomDatas[0];
          if (roomData.name) {
            roomName = roomData.name;
          }
          if (roomData.worldId) {
            const worldData = await runtime.getWorld(roomData.worldId);
            if (worldData) {
              roomName = `${worldData.name}-${roomName}`;
            }
          }
        }
      }

      const date = new Date();
      const providersData = state.data?.providers;
      interface ActionsProviderData {
        ACTIONS?: {
          data?: {
            actionsData?: Array<{ name: string }>;
          };
        };
      }
      const actionsProvider =
        typeof providersData === "object" &&
        providersData !== null &&
        "ACTIONS" in providersData
          ? (providersData as ActionsProviderData).ACTIONS
          : undefined;
      const actionsData = actionsProvider?.data?.actionsData;
      const availableActions = Array.isArray(actionsData)
        ? actionsData.map((a: { name: string }) => a.name)
        : [-1];

      const _logData = {
        at: date.toString(),
        timestamp: parseInt(`${date.getTime() / 1000}`, 10),
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
```