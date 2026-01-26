# a7046c18:packages_docs_runtime_sessions-api.mdx:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```javascript
// In agent configuration
const agentConfig = {
  name: 'CustomerServiceBot',
  settings: {
    SESSION_TIMEOUT_MINUTES: '45',
    SESSION_AUTO_RENEW: 'true',
    SESSION_MAX_DURATION_MINUTES: '180',
    SESSION_WARNING_THRESHOLD_MINUTES: '5'
  }
};
```

## Complete API Reference

The Sessions API provides a comprehensive set of endpoints for managing stateful conversations with ElizaOS agents. This reference covers all available endpoints, request/response schemas, and error handling.

### Base URL

```
http://localhost:3000/api/messaging/sessions
```

### Authentication

Currently, the Sessions API does not require authentication. In production environments, you should implement appropriate authentication mechanisms.

### Endpoints

#### Create Session

Creates a new conversation session with an agent.

<Card title="POST /api/messaging/sessions" icon="plus">
  Create a new session with configurable timeout policies
</Card>

**Request Body:**

```typescript
interface CreateSessionRequest {
  agentId: string;           // UUID of the agent
  userId: string;            // UUID of the user
  metadata?: {               // Optional session metadata
    [key: string]: any;
  };
  timeoutConfig?: {          // Optional timeout configuration
    timeoutMinutes?: number;           // 5-1440 minutes
    autoRenew?: boolean;               // Default: true
    maxDurationMinutes?: number;       // Maximum session duration
    warningThresholdMinutes?: number;  // When to warn about expiration
  };
}
```

**Response (201 Created):**

```typescript
interface CreateSessionResponse {
  sessionId: string;
  agentId: string;
  userId: string;
  createdAt: Date;
  metadata: object;
  expiresAt: Date;
  timeoutConfig: SessionTimeoutConfig;
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/messaging/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "987f6543-e21b-12d3-a456-426614174000",
    "timeoutConfig": {
      "timeoutMinutes": 30,
      "autoRenew": true
    }
  }'
```

---

#### Get Session Information

Retrieves detailed information about a session including its current status.

<Card title="GET /api/messaging/sessions/{sessionId}" icon="info">
  Get session details and current status
</Card>

**Response (200 OK):**

```typescript
interface SessionInfoResponse {
  sessionId: string;
  agentId: string;
  userId: string;
  createdAt: Date;
  lastActivity: Date;
  metadata: object;
  expiresAt: Date;
  timeoutConfig: SessionTimeoutConfig;
  renewalCount: number;
  timeRemaining: number;     // Milliseconds until expiration
  isNearExpiration: boolean;  // True if within warning threshold
}
```

**Errors:**
- `404 Not Found` - Session does not exist
- `410 Gone` - Session has expired

---

#### Send Message

Sends a message within a session. Automatically renews the session if auto-renewal is enabled.

<Card title="POST /api/messaging/sessions/{sessionId}/messages" icon="paper-plane">
  Send a message in the conversation
</Card>

**Request Body:**

```typescript
interface SendMessageRequest {
  content: string;           // Message content (max 4000 chars)
  metadata?: {              // Optional message metadata
    [key: string]: any;
  };
  attachments?: any[];      // Optional attachments
}
```

**Response (201 Created):**

```typescript
interface MessageResponse {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  metadata: object;
  sessionStatus?: {         // Session renewal information
    expiresAt: Date;
```