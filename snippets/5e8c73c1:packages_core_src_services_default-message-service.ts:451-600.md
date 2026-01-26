# 5e8c73c1:packages_core_src_services_default-message-service.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/services/default-message-service.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          state = await runtime.composeState(message, responseContent.providers || []);
        }

        if (responseContent) {
          if (mode === 'simple') {
            // Log provider usage for simple responses
            if (responseContent.providers && responseContent.providers.length > 0) {
              runtime.logger.debug(
                { src: 'service:message', providers: responseContent.providers },
                'Simple response used providers'
              );
            }
            if (callback) {
              await callback(responseContent);
            }
          } else if (mode === 'actions') {
            // Pass onStreamChunk to processActions so each action can manage its own streaming context
            await runtime.processActions(
              message,
              responseMessages,
              state,
              async (content) => {
                runtime.logger.debug({ src: 'service:message', content }, 'Action callback');
                responseContent!.actionCallbacks = content;
                if (callback) {
                  return callback(content);
                }
                return [];
              },
              { onStreamChunk: opts.onStreamChunk }
            );
          }
        }
      } else {
        // Agent decided not to respond
        runtime.logger.debug({ src: 'service:message' }, 'Agent decided not to respond');

        // Check if we still have the latest response ID
        const currentResponseId = agentResponses.get(message.roomId);
        const keepResp = parseBooleanFromText(
          String(runtime.getSetting('BOOTSTRAP_KEEP_RESP') || '')
        );

        if (currentResponseId !== responseId && !keepResp) {
          runtime.logger.info(
            { src: 'service:message', agentId: runtime.agentId, roomId: message.roomId },
            'Ignore response discarded - newer message being processed'
          );
          await this.emitRunEnded(runtime, runId, message, startTime, 'replaced');
          return {
            didRespond: false,
            responseContent: null,
            responseMessages: [],
            state,
            mode: 'none',
          };
        }

        if (!message.id) {
          runtime.logger.error(
            { src: 'service:message', agentId: runtime.agentId },
            'Message ID is missing, cannot create ignore response'
          );
          await this.emitRunEnded(runtime, runId, message, startTime, 'noMessageId');
          return {
            didRespond: false,
            responseContent: null,
            responseMessages: [],
            state,
            mode: 'none',
          };
        }

        // Construct a minimal content object indicating ignore
        const ignoreContent: Content = {
          thought: 'Agent decided not to respond to this message.',
          actions: ['IGNORE'],
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
        await runtime.createMemory(ignoreMemory, 'messages');
        runtime.logger.debug(
          { src: 'service:message', memoryId: ignoreMemory.id },
          'Saved ignore response to memory'
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
          runtime.logger.debug({ src: 'service:message', content }, 'Evaluate callback');
          if (responseContent) {
            responseContent.evalCallbacks = content;
          }
          if (callback) {
            return callback(content);
          }
          return [];
        },
        responseMessages
      );

      // Collect metadata for logging
      let entityName = 'noname';
      if (
        message.metadata &&
        'entityName' in message.metadata &&
        typeof message.metadata.entityName === 'string'
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
              roomName = worldData.name + '-' + roomName;
```