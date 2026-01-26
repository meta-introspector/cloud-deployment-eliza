# 5e8c73c1:packages_server_src_socketio_index.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/socketio/index.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        logger.warn(
          `[SocketIO Security] Entity ${entityId} is NOT participant in channel ${channelId}`
        );
      }

      return isParticipant;
    } catch (error: unknown) {
      logger.error(
        '[SocketIO Security] Error verifying channel access:',
        error instanceof Error ? error.message : String(error)
      );
      return false; // Fail closed - deny on error
    }
  }

  /**
   * Handle channel joining with production-grade security
   *
   * Security features:
   * 1. Lazy-loading cache: Load allowed rooms only on first join attempt
   * 2. Hybrid approach: Check cache first, then DB if not found (new room)
   * 3. Permission verification: Block joins to rooms user doesn't have access to
   */
  private async handleChannelJoining(socket: Socket, payload: ChannelJoiningPayload) {
    const channelId = payload.channelId || payload.roomId; // Support both for backward compatibility
    const { agentId, entityId, messageServerId, username, displayName, metadata } = payload;

    if (!channelId) {
      this.sendErrorResponse(socket, 'channelId is required for joining.');
      return;
    }

    // SECURITY: Verify permission to join this channel
    const hasPermission = await this.verifyChannelAccess(socket, channelId as UUID);
    if (!hasPermission) {
      logger.warn(
        `[SocketIO Security] Socket ${socket.id} (entity ${socket.data?.entityId}) DENIED access to channel ${channelId}`
      );
      this.sendErrorResponse(
        socket,
        `Access denied: You don't have permission to join this channel`
      );
      return;
    }

    if (agentId) {
      const agentUuid = validateUuid(agentId);
      if (agentUuid) {
        this.socketAgent.set(socket.id, agentUuid);
        logger.debug(
          { src: 'ws', socketId: socket.id, agentId: agentUuid },
          'Socket associated with agent'
        );
      }
    }

    socket.join(channelId);
    logger.debug(
      { src: 'ws', socketId: socket.id, entityId: socket.data?.entityId, channelId },
      'Socket granted access to channel'
    );

    // Emit ENTITY_JOINED event for bootstrap plugin to handle world/entity creation
    if (entityId && (messageServerId || this.serverInstance.messageServerId)) {
      const finalMessageServerId = messageServerId || this.serverInstance.messageServerId;
      const isDm = metadata?.isDm || metadata?.channelType === ChannelType.DM;

      logger.debug(
        { src: 'ws', entityId, messageServerId: finalMessageServerId, isDm },
        'Emitting ENTITY_JOINED event'
      );

      // Get the first available runtime (there should typically be one)
      const runtime = this.elizaOS.getAgents()[0];
      if (runtime) {
        runtime.emitEvent(EventType.ENTITY_JOINED, {
          entityId: entityId as UUID,
          runtime,
          worldId: finalMessageServerId, // Use messageServerId as worldId identifier
          roomId: channelId as UUID,
          metadata: {
            originalId: entityId as string,
            username: username || (entityId as string),
            displayName,
            type: isDm ? ChannelType.DM : ChannelType.GROUP,
            isDm,
            ...metadata,
          },
          source: 'socketio',
        });
      } else {
        logger.warn(
          { src: 'ws', socketId: socket.id, entityId },
          'No runtime available to emit ENTITY_JOINED'
        );
      }
    } else {
      logger.debug(
        {
          src: 'ws',
          entityId,
          messageServerId: messageServerId || this.serverInstance.messageServerId,
        },
        'Missing entityId or messageServerId - not emitting ENTITY_JOINED event'
      );
    }

    const responsePayload = {
      message: `Socket ${socket.id} successfully joined channel ${channelId}.`,
      channelId,
      roomId: channelId,
      ...(agentId && { agentId: validateUuid(agentId) || agentId }),
    };
    socket.emit('channel_joined', responsePayload);
    socket.emit('room_joined', responsePayload);
    logger.debug({ src: 'ws', socketId: socket.id, channelId }, 'Socket joined channel');
  }

  private async handleMessageSubmission(socket: Socket, payload: MessageSubmissionPayload) {
    const channelId = payload.channelId || payload.roomId; // Support both for backward compatibility
    const { senderId, senderName, message, messageServerId, source, metadata, attachments } =
      payload;

    // Validate server ID
    const isValidServerId =
      messageServerId === this.serverInstance.messageServerId || validateUuid(messageServerId);

    if (!validateUuid(channelId) || !isValidServerId || !validateUuid(senderId) || !message) {
      this.sendErrorResponse(
        socket,
        'For SEND_MESSAGE: channelId, messageServerId (message_server_id), senderId (author_id), and message are required.'
      );
      return;
    }

    // After validation, channelId is guaranteed to be a valid UUID
    const validChannelId = channelId as UUID;

    try {
      // Check if this is a DM channel and emit ENTITY_JOINED for proper world setup
      const isDmForWorldSetup = metadata?.isDm || metadata?.channelType === ChannelType.DM;
      if (isDmForWorldSetup && senderId) {
        const runtime = this.elizaOS.getAgents()[0];
        if (runtime) {
          runtime.emitEvent(EventType.ENTITY_JOINED, {
            entityId: senderId as UUID,
            runtime,
            worldId: messageServerId, // Use messageServerId as worldId identifier
            roomId: validChannelId,
            metadata: {
```