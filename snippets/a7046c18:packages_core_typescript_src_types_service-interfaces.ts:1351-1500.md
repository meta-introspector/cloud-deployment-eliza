# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 * Interface for email services.
 */
export abstract class IEmailService extends Service {
  static override readonly serviceType = ServiceType.EMAIL;

  public readonly capabilityDescription =
    "Email sending, receiving, and management capabilities";

  /**
   * Send an email.
   * @param message Email message to send.
   * @param options Send options.
   * @returns Message ID.
   */
  abstract sendEmail(
    message: EmailMessage,
    options?: EmailSendOptions,
  ): Promise<string>;

  /**
   * Get emails from a folder.
   * @param options Search options.
   */
  abstract getEmails(options?: EmailSearchOptions): Promise<EmailMessage[]>;

  /**
   * Get a specific email by ID.
   * @param messageId Message ID.
   */
  abstract getEmail(messageId: string): Promise<EmailMessage>;

  /**
   * Delete an email.
   * @param messageId Message ID.
   */
  abstract deleteEmail(messageId: string): Promise<void>;

  /**
   * Mark an email as read/unread.
   * @param messageId Message ID.
   * @param read True to mark as read.
   */
  abstract markEmailAsRead(messageId: string, read: boolean): Promise<void>;

  /**
   * Flag/unflag an email.
   * @param messageId Message ID.
   * @param flagged True to flag.
   */
  abstract flagEmail(messageId: string, flagged: boolean): Promise<void>;

  /**
   * Move email to a different folder.
   * @param messageId Message ID.
   * @param folderPath Destination folder path.
   */
  abstract moveEmail(messageId: string, folderPath: string): Promise<void>;

  /**
   * Get available folders.
   */
  abstract getFolders(): Promise<EmailFolder[]>;

  /**
   * Create a new folder.
   * @param folderName Name of the folder.
   * @param parentPath Optional parent folder path.
   */
  abstract createFolder(folderName: string, parentPath?: string): Promise<void>;

  /**
   * Get account information.
   */
  abstract getAccountInfo(): Promise<EmailAccount>;

  /**
   * Search emails.
   * @param query Search query.
   * @param options Search options.
   */
  abstract searchEmails(
    query: string,
    options?: EmailSearchOptions,
  ): Promise<EmailMessage[]>;
}

// ============================================================================
// Message Interfaces
// ============================================================================

/**
 * Message participant information.
 */
export interface MessageParticipant {
  /** Participant ID */
  id: UUID;
  /** Display name */
  name: string;
  /** Username */
  username?: string;
  /** Avatar URL */
  avatar?: string;
  /** Online status */
  status?: "online" | "offline" | "away" | "busy";
}

/**
 * Message attachment.
 */
export interface MessageAttachment {
  /** Attachment ID */
  id: UUID;
  /** Filename */
  filename: string;
  /** File URL */
  url: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Width for images/videos */
  width?: number;
  /** Height for images/videos */
  height?: number;
  /** Duration for audio/video */
  duration?: number;
  /** Thumbnail URL */
  thumbnail?: string;
}

/**
 * Message reaction.
 */
export interface MessageReaction {
  /** Emoji used */
  emoji: string;
  /** Number of reactions */
  count: number;
  /** User IDs who reacted */
  users: UUID[];
  /** Whether current user has reacted */
  hasReacted: boolean;
}

/**
 * Message reference (reply/forward/quote).
 */
export interface MessageReference {
  /** Referenced message ID */
  messageId: UUID;
```