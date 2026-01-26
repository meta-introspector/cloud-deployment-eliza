# 2d12b6ef:packages_server_src_api_messaging_sessions.ts:751-900

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:751-900
**Novelty Score:** 35.43
**Concepts:** testing

```
      // Try to renew session on activity
      const wasRenewed = renewSession(session);
      if (!wasRenewed && session.timeoutConfig.autoRenew) {
        // Auto-renew is enabled but renewal failed (max duration reached)
        const maxDurationMs =
          (session.timeoutConfig.maxDurationMinutes || DEFAULT_MAX_DURATION_MINUTES) * 60 * 1000;
        const timeSinceCreation = Date.now() - session.createdAt.getTime();

        if (timeSinceCreation >= maxDurationMs) {
          logger.warn({ src: 'http', sessionId }, 'Session reached maximum duration');
        }
      } else if (!session.timeoutConfig.autoRenew) {
        // Just update last activity without renewing
        session.lastActivity = new Date();
      }

      // Check if we should send a warning
      if (shouldWarnAboutExpiration(session)) {
        session.warningState = {
          sent: true,
          sentAt: new Date(),
        };

        logger.debug({ src: 'http', sessionId }, 'Session near expiration, warning state set');
      }

      // Fetch the channel to get its metadata (which includes session metadata)
      let channelMetadata: Record<string, unknown> = {};
      try {
        const channel = await serverInstance.getChannelDetails(session.channelId);
        if (channel && channel.metadata) {
          channelMetadata = channel.metadata as Record<string, unknown>;
        }
      } catch (error) {
        logger.debug(
          { src: 'http', channelId: session.channelId, error: String(error) },
          'Could not fetch channel metadata'
        );
      }

      // Merge metadata: channel metadata (includes session metadata) + message-specific metadata
      const mergedMetadata = {
        ...channelMetadata,
        sessionId,
        ...(body.metadata || {}),
      };

      // Create message in database
      let message: Awaited<ReturnType<typeof serverInstance.createMessage>>;
      try {
        message = await serverInstance.createMessage({
          channelId: session.channelId,
          authorId: session.userId,
          content: body.content,
          rawMessage: {
            content: body.content,
            attachments: body.attachments,
          },
          sourceType: 'user',
          metadata: mergedMetadata,
        });
      } catch (error) {
        throw new MessageSendError(sessionId, 'Failed to create message in database', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }

      // Build Memory object for elizaOS.handleMessage
      const messageMemory = {
        entityId: session.userId,
        roomId: session.channelId,
        content: { text: body.content },
      };

      // Build messageForBus for WebSocket transport (MessageServiceStructure format)
      const messageForBus: MessageServiceStructure = {
        id: message.id,
        channel_id: message.channelId,
        message_server_id: serverInstance.messageServerId,
        author_id: message.authorId,
        content: message.content,
        created_at: new Date(message.createdAt).getTime(),
        source_type: message.sourceType,
        raw_message: message.rawMessage,
        metadata: message.metadata,
        in_reply_to_message_id: message.inReplyToRootMessageId,
      };

      // Session-specific additional data
      const sessionStatus = {
        sessionStatus: {
          expiresAt: session.expiresAt,
          renewalCount: session.renewalCount,
          wasRenewed,
          isNearExpiration: shouldWarnAboutExpiration(session),
        },
      };

      // Handle response using shared handler
      await handleTransport({
        res,
        transport,
        elizaOS,
        agentId: session.agentId,
        messageMemory,
        userMessage: messageForBus,
        additionalResponseData: sessionStatus,
        onWebSocketTransport: () => {
          // Emit to internal bus for agent processing
          internalMessageBus.emit('new_message', messageForBus);
          logger.debug(
            { src: 'http', messageId: messageForBus.id, sessionId, transport },
            'Session message published to internal bus'
          );
        },
      });
    })
  );

  /**
   * Get messages from a session
   * GET /api/messaging/sessions/:sessionId/messages
   */
  router.get(
    '/sessions/:sessionId/messages',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      // Parse query parameters with proper type handling
      const query: GetMessagesQuery = {
        limit: req.query.limit as string | undefined,
        before: req.query.before as string | undefined,
        after: req.query.after as string | undefined,
      };

      const session = sessions.get(sessionId);
      if (!session) {
        throw new SessionNotFoundError(sessionId);
      }

      // Check if session is expired
      if (session.expiresAt.getTime() <= Date.now()) {
        sessions.delete(sessionId);
        throw new SessionExpiredError(sessionId, session.expiresAt);
      }

      // Parse and validate query parameters
      let messageLimit = DEFAULT_LIMIT;
      if (query.limit) {
        const parsedLimit = safeParseInt(query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
        // Since safeParseInt handles NaN, we can directly use the result
```