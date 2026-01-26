# a7046c18:packages_docs_runtime_messaging.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/messaging.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```javascript
// Send typing indicator
socket.emit('typing', {
  roomId: roomId,
  userId: userId,
  isTyping: true
});

// Listen for typing indicators
socket.on('userTyping', (data) => {
  if (data.roomId === roomId) {
    console.log(`${data.userId} is ${data.isTyping ? 'typing' : 'stopped typing'}`);
  }
});
```

### Message Acknowledgments

```javascript
// Send message with acknowledgment
socket.emit('message', messagePayload, (ack) => {
  console.log('Message acknowledged:', ack);
});
```

## Server-Side Implementation

The Socket.IO server handles message routing and broadcasting:

```typescript
class SocketIOService extends Service {
  static serviceType = 'socketio' as const;
  capabilityDescription = 'Real-time messaging via Socket.IO';
  
  private io: Server;
  
  async start(runtime: IAgentRuntime) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('message', async (data) => {
        if (data.type === SOCKET_MESSAGE_TYPE.ROOM_JOINING) {
          await this.handleRoomJoin(socket, data.payload);
        } else if (data.type === SOCKET_MESSAGE_TYPE.SEND_MESSAGE) {
          await this.handleMessage(socket, data.payload);
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  
  private async handleRoomJoin(socket: Socket, payload: any) {
    const { roomId, entityId } = payload;
    
    // Join the room
    socket.join(roomId);
    
    // Notify others in room
    socket.to(roomId).emit('userJoined', {
      userId: entityId,
      roomId: roomId
    });
    
    console.log(`User ${entityId} joined room ${roomId}`);
  }
  
  private async handleMessage(socket: Socket, payload: any) {
    const { roomId, message, senderId } = payload;
    
    // Process message through runtime
    const response = await this.runtime.processMessage({
      content: message,
      roomId: roomId,
      userId: senderId
    });
    
    // Broadcast to all in room
    this.io.to(roomId).emit('messageBroadcast', {
      roomId: roomId,
      channelId: roomId, // For backward compatibility
      senderName: response.agentName,
      text: response.text,
      metadata: response.metadata
    });
  }
  
  async stop() {
    this.io.close();
  }
}
```

## Reference Implementation

<Card title="Eliza NextJS Starter" icon="github" href="https://github.com/elizaOS/eliza-nextjs-starter">
  A complete working example demonstrating Socket.IO integration with Eliza, including real-time messaging, agent participation management, and comprehensive error handling.
</Card>

## REST API Response Modes

When sending messages via REST endpoints (e.g., `POST /api/messaging/channels/{channelId}/messages`), you can control how responses are delivered using the `mode` parameter.

### Available Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| `websocket` | Returns immediately, response via WebSocket | Real-time chat UIs (default) |
| `stream` | Server-Sent Events with progressive chunks | Typing effect, progress feedback |
| `sync` | Waits for complete response | Scripts, testing, simple integrations |

### WebSocket Mode (Default)

Returns immediately after message is queued. Agent response is delivered via WebSocket connection.

```bash
curl -X POST /api/messaging/channels/{channelId}/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "entityId": "...", "mode": "websocket"}'
```

Response:
```json
{
  "success": true,
  "userMessage": { "id": "...", "text": "Hello" }
}
```

Agent response arrives via the `messageBroadcast` WebSocket event (see above).

### Stream Mode (SSE)

Uses Server-Sent Events to stream response chunks progressively.

```bash
curl -X POST /api/messaging/channels/{channelId}/messages \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"text": "Hello", "entityId": "...", "mode": "stream"}'
```
```