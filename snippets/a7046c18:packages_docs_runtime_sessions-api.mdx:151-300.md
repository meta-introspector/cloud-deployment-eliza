# a7046c18:packages_docs_runtime_sessions-api.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
};
```

### Environment Variables

Global default configuration:

- `SESSION_DEFAULT_TIMEOUT_MINUTES` (default: 30)
- `SESSION_MIN_TIMEOUT_MINUTES` (default: 5)
- `SESSION_MAX_TIMEOUT_MINUTES` (default: 1440)
- `SESSION_MAX_DURATION_MINUTES` (default: 720)
- `SESSION_WARNING_THRESHOLD_MINUTES` (default: 5)

## Quick Start

### Complete Example: Chat Application

```javascript
// Initialize a chat with timeout management
async function startChat(agentId, userId) {
  const response = await fetch('/api/messaging/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      agentId, 
      userId,
      timeoutConfig: {
        timeoutMinutes: 30,        // 30 minutes of inactivity
        autoRenew: true,           // Auto-renew on each message
        maxDurationMinutes: 180,   // 3 hour maximum session
        warningThresholdMinutes: 5 // Warn 5 minutes before expiry
      }
    })
  });
  
  const { sessionId, expiresAt, timeoutConfig } = await response.json();
  
  console.log(`Session expires at: ${expiresAt}`);
  console.log(`Auto-renewal: ${timeoutConfig.autoRenew ? 'enabled' : 'disabled'}`);
  
  return sessionId;
}

// Send messages with session status tracking
async function sendMessage(sessionId, message) {
  const response = await fetch(
    `/api/messaging/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    }
  );
  
  const data = await response.json();
  
  // Check session status
  if (data.sessionStatus) {
    console.log(`Session renewed: ${data.sessionStatus.wasRenewed}`);
    console.log(`Expires at: ${data.sessionStatus.expiresAt}`);
    
    if (data.sessionStatus.isNearExpiration) {
      console.warn('Session is about to expire!');
    }
  }
  
  return data;
}

// Keep session alive with heartbeat
async function keepAlive(sessionId) {
  const response = await fetch(
    `/api/messaging/sessions/${sessionId}/heartbeat`,
    { method: 'POST' }
  );
  
  const { expiresAt, timeRemaining } = await response.json();
  console.log(`Session renewed, ${Math.floor(timeRemaining / 60000)} minutes remaining`);
  
  return response.json();
}
```

## Session Creation

### Creation Process

```typescript
async function createSession(request: CreateSessionRequest) {
  // Phase 1: Validation
  validateUUIDs(request.agentId, request.userId);
  validateMetadata(request.metadata);
  
  // Phase 2: Agent verification
  const agent = agents.get(request.agentId);
  if (!agent) throw new AgentNotFoundError();
  
  // Phase 3: Configuration resolution
  const agentConfig = getAgentTimeoutConfig(agent);
  const finalConfig = mergeTimeoutConfigs(
    request.timeoutConfig,
    agentConfig
  );
  
  // Phase 4: Infrastructure setup
  const sessionId = uuidv4();
  const channelId = uuidv4();
  
  // Atomic channel creation
  await serverInstance.createChannel({
    id: channelId,
    name: `session-${sessionId}`,
    type: ChannelType.DM,
    metadata: {
      sessionId,
      agentId: request.agentId,
      userId: request.userId,
      timeoutConfig: finalConfig,
      ...request.metadata
    }
  });
  
  // Phase 5: Session registration
  const session = new Session(sessionId, channelId, finalConfig);
  sessions.set(sessionId, session);
  
  return session;
}
```

## Session Operations

### Send Messages

```javascript
const messageResponse = await fetch(
  `http://localhost:3000/api/messaging/sessions/${sessionId}/messages`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: 'Hello, I need help with my account',
      metadata: {
        userTimezone: 'America/New_York'
      }
    })
  }
);
```