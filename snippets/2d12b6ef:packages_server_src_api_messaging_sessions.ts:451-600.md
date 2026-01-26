# 2d12b6ef:packages_server_src_api_messaging_sessions.ts:451-600

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:451-600
**Novelty Score:** 35.43
**Concepts:** testing

```
  return {
    sessionId: session.id,
    channelId: session.channelId,
    agentId: session.agentId,
    userId: session.userId,
    createdAt: session.createdAt,
    lastActivity: session.lastActivity,
    metadata: session.metadata,
    expiresAt: session.expiresAt,
    timeoutConfig: session.timeoutConfig,
    renewalCount: session.renewalCount,
    timeRemaining,
    isNearExpiration: timeRemaining <= warningThresholdMs && timeRemaining > 0,
  };
}

/**
 * Validates session metadata
 */
function validateMetadata(metadata: unknown): void {
  if (!metadata || typeof metadata !== 'object') {
    return; // Empty metadata is valid
  }

  // Check metadata size
  const metadataStr = JSON.stringify(metadata);
  if (metadataStr.length > MAX_METADATA_SIZE) {
    throw new InvalidMetadataError(
      `Metadata exceeds maximum size of ${MAX_METADATA_SIZE} bytes`,
      metadata
    );
  }
}

/**
 * Validates message content
 */
function validateContent(content: unknown): content is string {
  if (typeof content !== 'string') {
    throw new InvalidContentError('Content must be a string', content);
  }

  if (content.length === 0) {
    throw new InvalidContentError('Content cannot be empty', content);
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new InvalidContentError(
      `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`,
      content
    );
  }

  return true;
}

/**
 * Express async handler wrapper to catch errors
 */
type AsyncRequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void> | void;

function asyncHandler(fn: AsyncRequestHandler): express.RequestHandler {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Creates a unified sessions router for simplified messaging
 * This abstracts away the complexity of servers/channels for simple use cases
 *
 * @param agents - Map of agent IDs to runtime instances
 * @param serverInstance - The message server instance for message handling
 * @returns Router with cleanup method to prevent memory leaks
 */
export function createSessionsRouter(elizaOS: ElizaOS, serverInstance: AgentServer): SessionRouter {
  const router = express.Router();

  /**
   * Health check - placed before parameterized routes to avoid conflicts
   * GET /api/messaging/sessions/health
   */
  router.get('/sessions/health', (_req: express.Request, res: express.Response) => {
    const now = Date.now();
    let activeSessions = 0;
    let expiringSoon = 0;
    let invalidSessions = 0;

    for (const session of sessions.values()) {
      if (!isValidSession(session)) {
        invalidSessions++;
        continue;
      }

      if (session.expiresAt.getTime() > now) {
        activeSessions++;
        if (shouldWarnAboutExpiration(session)) {
          expiringSoon++;
        }
      }
    }

    const response: HealthCheckResponse & {
      expiringSoon?: number;
      invalidSessions?: number;
      uptime?: number;
    } = {
      status: 'healthy',
      activeSessions,
      timestamp: new Date().toISOString(),
      expiringSoon,
      ...(invalidSessions > 0 && { invalidSessions }),
      uptime: process.uptime(),
    };
    res.json(response);
  });

  /**
   * Create a new messaging session
   * POST /api/messaging/sessions
   */
  router.post(
    '/sessions',
    asyncHandler(async (req: express.Request, res: express.Response) => {
      const body: CreateSessionRequest = req.body;

      // Validate request structure
      if (!isCreateSessionRequest(body)) {
        throw new MissingFieldsError(['agentId', 'userId']);
      }

      // Validate UUID formats
      if (!validateUuid(body.agentId)) {
        throw new InvalidUuidError('agentId', body.agentId);
      }
      if (!validateUuid(body.userId)) {
        throw new InvalidUuidError('userId', body.userId);
      }

      // Check if agent exists
      const agent = elizaOS.getAgent(body.agentId as UUID);
      if (!agent) {
        throw new AgentNotFoundError(body.agentId);
      }

      // Validate metadata if provided
```