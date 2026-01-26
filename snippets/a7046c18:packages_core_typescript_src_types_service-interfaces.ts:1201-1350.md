# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }>;
}

// ============================================================================
// Email Interfaces
// ============================================================================

/**
 * Email address with optional name.
 */
export interface EmailAddress {
  /** Email address */
  email: string;
  /** Display name */
  name?: string;
}

/**
 * Email attachment.
 */
export interface EmailAttachment {
  /** Filename */
  filename: string;
  /** Content as buffer or base64 string */
  content: Buffer | string;
  /** MIME type */
  contentType?: string;
  /** Content disposition */
  contentDisposition?: "attachment" | "inline";
  /** Content ID for inline attachments */
  cid?: string;
}

/**
 * Email message.
 */
export interface EmailMessage {
  /** Sender address */
  from: EmailAddress;
  /** Recipients */
  to: EmailAddress[];
  /** CC recipients */
  cc?: EmailAddress[];
  /** BCC recipients */
  bcc?: EmailAddress[];
  /** Email subject */
  subject: string;
  /** Plain text body */
  text?: string;
  /** HTML body */
  html?: string;
  /** Attachments */
  attachments?: EmailAttachment[];
  /** Reply-to address */
  replyTo?: EmailAddress;
  /** Send date */
  date?: Date;
  /** Message ID */
  messageId?: string;
  /** References header */
  references?: string[];
  /** In-Reply-To header */
  inReplyTo?: string;
  /** Priority level */
  priority?: "high" | "normal" | "low";
}

/**
 * Email send options.
 */
export interface EmailSendOptions {
  /** Number of retries */
  retry?: number;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Track email opens */
  trackOpens?: boolean;
  /** Track link clicks */
  trackClicks?: boolean;
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Email search options.
 */
export interface EmailSearchOptions {
  /** Search query */
  query?: string;
  /** Filter by sender */
  from?: string;
  /** Filter by recipient */
  to?: string;
  /** Filter by subject */
  subject?: string;
  /** Filter by folder */
  folder?: string;
  /** Filter emails since date */
  since?: Date;
  /** Filter emails before date */
  before?: Date;
  /** Maximum results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Filter unread only */
  unread?: boolean;
  /** Filter flagged only */
  flagged?: boolean;
  /** Filter with attachments only */
  hasAttachments?: boolean;
}

/**
 * Email folder.
 */
export interface EmailFolder {
  /** Folder name */
  name: string;
  /** Folder path */
  path: string;
  /** Folder type */
  type: "inbox" | "sent" | "drafts" | "trash" | "spam" | "custom";
  /** Total message count */
  messageCount?: number;
  /** Unread message count */
  unreadCount?: number;
  /** Child folders */
  children?: EmailFolder[];
}

/**
 * Email account information.
 */
export interface EmailAccount {
  /** Email address */
  email: string;
  /** Display name */
  name?: string;
  /** Email provider */
  provider?: string;
  /** Available folders */
  folders?: EmailFolder[];
  /** Storage used in bytes */
  quotaUsed?: number;
  /** Storage limit in bytes */
  quotaLimit?: number;
}

/**
```