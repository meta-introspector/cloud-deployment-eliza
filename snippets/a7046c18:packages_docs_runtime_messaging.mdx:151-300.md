# a7046c18:packages_docs_runtime_messaging.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/messaging.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    payload: {
      senderId: entityId,
      senderName: 'Extension User',
      message: text,
      roomId: roomId,        // Include roomId
      messageId: generateUUID(),
      source: 'extension',
      attachments: [],
      metadata: {}
    }
  };
  
  console.log('[SENDING] Message:', messagePayload);
  socket.emit('message', messagePayload);
}

// Helper function for UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Connection error handling
socket.on('connect_error', function(error) {
  console.error('[ERROR] Connection error:', error);
});

socket.on('disconnect', function(reason) {
  console.log('[DISCONNECTED] Reason:', reason);
});
```

## Modern Implementation (Socket.IO v4.x)

For newer Socket.IO versions, here's a cleaner implementation:

```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class ElizaSocketClient {
  constructor(entityId, roomId) {
    this.entityId = entityId;
    this.roomId = roomId;
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Eliza');
      this.joinRoom();
    });

    this.socket.on('messageBroadcast', (data) => {
      if (data.roomId === this.roomId || data.channelId === this.roomId) {
        this.onMessageReceived(data);
      }
    });

    // Debug: Log all events
    this.socket.onAny((eventName, ...args) => {
      console.log('Event:', eventName, args);
    });
  }

  joinRoom() {
    this.socket.emit('message', {
      type: 1, // ROOM_JOINING
      payload: {
        roomId: this.roomId,
        entityId: this.entityId,
      }
    });
  }

  sendMessage(text) {
    this.socket.emit('message', {
      type: 2, // SEND_MESSAGE
      payload: {
        senderId: this.entityId,
        senderName: 'Extension User',
        message: text,
        roomId: this.roomId,
        messageId: this.generateUUID(),
        source: 'extension',
        attachments: [],
        metadata: {}
      }
    });
  }

  onMessageReceived(data) {
    console.log('Message received:', data);
    // Handle the message in your application
  }

  generateUUID() {
    return crypto.randomUUID ? crypto.randomUUID() : 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Usage
const client = new ElizaSocketClient('my-extension-id', 'agent-room-id');
client.connect();

// Send a message
client.sendMessage('Hello from extension!');
```

## Key Points to Check

### 1. Event Name

```javascript
// [WRONG]
socket.on('message', handler)

// [CORRECT]
socket.on('messageBroadcast', handler)
```

### 2. Room Joining Required

```javascript
// You MUST join the room before receiving broadcasts
socket.emit('message', {
  type: 1, // ROOM_JOINING
  payload: {
```