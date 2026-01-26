# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1651-1800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1651-1800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

  /**
   * Send a message to a channel.
   * @param channelId Channel ID.
   * @param content Message content.
   * @param options Send options.
   * @returns Message ID.
   */
  abstract sendMessage(
    channelId: UUID,
    content: MessageContent,
    options?: MessageSendOptions,
  ): Promise<UUID>;

  /**
   * Get messages from a channel.
   * @param channelId Channel ID.
   * @param options Search options.
   */
  abstract getMessages(
    channelId: UUID,
    options?: MessageSearchOptions,
  ): Promise<MessageInfo[]>;

  /**
   * Get a specific message by ID.
   * @param messageId Message ID.
   */
  abstract getMessage(messageId: UUID): Promise<MessageInfo>;

  /**
   * Edit a message.
   * @param messageId Message ID.
   * @param content New message content.
   */
  abstract editMessage(messageId: UUID, content: MessageContent): Promise<void>;

  /**
   * Delete a message.
   * @param messageId Message ID.
   */
  abstract deleteMessage(messageId: UUID): Promise<void>;

  /**
   * Add a reaction to a message.
   * @param messageId Message ID.
   * @param emoji Reaction emoji.
   */
  abstract addReaction(messageId: UUID, emoji: string): Promise<void>;

  /**
   * Remove a reaction from a message.
   * @param messageId Message ID.
   * @param emoji Reaction emoji.
   */
  abstract removeReaction(messageId: UUID, emoji: string): Promise<void>;

  /**
   * Pin a message.
   * @param messageId Message ID.
   */
  abstract pinMessage(messageId: UUID): Promise<void>;

  /**
   * Unpin a message.
   * @param messageId Message ID.
   */
  abstract unpinMessage(messageId: UUID): Promise<void>;

  /**
   * Get available channels.
   */
  abstract getChannels(): Promise<MessageChannel[]>;

  /**
   * Get channel information.
   * @param channelId Channel ID.
   */
  abstract getChannel(channelId: UUID): Promise<MessageChannel>;

  /**
   * Create a new channel.
   * @param name Channel name.
   * @param type Channel type.
   * @param options Channel options.
   * @returns New channel ID.
   */
  abstract createChannel(
    name: string,
    type: MessageChannel["type"],
    options?: {
      description?: string;
      participants?: UUID[];
      private?: boolean;
    },
  ): Promise<UUID>;

  /**
   * Search messages across channels.
   * @param query Search query.
   * @param options Search options.
   */
  abstract searchMessages(
    query: string,
    options?: MessageSearchOptions,
  ): Promise<MessageInfo[]>;
}

// ============================================================================
// Post/Social Media Interfaces
// ============================================================================

/**
 * Post media content.
 */
export interface PostMedia {
  /** Media ID */
  id: UUID;
  /** Media URL */
  url: string;
  /** Media type */
  type: "image" | "video" | "audio" | "document";
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
  /** Description */
  description?: string;
  /** Alt text for accessibility */
  altText?: string;
}

/**
 * Post location.
 */
export interface PostLocation {
  /** Location name */
  name: string;
  /** Address */
  address?: string;
  /** Coordinates */
  coordinates?: {
```