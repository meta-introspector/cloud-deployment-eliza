# 5e8c73c1:packages_server_src_socketio_index.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/socketio/index.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type { ElizaOS, LogEntry, Media } from '@elizaos/core';
import {
  logger,
  customLevels,
  SOCKET_MESSAGE_TYPE,
  MESSAGE_STREAM_EVENT,
  validateUuid,
  ChannelType,
  type UUID,
  EventType,
} from '@elizaos/core';
import type { Socket, Server as SocketIOServer } from 'socket.io';
import type { AgentServer } from '../index';
import { attachmentsToApiUrls } from '../utils';
import internalMessageBus from '../services/message-bus';

/**
 * Socket.io socket.data structure for authenticated sockets
 * These properties are set by the authentication middleware
 */
export interface SocketData {
  entityId?: UUID;
  allowedRooms?: Set<UUID>;
  roomsCacheLoaded?: boolean;
}

interface ChannelJoiningPayload {
  channelId?: UUID;
  roomId?: UUID;
  agentId?: UUID;
  entityId?: UUID;
  messageServerId?: UUID;
  username?: string;
  displayName?: string;
  metadata?: Record<string, unknown>;
}

interface MessageSubmissionPayload {
  channelId?: UUID;
  roomId?: UUID;
  senderId?: UUID;
  senderName?: string;
  message?: string;
  messageServerId?: UUID;
  source?: string;
  metadata?: Record<string, unknown>;
  attachments?: Media[];
  targetUserId?: UUID;
  messageId?: string;
}

interface GenericMessageData {
  type: SOCKET_MESSAGE_TYPE | number | string;
  payload: Record<string, unknown>;
}

export class SocketIORouter {
  private elizaOS: ElizaOS;
  private socketAgent: Map<string, UUID>; // socket.id → agentId (for agent-specific interactions like log streaming)
  private entitySockets: Map<UUID, Set<string>>; // entityId → socket.ids (for targeted cache invalidation when permissions change)
  private logStreamConnections: Map<string, { agentName?: string; level?: string }>;
  private serverInstance: AgentServer;

  constructor(elizaOS: ElizaOS, serverInstance: AgentServer) {
    this.elizaOS = elizaOS;
    this.socketAgent = new Map();
    this.entitySockets = new Map();
    this.logStreamConnections = new Map();
    this.serverInstance = serverInstance;
  }

  setupListeners(io: SocketIOServer) {
    logger.info(
      { src: 'ws', agentCount: this.elizaOS.getAgents().length },
      'SocketIO router initialized'
    );

    // Setup authentication middleware (runs before connection)
    this.setupAuthenticationMiddleware(io);

    const messageTypes = Object.keys(SOCKET_MESSAGE_TYPE).map(
      (key) => `${key}: ${SOCKET_MESSAGE_TYPE[key as keyof typeof SOCKET_MESSAGE_TYPE]}`
    );
    logger.debug({ src: 'ws', messageTypes }, 'Registered message types');
    io.on('connection', (socket: Socket) => {
      this.handleNewConnection(socket, io);
    });

    // Listen for stream chunks from the internal message bus and broadcast to clients
    internalMessageBus.on('message_stream_chunk', (data) => {
      const { channelId, messageId, chunk, agentId, index } = data;
      // Broadcast to all clients in the channel (camelCase for JS convention)
      io.to(channelId).emit(MESSAGE_STREAM_EVENT.messageStreamChunk, {
        messageId,
        chunk,
        index,
        agentId,
        channelId,
      });
    });

    // Listen for stream errors from the internal message bus and broadcast to clients
    internalMessageBus.on('message_stream_error', (data) => {
      const { channelId, messageId, agentId, error, partialText } = data;
      // Broadcast error to all clients in the channel (camelCase for JS convention)
      io.to(channelId).emit(MESSAGE_STREAM_EVENT.messageStreamError, {
        messageId,
        channelId,
        agentId,
        error,
        partialText,
      });
    });
  }

  /**
   * Authentication middleware - Production-grade WebSocket security
   *
   * Runs on every WebSocket handshake to:
   * 1. Verify API Key (if configured)
   * 2. Extract entityId from client handshake
   * 3. Initialize security context on socket.data
   * 4. Track entity->sockets mapping for cache invalidation
   */
  private setupAuthenticationMiddleware(io: SocketIOServer) {
    io.use(async (socket, next) => {
      try {
        // API Key authentication (if configured)
        if (process.env.SERVER_API_KEY) {
          const apiKey = socket.handshake.auth.apiKey || socket.handshake.headers['x-api-key'];

          if (!apiKey || apiKey !== process.env.SERVER_API_KEY) {
            logger.warn(`[SocketIO Auth] Invalid or missing API Key from socket ${socket.id}`);
            return next(new Error('Invalid or missing API Key'));
          }

          logger.debug(`[SocketIO Auth] API Key verified for socket ${socket.id}`);
        }

        // Entity identification via client-provided entityId
        const clientEntityId = socket.handshake.auth.entityId;
        let entityId: UUID;

        if (!clientEntityId || !validateUuid(clientEntityId)) {
          logger.warn(`[SocketIO Auth] Invalid or missing entityId: ${clientEntityId}`);
          return next(new Error('Valid entityId required'));
        }

        entityId = clientEntityId as UUID;
        logger.debug(`[SocketIO Auth] Using client entityId: ${entityId.substring(0, 8)}...`);
```