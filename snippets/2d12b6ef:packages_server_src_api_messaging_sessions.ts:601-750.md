# 2d12b6ef:packages_server_src_api_messaging_sessions.ts:601-750

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:601-750
**Novelty Score:** 35.43
**Concepts:** testing

```
      if (body.metadata) {
        validateMetadata(body.metadata);
      }

      // Get agent timeout config and merge with session config
      const agentTimeoutConfig = getAgentTimeoutConfig(agent);
      const finalTimeoutConfig = mergeTimeoutConfigs(body.timeoutConfig, agentTimeoutConfig);

      logger.debug(
        {
          src: 'http',
          agentId: body.agentId,
          timeoutMinutes: finalTimeoutConfig.timeoutMinutes,
          autoRenew: finalTimeoutConfig.autoRenew,
          maxDuration: finalTimeoutConfig.maxDurationMinutes,
        },
        'Creating session'
      );

      // Create a unique session ID
      const sessionId = uuidv4();
      const channelId = uuidv4() as UUID;

      try {
        // Create channel in the database
        await serverInstance.createChannel({
          id: channelId,
          name: `session-${sessionId}`,
          type: ChannelType.DM,
          messageServerId: serverInstance.messageServerId,
          metadata: {
            sessionId,
            agentId: body.agentId,
            userId: body.userId,
            timeoutConfig: finalTimeoutConfig,
            ...(body.metadata || {}),
          },
        });

        // Add agent as participant
        await serverInstance.addParticipantsToChannel(channelId, [body.agentId as UUID]);
      } catch (error) {
        throw new SessionCreationError('Failed to create channel or add participants', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }

      // Create session with calculated expiration
      const now = new Date();
      const session: Session = {
        id: sessionId,
        agentId: body.agentId as UUID,
        channelId,
        userId: body.userId as UUID,
        metadata: body.metadata || {},
        createdAt: now,
        lastActivity: now,
        expiresAt: calculateExpirationDate(now, now, finalTimeoutConfig, 0),
        timeoutConfig: finalTimeoutConfig,
        renewalCount: 0,
      };

      sessions.set(sessionId, session);

      const response: CreateSessionResponse = {
        sessionId,
        channelId: session.channelId,
        agentId: session.agentId,
        userId: session.userId,
        createdAt: session.createdAt,
        metadata: session.metadata,
        expiresAt: session.expiresAt,
        timeoutConfig: session.timeoutConfig,
      };

      res.status(201).json(response);
    })
  );

  /**
   * Get session details
   * GET /api/messaging/sessions/:sessionId
   */
  router.get(
    '/sessions/:sessionId',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      const session = sessions.get(sessionId);

      if (!session || !isValidSession(session)) {
        throw new SessionNotFoundError(sessionId);
      }

      // Check if session is expired
      if (session.expiresAt.getTime() <= Date.now()) {
        sessions.delete(sessionId);
        throw new SessionExpiredError(sessionId, session.expiresAt);
      }

      const response = createSessionInfoResponse(session);
      res.json(response);
    })
  );

  /**
   * Send a message in a session
   * POST /api/messaging/sessions/:sessionId/messages
   * Supports multiple transport types via the 'transport' parameter:
   * - "http": Wait for complete agent response (sync)
   * - "sse": SSE streaming response
   * - "websocket": Return immediately, agent response via WebSocket (default)
   * Also accepts legacy 'mode' parameter (sync, stream, websocket) for backward compatibility
   */
  router.post(
    '/sessions/:sessionId/messages',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const { sessionId } = req.params;
      const body: SendMessageRequest & { transport?: TransportType; mode?: string } = req.body;

      // Validate transport parameter (supports both 'transport' and legacy 'mode')
      const transportValidation = validateTransport(body.transport ?? body.mode);
      if (!transportValidation.isValid) {
        throw new InvalidContentError(transportValidation.error!, body);
      }
      const transport = transportValidation.transport;

      // Validate request structure
      if (!isSendMessageRequest(body)) {
        throw new InvalidContentError('Invalid message request format', body);
      }

      const session = sessions.get(sessionId);
      if (!session) {
        throw new SessionNotFoundError(sessionId);
      }

      // Check if session is expired
      if (session.expiresAt.getTime() <= Date.now()) {
        sessions.delete(sessionId);
        throw new SessionExpiredError(sessionId, session.expiresAt);
      }

      // Validate content
      validateContent(body.content);

      // Validate metadata if provided
      if (body.metadata) {
        validateMetadata(body.metadata);
      }

```