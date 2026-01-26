# e5b94879:packages_api-client_src_types_sessions.ts:151-216

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/api-client/src/types/sessions.ts:151-216
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
  status: 'healthy' | 'unhealthy';
  activeSessions: number;
  timestamp: string;
}

/**
 * List sessions response
 */
export interface ListSessionsResponse {
  sessions: SessionInfoResponse[];
  total: number;
}

/**
 * User message data in the response
 */
export interface UserMessageData {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  metadata?: SessionMessageMetadata;
}

/**
 * Agent response content
 */
export interface AgentResponseContent {
  text: string;
  thought?: string;
  actions?: string[];
}

/**
 * Session status in the response
 */
export interface SessionStatusData {
  expiresAt: Date;
  renewalCount: number;
  wasRenewed: boolean;
  isNearExpiration: boolean;
}

/**
 * Message response when sending a message
 * New unified format with success flag and structured data
 */
export interface MessageResponse {
  success: boolean;
  userMessage: UserMessageData;
  /** Only present when transport is "http" */
  agentResponse?: AgentResponseContent;
  /** Session status information */
  sessionStatus?: SessionStatusData;
}

/**
 * @deprecated Use MessageResponse instead - old format for backward compatibility
 */
export interface LegacyMessageResponse {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  metadata?: SessionMessageMetadata;
}
```