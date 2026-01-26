# a7046c18:packages_docs_runtime_sessions-api.mdx:1501-1650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:1501-1650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    renewalCount: number;
    wasRenewed: boolean;
    isNearExpiration: boolean;
  };
}
```

**Errors:**
- `400 Bad Request` - Invalid content or metadata
- `404 Not Found` - Session not found
- `410 Gone` - Session expired

---

#### Get Messages

Retrieves messages from a session with pagination support.

<Card title="GET /api/messaging/sessions/{sessionId}/messages" icon="messages">
  Retrieve conversation history
</Card>

**Query Parameters:**

```typescript
interface GetMessagesQuery {
  limit?: string;    // Number of messages (1-100, default: 50)
  before?: string;   // Timestamp for pagination (older messages)
  after?: string;    // Timestamp for pagination (newer messages)
}
```

**Response (200 OK):**

```typescript
interface GetMessagesResponse {
  messages: SimplifiedMessage[];
  hasMore: boolean;
  cursors?: {
    before?: number;  // Use for getting older messages
    after?: number;   // Use for getting newer messages
  };
}

interface SimplifiedMessage {
  id: string;
  content: string;
  authorId: string;
  isAgent: boolean;
  createdAt: Date;
  metadata: {
    thought?: string;     // Agent's internal reasoning
    actions?: string[];   // Actions taken by agent
    [key: string]: any;
  };
}
```

---

#### Renew Session

Manually renews a session to extend its expiration time.

<Card title="POST /api/messaging/sessions/{sessionId}/renew" icon="refresh">
  Manually extend session lifetime
</Card>

**Response (200 OK):**

```typescript
interface SessionInfoResponse {
  sessionId: string;
  agentId: string;
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  timeoutConfig: SessionTimeoutConfig;
  renewalCount: number;
  timeRemaining: number;
  isNearExpiration: boolean;
}
```

**Errors:**
- `404 Not Found` - Session not found
- `410 Gone` - Session expired
- `422 Unprocessable Entity` - Cannot renew (max duration reached)

---

#### Update Timeout Configuration

Updates the timeout configuration for an active session.

<Card title="PATCH /api/messaging/sessions/{sessionId}/timeout" icon="clock">
  Modify session timeout settings
</Card>

**Request Body:**

```typescript
interface SessionTimeoutConfig {
  timeoutMinutes?: number;           // 5-1440 minutes
  autoRenew?: boolean;
  maxDurationMinutes?: number;
  warningThresholdMinutes?: number;
}
```

**Response (200 OK):**

Returns updated `SessionInfoResponse`

**Errors:**
- `400 Bad Request` - Invalid timeout configuration
- `404 Not Found` - Session not found
- `410 Gone` - Session expired

---

#### Send Heartbeat

Keeps a session alive and optionally renews it if auto-renewal is enabled.

<Card title="POST /api/messaging/sessions/{sessionId}/heartbeat" icon="heart">
  Keep session alive with periodic heartbeat
</Card>

**Response (200 OK):**

Returns `SessionInfoResponse` with updated expiration information.

**Errors:**
- `404 Not Found` - Session not found
- `410 Gone` - Session expired

---

#### Delete Session

Explicitly ends and removes a session.

<Card title="DELETE /api/messaging/sessions/{sessionId}" icon="trash">
  End and delete a session
</Card>

**Response (200 OK):**

```