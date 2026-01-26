# a7046c18:packages_docs_runtime_sessions-api.mdx:1651-1800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:1651-1800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```typescript
{
  success: true,
  message: "Session {sessionId} deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Session not found

---

#### List Sessions (Admin)

Lists all active sessions in the system. This is an administrative endpoint.

<Card title="GET /api/messaging/sessions" icon="list">
  List all active sessions
</Card>

**Response (200 OK):**

```typescript
interface ListSessionsResponse {
  sessions: SessionInfoResponse[];
  total: number;
  stats: {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
  };
}
```

---

#### Health Check

Checks the health status of the Sessions API service.

<Card title="GET /api/messaging/sessions/health" icon="heart-pulse">
  Check service health
</Card>

**Response (200 OK):**

```typescript
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  activeSessions: number;
  timestamp: string;
  expiringSoon?: number;      // Sessions near expiration
  invalidSessions?: number;    // Corrupted sessions detected
  uptime?: number;            // Service uptime in seconds
}
```

### Error Responses

All error responses follow a consistent format:

```typescript
interface ErrorResponse {
  error: string;              // Error message
  details?: {                // Additional context
    [key: string]: any;
  };
}
```

#### Common Error Codes

| Status Code | Error Type | Description |
|------------|------------|-------------|
| `400` | Bad Request | Invalid input parameters or request body |
| `404` | Not Found | Session or resource not found |
| `410` | Gone | Session has expired |
| `422` | Unprocessable Entity | Operation cannot be completed (e.g., max duration reached) |
| `500` | Internal Server Error | Unexpected server error |

#### Error Classes

The API uses specific error classes for different scenarios:

- `SessionNotFoundError` - Session does not exist
- `SessionExpiredError` - Session has exceeded its timeout
- `SessionCreationError` - Failed to create session
- `AgentNotFoundError` - Specified agent not found
- `InvalidUuidError` - Invalid UUID format
- `MissingFieldsError` - Required fields missing
- `InvalidContentError` - Message content validation failed
- `InvalidMetadataError` - Metadata exceeds size limit
- `InvalidPaginationError` - Invalid pagination parameters
- `InvalidTimeoutConfigError` - Invalid timeout configuration
- `SessionRenewalError` - Cannot renew session
- `MessageSendError` - Failed to send message

### Rate Limiting

Currently, the Sessions API does not implement rate limiting. In production, you should implement appropriate rate limiting based on your requirements.

### WebSocket Events

When using WebSocket connections alongside the Sessions API, the following events are available:

```typescript
// Join a session for real-time updates
socket.emit('join', { roomId: sessionId });

// Listen for new messages
socket.on('messageBroadcast', (message) => {
  // Handle new message
});

// Session expiration warning
socket.on('sessionExpirationWarning', (data) => {
  // data.sessionId, data.minutesRemaining
});

// Session expired
socket.on('sessionExpired', (data) => {
  // data.sessionId, data.expiredAt
});

// Session renewed
socket.on('sessionRenewed', (data) => {
  // data.sessionId, data.expiresAt, data.renewalCount
});
```

### Environment Variables

Configure the Sessions API behavior using these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `SESSION_DEFAULT_TIMEOUT_MINUTES` | 30 | Default session timeout |
| `SESSION_MIN_TIMEOUT_MINUTES` | 5 | Minimum allowed timeout |
| `SESSION_MAX_TIMEOUT_MINUTES` | 1440 | Maximum allowed timeout (24 hours) |
| `SESSION_MAX_DURATION_MINUTES` | 720 | Maximum total session duration (12 hours) |
| `SESSION_WARNING_THRESHOLD_MINUTES` | 5 | When to trigger expiration warning |
| `SESSION_CLEANUP_INTERVAL_MINUTES` | 5 | How often to clean expired sessions |
| `CLEAR_SESSIONS_ON_SHUTDOWN` | false | Clear all sessions on server shutdown |

### SDK Examples

#### JavaScript/TypeScript Client

```typescript
class SessionsAPIClient {
```