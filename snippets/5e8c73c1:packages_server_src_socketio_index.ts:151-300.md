# 5e8c73c1:packages_server_src_socketio_index.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/socketio/index.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

        // Initialize socket security context with the determined entityId
        socket.data.entityId = entityId;
        socket.data.allowedRooms = new Set<UUID>(); // Lazy-loaded on first join attempt
        socket.data.roomsCacheLoaded = false; // Track if cache is initialized

        logger.info(
          `[SocketIO Auth] Socket ${socket.id} authenticated for entity ${entityId.substring(0, 8)}...`
        );

        // Track entity -> sockets mapping for targeted cache invalidation
        if (!this.entitySockets.has(entityId)) {
          this.entitySockets.set(entityId, new Set());
        }
        this.entitySockets.get(entityId)!.add(socket.id);

        next();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('[SocketIO Auth] Authentication error:', errorMessage);
        next(new Error('Authentication failed'));
      }
    });
  }

  private handleNewConnection(socket: Socket, _io: SocketIOServer) {
    logger.debug({ src: 'ws', socketId: socket.id }, 'New connection');

    // Send authenticated event with the entityId determined by the server
    // This allows the client to sync its local entityId with the server's decision
    const entityId = socket.data.entityId;
    if (entityId) {
      socket.emit('authenticated', {
        entityId,
        timestamp: Date.now(),
      });
      logger.debug(
        `[SocketIO] Sent 'authenticated' event to socket ${socket.id} with entityId: ${entityId.substring(0, 8)}...`
      );
    }

    socket.on(String(SOCKET_MESSAGE_TYPE.ROOM_JOINING), (payload) => {
      this.handleChannelJoining(socket, payload);
    });

    socket.on(String(SOCKET_MESSAGE_TYPE.SEND_MESSAGE), (payload) => {
      this.handleMessageSubmission(socket, payload);
    });

    socket.on('message', (data) => {
      this.handleGenericMessage(socket, data);
    });

    socket.on('subscribe_logs', () => this.handleLogSubscription(socket));
    socket.on('unsubscribe_logs', () => this.handleLogUnsubscription(socket));
    socket.on('update_log_filters', (filters) => this.handleLogFilterUpdate(socket, filters));
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (error) => {
      logger.error(
        {
          src: 'ws',
          socketId: socket.id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Socket error'
      );
    });

    socket.emit('connection_established', {
      message: 'Connected to Eliza Socket.IO server',
      socketId: socket.id,
    });
  }

  private handleGenericMessage(socket: Socket, data: GenericMessageData) {
    try {
      if (!(data && typeof data === 'object' && 'type' in data && 'payload' in data)) {
        logger.warn({ src: 'ws', socketId: socket.id }, 'Malformed message event data');
        return;
      }
      const { type, payload } = data;

      switch (type) {
        case SOCKET_MESSAGE_TYPE.ROOM_JOINING:
          this.handleChannelJoining(socket, payload);
          break;
        case SOCKET_MESSAGE_TYPE.SEND_MESSAGE:
          this.handleMessageSubmission(socket, payload);
          break;
        default:
          logger.warn({ src: 'ws', socketId: socket.id, type }, 'Unknown message type');
          break;
      }
    } catch (error: unknown) {
      logger.error(
        {
          src: 'ws',
          socketId: socket.id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error processing message'
      );
    }
  }

  /**
   * Verify if socket's entity has permission to access a channel.
   * Returns true if entity is a channel participant or if data isolation is disabled.
   * Includes disconnection guards to prevent operations on stale sockets.
   */
  private async verifyChannelAccess(socket: Socket, channelId: UUID): Promise<boolean> {
    try {
      // Guard: Check socket state before async operation
      if (socket.disconnected) {
        logger.debug(
          { src: 'ws', socketId: socket.id },
          'Socket disconnected before channel access check'
        );
        return false;
      }

      const dataIsolationEnabled = process.env.ENABLE_DATA_ISOLATION === 'true';

      if (!dataIsolationEnabled) {
        logger.debug('[SocketIO Security] Data isolation disabled - allowing channel access');
        return true;
      }

      const entityId = socket.data?.entityId;
      if (!entityId) {
        logger.warn('[SocketIO Security] No entityId in socket data - denying access');
        return false;
      }

      const isParticipant = await this.serverInstance.isChannelParticipant(channelId, entityId);

      // Guard: Check socket state after async operation
      if (socket.disconnected) {
        logger.debug(
          { src: 'ws', socketId: socket.id },
          'Socket disconnected during channel access check'
        );
        return false;
      }

      if (isParticipant) {
        logger.debug(
          `[SocketIO Security] Entity ${entityId} is participant in channel ${channelId}`
        );
      } else {
```