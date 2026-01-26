# a7046c18:packages_docs_runtime_messaging.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/messaging.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    roomId: roomId,
    entityId: entityId
  }
});
```

### 3. Exact Message Format

```javascript
// The structure must be exact
{
  type: 2, // SEND_MESSAGE type
  payload: {
    senderId: entityId,
    senderName: 'Extension User',
    message: text,
    roomId: roomId,
    messageId: generateUUID(),
    source: 'extension',
    attachments: [],
    metadata: {}
  }
}
```

## Complete Message Flow

1. **Client connects** → Server accepts connection
2. **Client joins room** → Server adds client to room
3. **Client sends message** → Server receives and processes
4. **Server broadcasts response** → All clients in room receive
5. **Clients filter by room ID** → Only relevant messages shown

## Debugging Steps

### 1. Verify Events

```javascript
// For newer Socket.IO versions
socket.onAny((eventName, ...args) => {
  console.log('Event received:', eventName, args);
});

// For older versions
const onevent = socket.onevent;
socket.onevent = function(packet) {
  console.log('Event:', packet.data);
  onevent.call(socket, packet);
};
```

### 2. Check Room ID

- Ensure the room ID matches exactly between your extension and the server
- Even a single character difference will prevent message delivery

### 3. CORS Issues

For browser extensions, ensure your manifest includes:

```json
{
  "permissions": ["http://localhost:3000/*"],
  "host_permissions": ["http://localhost:3000/*"]
}
```

### 4. Transport Issues

If WebSocket fails, force polling:

```javascript
const socket = io(SOCKET_URL, {
  transports: ['polling'] // Avoid WebSocket issues
});
```

## Socket.IO Version Compatibility

### Version Issues

- **v1.3.0** (2015) - Very old, may have compatibility issues
- **v4.x** (Current) - Recommended for new implementations

### Upgrading

```json
// package.json
{
  "dependencies": {
    "socket.io-client": "^4.5.0"
  }
}
```

## Common Mistakes

1. **Wrong event name** - Using `message` instead of `messageBroadcast`
2. **Not joining room** - Forgetting the `ROOM_JOINING` step
3. **ID mismatch** - Room/channel IDs don't match exactly
4. **Missing fields** - Payload missing required fields
5. **CORS blocked** - Extension lacks permissions

## Testing Your Implementation

1. Open browser console
2. Check for connection logs
3. Verify room join confirmation
4. Send test message
5. Check for broadcast reception

## Common Issue: Extension Not Receiving Responses

### The Problem

Your extension can send messages to Eliza (server receives them), but doesn't receive responses back.

### Root Causes

1. **Not listening for the correct event** - Must listen for `messageBroadcast`, not `message`
2. **Not joining the room/channel** - Must emit a `ROOM_JOINING` message first
3. **Room/Channel ID mismatch** - IDs must match exactly
4. **Incorrect message payload structure**

### Solution Checklist

1. Verify you're listening to `messageBroadcast` event
2. Ensure you join the room on connection
3. Check room ID matches exactly
4. Verify message payload structure
5. Check browser console for errors
6. Test with debug logging enabled

## Advanced Features

### Presence Tracking

```javascript
// Track user presence
socket.on('userJoined', (data) => {
  console.log(`User ${data.userId} joined room ${data.roomId}`);
});

socket.on('userLeft', (data) => {
  console.log(`User ${data.userId} left room ${data.roomId}`);
});
```

### Typing Indicators

```