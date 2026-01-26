# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1501-1650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1501-1650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  /** Channel of referenced message */
  channelId: UUID;
  /** Type of reference */
  type: "reply" | "forward" | "quote";
}

/**
 * Message content.
 */
export interface MessageContent {
  /** Plain text content */
  text?: string;
  /** HTML content */
  html?: string;
  /** Markdown content */
  markdown?: string;
  /** Attachments */
  attachments?: MessageAttachment[];
  /** Reactions */
  reactions?: MessageReaction[];
  /** Reference to another message */
  reference?: MessageReference;
  /** Mentioned user IDs */
  mentions?: UUID[];
  /** Embedded content */
  embeds?: Array<{
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
  }>;
}

/**
 * Message information.
 */
export interface MessageInfo {
  /** Message ID */
  id: UUID;
  /** Channel ID */
  channelId: UUID;
  /** Sender ID */
  senderId: UUID;
  /** Message content */
  content: MessageContent;
  /** Sent timestamp */
  timestamp: Date;
  /** Edit timestamp */
  edited?: Date;
  /** Deletion timestamp */
  deleted?: Date;
  /** Whether message is pinned */
  pinned?: boolean;
  /** Thread information */
  thread?: {
    id: UUID;
    messageCount: number;
    participants: UUID[];
    lastMessageAt: Date;
  };
}

/**
 * Message send options.
 */
export interface MessageSendOptions {
  /** Reply to message ID */
  replyTo?: UUID;
  /** Ephemeral (only visible to sender) */
  ephemeral?: boolean;
  /** Silent (no notification) */
  silent?: boolean;
  /** Scheduled send time */
  scheduled?: Date;
  /** Thread ID */
  thread?: UUID;
  /** Nonce for deduplication */
  nonce?: string;
}

/**
 * Message search options.
 */
export interface MessageSearchOptions {
  /** Search query */
  query?: string;
  /** Filter by channel */
  channelId?: UUID;
  /** Filter by sender */
  senderId?: UUID;
  /** Filter messages before date */
  before?: Date;
  /** Filter messages after date */
  after?: Date;
  /** Maximum results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Filter with attachments only */
  hasAttachments?: boolean;
  /** Filter pinned only */
  pinned?: boolean;
  /** Filter mentioning user */
  mentions?: UUID;
}

/**
 * Message channel.
 */
export interface MessageChannel {
  /** Channel ID */
  id: UUID;
  /** Channel name */
  name: string;
  /** Channel type */
  type: "text" | "voice" | "dm" | "group" | "announcement" | "thread";
  /** Channel description */
  description?: string;
  /** Channel participants */
  participants?: MessageParticipant[];
  /** User permissions */
  permissions?: {
    canSend: boolean;
    canRead: boolean;
    canDelete: boolean;
    canPin: boolean;
    canManage: boolean;
  };
  /** Last message timestamp */
  lastMessageAt?: Date;
  /** Total message count */
  messageCount?: number;
  /** Unread message count */
  unreadCount?: number;
}

/**
 * Interface for platform messaging services (Discord, Slack, etc).
 * Note: Not to be confused with the internal IMessageService for message handling.
 */
export abstract class IMessagingService extends Service {
  static override readonly serviceType = ServiceType.MESSAGE;

  public readonly capabilityDescription =
    "Platform messaging and channel management capabilities";
```