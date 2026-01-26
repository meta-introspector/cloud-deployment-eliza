# a7046c18:packages_core_typescript_src_types_primitives.ts:1-132

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/primitives.ts:1-132
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { ChannelType } from "./environment";

/**
 * Defines a custom type UUID representing a universally unique identifier
 */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * Helper function to safely cast a string to strongly typed UUID
 * @param id The string UUID to validate and cast
 * @returns The same UUID with branded type information
 */
export function asUUID(id: string): UUID {
  if (
    !id ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  return id as UUID;
}

/**
 * Represents the content of a memory, message, or other information
 */
export interface Content {
  /** The agent's internal thought process */
  thought?: string;

  /** The main text content visible to users */
  text?: string;

  /** Optional actions to be performed */
  actions?: string[];

  /** Optional providers to use for context generation */
  providers?: string[];

  /** Optional source/origin of the content */
  source?: string;

  /** Optional target/destination for responses */
  target?: string;

  /** URL of the original message/post (e.g. tweet URL, Discord message link) */
  url?: string;

  /** UUID of parent message if this is a reply/thread */
  inReplyTo?: UUID;

  /** Array of media attachments */
  attachments?: Media[];

  /** room type */
  channelType?: ChannelType;

  /** Platform-provided metadata about mentions */
  mentionContext?: MentionContext;

  /**
   * Internal message ID used for streaming coordination.
   * Set during response generation to ensure streaming chunks and
   * final broadcast use the same message ID.
   */
  responseMessageId?: UUID;

  /**
   * Additional dynamic properties
   * Use specific properties above instead of this when possible
   */
  [key: string]: unknown;
}

/**
 * Platform-provided metadata about mentions.
 * Contains ONLY technical facts from the platform API.
 * This allows bootstrap to make intelligent decisions about responding
 * while keeping platform-specific logic isolated.
 */
export interface MentionContext {
  /** Platform native mention (@Discord, @Telegram, etc.) */
  isMention: boolean;

  /** Reply to agent's message */
  isReply: boolean;

  /** In a thread with agent */
  isThread: boolean;

  /** Platform-specific mention type for debugging/logging */
  mentionType?: "platform_mention" | "reply" | "thread" | "none";
}

/**
 * Represents a media attachment
 */
export type Media = {
  /** Unique identifier */
  id: string;

  /** Media URL */
  url: string;

  /** Media title */
  title?: string;

  /** Media source */
  source?: string;

  /** Media description */
  description?: string;

  /** Text content */
  text?: string;

  /** Content type */
  contentType?: ContentType;
};

export enum ContentType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  LINK = "link",
}

/**
 * A generic type for metadata objects, allowing for arbitrary key-value pairs.
 * This encourages consumers to perform type checking or casting.
 */
export type Metadata = Record<string, unknown>;
```