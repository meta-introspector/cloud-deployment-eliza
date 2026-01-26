# 5e8c73c1:packages_server_src_socketio_index.ts:601-708

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/socketio/index.ts:601-708
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      logger.error(
        { src: 'ws', socketId: socket.id, error: errorMessage },
        'Error processing message'
      );
      this.sendErrorResponse(socket, `Error processing your message: ${errorMessage}`);
    }
  }

  private sendErrorResponse(socket: Socket, errorMessage: string) {
    logger.warn({ src: 'ws', socketId: socket.id, error: errorMessage }, 'Sending error to client');
    if (socket.connected) {
      socket.emit('messageError', {
        error: errorMessage,
      });
    }
  }

  private handleLogSubscription(socket: Socket) {
    this.logStreamConnections.set(socket.id, {});
    if (socket.connected) {
      socket.emit('log_subscription_confirmed', {
        subscribed: true,
        message: 'Successfully subscribed to log stream',
      });
    }
  }

  private handleLogUnsubscription(socket: Socket) {
    this.logStreamConnections.delete(socket.id);
    if (socket.connected) {
      socket.emit('log_subscription_confirmed', {
        subscribed: false,
        message: 'Successfully unsubscribed from log stream',
      });
    }
  }

  private handleLogFilterUpdate(socket: Socket, filters: { agentName?: string; level?: string }) {
    const existingFilters = this.logStreamConnections.get(socket.id);
    if (existingFilters !== undefined) {
      this.logStreamConnections.set(socket.id, { ...existingFilters, ...filters });
      socket.emit('log_filters_updated', {
        success: true,
        filters: this.logStreamConnections.get(socket.id),
      });
    } else {
      socket.emit('log_filters_updated', {
        success: false,
        error: 'Not subscribed to log stream',
      });
    }
  }

  public broadcastLog(io: SocketIOServer, logEntry: LogEntry) {
    if (this.logStreamConnections.size === 0) {
      return;
    }
    const logData = { type: 'log_entry', payload: logEntry };
    this.logStreamConnections.forEach((filters, socketId) => {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        let shouldBroadcast = true;
        if (filters.agentName && filters.agentName !== 'all') {
          shouldBroadcast = shouldBroadcast && logEntry.agentName === filters.agentName;
        }
        if (filters.level && filters.level !== 'all') {
          // Use logger levels directly from @elizaos/core
          const numericLevel =
            typeof filters.level === 'string'
              ? customLevels[filters.level.toLowerCase()] || 70
              : filters.level;
          const entryLevel = logEntry.level ?? 30; // Default to info level
          shouldBroadcast = shouldBroadcast && entryLevel >= numericLevel;
        }
        if (shouldBroadcast) {
          socket.emit('log_stream', logData);
        }
      }
    });
  }

  private handleDisconnect(socket: Socket) {
    const agentIdAssociated = this.socketAgent.get(socket.id);
    this.socketAgent.delete(socket.id);
    this.logStreamConnections.delete(socket.id);

    // Cleanup entitySockets mapping
    if (socket.data?.entityId) {
      const entityId = socket.data.entityId as UUID;
      const sockets = this.entitySockets.get(entityId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          this.entitySockets.delete(entityId);
        }
      }
    }

    if (agentIdAssociated) {
      logger.info(
        { src: 'ws', socketId: socket.id, agentId: agentIdAssociated },
        'Client disconnected (associated with agent)'
      );
    } else {
      logger.debug({ src: 'ws', socketId: socket.id }, 'Client disconnected');
    }
  }
}
```