# a7046c18:packages_core_typescript_src_schemas_character.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/schemas/character.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { z } from "zod";
import type { Character } from "../types/agent";
import { ChannelType } from "../types/environment";
import { ContentType } from "../types/primitives";

// UUID validation schema
export const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Invalid UUID format",
  )
  .describe("Unique identifier for the character in UUID format");

// Media attachment schema matching the Media type
export const mediaSchema = z
  .object({
    id: z.string().describe("Unique identifier for the media"),
    url: z.string().describe("URL of the media file"),
    title: z.string().optional().describe("Media title"),
    source: z.string().optional().describe("Media source"),
    description: z.string().optional().describe("Media description"),
    text: z
      .string()
      .optional()
      .describe("Text content associated with the media"),
    contentType: z
      .nativeEnum(ContentType)
      .optional()
      .describe("Type of media content"),
  })
  .loose()
  .describe("Media attachment with URL and metadata");

// Message content schema matching the Content interface
export const contentSchema = z
  .object({
    text: z
      .string()
      .optional()
      .describe("The main text content of the message"),
    thought: z
      .string()
      .optional()
      .describe("Internal thought process or reasoning"),
    actions: z
      .array(z.string())
      .optional()
      .describe("Actions to be taken in response"),
    providers: z
      .array(z.string())
      .optional()
      .describe("Data providers to use (e.g., KNOWLEDGE)"),
    source: z.string().optional().describe("Source of the content"),
    target: z.string().optional().describe("Target of the content"),
    url: z.string().optional().describe("Related URL"),
    inReplyTo: uuidSchema
      .optional()
      .describe("UUID of message this is replying to"),
    attachments: z
      .array(mediaSchema)
      .optional()
      .describe("Array of media attachments (images, videos, documents, etc.)"),
    channelType: z
      .enum(ChannelType)
      .optional()
      .describe("Type of channel this content is for"),
  })
  .catchall(z.unknown()) // Allow additional dynamic properties per Content interface
  .describe("Content structure for messages in conversation examples");

// MessageExample schema
export const messageExampleSchema = z
  .object({
    name: z
      .string()
      .describe(
        "Name of the speaker (can use {{name1}} placeholder for dynamic names)",
      ),
    content: contentSchema,
  })
  .describe("A single message in a conversation example");

// DirectoryItem schema
export const directoryItemSchema = z
  .object({
    directory: z
      .string()
      .describe("Path to a directory containing knowledge files"),
    shared: z
      .boolean()
      .optional()
      .describe("Whether this knowledge is shared across characters"),
  })
  .describe("Directory-based knowledge source");

// Knowledge item can be a string, object with path, or DirectoryItem
export const knowledgeItemSchema = z
  .union([
    z.string().describe("File path to a knowledge document"),
    z.object({
      path: z.string().describe("Path to a knowledge file"),
      shared: z
        .boolean()
        .optional()
        .describe("Whether this knowledge is shared across characters"),
    }),
    directoryItemSchema,
  ])
  .describe("Knowledge source - can be a file path, file object, or directory");

// TemplateType schema - can be string or function (we'll validate as string for JSON)
export const templateTypeSchema = z
  .union([
    z.string().describe("Template string with placeholders"),
    z
      .function()
      .optional(), // Functions won't be in JSON but allowed in runtime
  ])
  .describe(
    "Template for generating text - can be a string template or function",
  );

// Style configuration schema
export const styleSchema = z
  .object({
    all: z
      .array(z.string())
      .optional()
      .describe("Style guidelines applied to all types of responses"),
    chat: z
      .array(z.string())
      .optional()
      .describe("Style guidelines specific to chat/conversation responses"),
    post: z
      .array(z.string())
      .optional()
      .describe("Style guidelines specific to social media posts"),
  })
  .optional()
  .describe(
    "Style configuration defining how the character communicates across different contexts",
  );

// Settings schema - flexible object allowing any JSON-serializable values
export const settingsSchema = z
  .record(
    z.string(),
    z.union([
      z.string(),
```