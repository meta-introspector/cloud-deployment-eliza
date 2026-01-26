# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import {
  type ActionEventPayload,
  ChannelType,
  composePromptFromState,
  type Content,
  type ControlMessagePayload,
  ContentType,
  createUniqueUuid,
  type EntityPayload,
  type EvaluatorEventPayload,
  EventType,
  type IAgentRuntime,
  imageDescriptionTemplate,
  type InvokePayload,
  logger,
  type Media,
  type Memory,
  type MentionContext,
  messageHandlerTemplate,
  type MessagePayload,
  ModelType,
  parseKeyValueXml,
  type Plugin,
  PluginEvents,
  postCreationTemplate,
  Role,
  type Room,
  type RunEventPayload,
  type UUID,
  type WorldPayload,
  getLocalServerUrl,
} from '@elizaos/core';
import { v4 } from 'uuid';

import * as actions from './actions/index.ts';
import * as evaluators from './evaluators/index.ts';
import * as providers from './providers/index.ts';

import { TaskService } from './services/task.ts';
import { EmbeddingGenerationService } from './services/embedding.ts';

/** Shape of image description XML response */
interface ImageDescriptionXml {
  description?: string;
  title?: string;
  text?: string;
}

/** Shape of message handler XML response */
interface MessageHandlerXml {
  thought?: string;
  actions?: string | string[];
  providers?: string | string[];
  text?: string;
  simple?: boolean;
}

/** Shape of post creation XML response */
interface PostCreationXml {
  post?: string;
  thought?: string;
}

export * from './actions/index.ts';
export * from './evaluators/index.ts';
export * from './providers/index.ts';

/**
 * Represents media data containing a buffer of data and the media type.
 * @typedef {Object} MediaData
 * @property {Buffer} data - The buffer of data.
 * @property {string} mediaType - The type of media.
 */
type MediaData = {
  data: Buffer;
  mediaType: string;
};

/**
 * Escapes special characters in a string to make it JSON-safe.
 */
/* // Removing JSON specific helpers
function escapeForJson(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/```/g, '\\`\\`\\`');
}

function sanitizeJson(rawJson: string): string {
  try {
    // Try parsing directly
    JSON.parse(rawJson);
    return rawJson; // Already valid
  } catch {
    // Continue to sanitization
  }

  // first, replace all newlines with \n
  const sanitized = rawJson
    .replace(/\n/g, '\\n')

    // then, replace all backticks with \\\`
    .replace(/`/g, '\\\`');

  // Regex to find and escape the "text" field
  const fixed = sanitized.replace(/"text"\s*:\s*"([\s\S]*?)"\s*,\s*"simple"/, (_match, group) => {
    const escapedText = escapeForJson(group);
    return `"text": "${escapedText}", "simple"`;
  });

  // Validate that the result is actually parseable
  try {
    JSON.parse(fixed);
    return fixed;
  } catch (e) {
    throw new Error(`Failed to sanitize JSON: ${e.message}`);
  }
}
*/

/**
 * Fetches media data from a list of attachments, supporting both HTTP URLs and local file paths.
 *
 * @param attachments Array of Media objects containing URLs or file paths to fetch media from
 * @returns Promise that resolves with an array of MediaData objects containing the fetched media data and content type
 */
/**
 * Fetches media data from given attachments.
 * @param {Media[]} attachments - Array of Media objects to fetch data from.
 * @returns {Promise<MediaData[]>} - A Promise that resolves with an array of MediaData objects.
 */
export async function fetchMediaData(attachments: Media[]): Promise<MediaData[]> {
  return Promise.all(
    attachments.map(async (attachment: Media) => {
      if (/^(http|https):\/\//.test(attachment.url)) {
        // Handle HTTP URLs
        const response = await fetch(attachment.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${attachment.url}`);
        }
        const mediaBuffer = Buffer.from(await response.arrayBuffer());
        const mediaType = attachment.contentType || 'image/png';
        return { data: mediaBuffer, mediaType };
      }
      // if (fs.existsSync(attachment.url)) {
      //   // Handle local file paths
      //   const mediaBuffer = await fs.promises.readFile(path.resolve(attachment.url));
      //   const mediaType = attachment.contentType || 'image/png';
```