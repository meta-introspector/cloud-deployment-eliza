# a7046c18:packages_docs_runtime_sessions-api.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

const response = await messageResponse.json();
console.log(response.content); // Agent's response
console.log(response.metadata.thought); // Agent's internal reasoning
```

### Retrieve Message History

```javascript
// Initial fetch
const messagesResponse = await fetch(
  `http://localhost:3000/api/messaging/sessions/${sessionId}/messages?limit=20`,
  {
    method: 'GET',
  }
);

const { messages, hasMore, cursors } = await messagesResponse.json();

// Pagination - get older messages
if (hasMore && cursors?.before) {
  const olderMessages = await fetch(
    `/api/messaging/sessions/${sessionId}/messages?before=${cursors.before}&limit=20`
  );
}

// Get newer messages
if (cursors?.after) {
  const newerMessages = await fetch(
    `/api/messaging/sessions/${sessionId}/messages?after=${cursors.after}&limit=20`
  );
}
```

### Manual Session Renewal

```javascript
// Useful when auto-renew is disabled or to extend before expiration
const renewResponse = await fetch(
  `http://localhost:3000/api/messaging/sessions/${sessionId}/renew`,
  {
    method: 'POST',
  }
);

const { 
  expiresAt, 
  timeRemaining, 
  renewalCount 
} = await renewResponse.json();

console.log(`Session renewed ${renewalCount} times`);
console.log(`New expiration: ${expiresAt}`);
console.log(`Time remaining: ${Math.floor(timeRemaining / 60000)} minutes`);
```

### Update Timeout Configuration

```javascript
// Dynamically update timeout settings for an active session
const updateResponse = await fetch(
  `http://localhost:3000/api/messaging/sessions/${sessionId}/timeout`,
  {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeoutMinutes: 120,        // Extend to 2 hours
      autoRenew: false,           // Disable auto-renewal
      maxDurationMinutes: 480     // Increase max to 8 hours
    })
  }
);

const updatedSession = await updateResponse.json();
```

## Active Session Management

### Message Handling

```typescript
async function handleMessage(sessionId: string, message: SendMessageRequest) {
  const session = sessions.get(sessionId);
  
  // Expiration check
  if (session.isExpired()) {
    sessions.delete(sessionId);
    throw new SessionExpiredError();
  }
  
  // Activity tracking
  session.updateLastActivity();
  
  // Renewal logic
  if (session.timeoutConfig.autoRenew) {
    const renewed = session.attemptRenewal();
    if (renewed) {
      logger.info(`Session ${sessionId} auto-renewed`);
    }
  }
  
  // Warning detection
  if (session.isNearExpiration()) {
    session.markWarningState();
  }
  
  // Message creation
  const dbMessage = await serverInstance.createMessage({
    channelId: session.channelId,
    authorId: session.userId,
    content: message.content,
    metadata: {
      sessionId,
      ...message.metadata
    }
  });
  
  // Response enrichment
  return {
    ...dbMessage,
    sessionStatus: session.getStatus()
  };
}
```

## Renewal Mechanism

### Renewal Engine

```typescript
class SessionRenewalEngine {
  attemptRenewal(session: Session): boolean {
    // Check if renewal is allowed
    if (!session.timeoutConfig.autoRenew) {
      return false;
    }
    
    // Check maximum duration constraint
    const totalDuration = Date.now() - session.createdAt.getTime();
    const maxDurationMs = session.timeoutConfig.maxDurationMinutes * 60 * 1000;
    
    if (totalDuration >= maxDurationMs) {
      logger.warn(`Session ${session.id} reached max duration`);
      return false;
    }
    
    // Calculate new expiration
    const timeoutMs = session.timeoutConfig.timeoutMinutes * 60 * 1000;
    const remainingMaxDuration = maxDurationMs - totalDuration;
    const effectiveTimeout = Math.min(timeoutMs, remainingMaxDuration);
```