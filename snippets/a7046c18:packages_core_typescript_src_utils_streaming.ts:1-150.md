# a7046c18:packages_core_typescript_src_utils_streaming.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/streaming.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Streaming utilities for filtering and extracting streamable content.
 *
 * This module provides implementations of {@link IStreamExtractor}:
 * - PassthroughExtractor - Simple passthrough (no filtering)
 * - XmlTagExtractor - Extract content from a specific XML tag
 * - ResponseStreamExtractor - Action-aware XML (for DefaultMessageService)
 * - ActionStreamFilter - Content-type aware filter (for action handlers)
 *
 * For the interface definition, see types/streaming.ts.
 * Implementations can use these or create their own extractors.
 */

import type { IStreamExtractor } from "../types/streaming";

// Re-export interface for convenience
export type { IStreamExtractor } from "../types/streaming";

// ============================================================================
// StreamError - Standardized error handling for streaming
// ============================================================================

/** Error codes for streaming operations */
export type StreamErrorCode =
  | "CHUNK_TOO_LARGE"
  | "BUFFER_OVERFLOW"
  | "PARSE_ERROR"
  | "TIMEOUT"
  | "ABORTED";

/**
 * Standardized error class for streaming operations.
 * Provides structured error codes for easier handling.
 */
export class StreamError extends Error {
  readonly code: StreamErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(
    code: StreamErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "StreamError";
    this.code = code;
    this.details = details;
  }

  /** Check if an error is a StreamError */
  static isStreamError(error: unknown): error is StreamError {
    return error instanceof StreamError;
  }
}

// ============================================================================
// Shared constants and utilities
// ============================================================================

/** Safe margin to keep when streaming to avoid splitting closing tags */
const SAFE_MARGIN = 10;

/** Maximum buffer size to prevent memory exhaustion (100KB) */
const MAX_BUFFER = 100 * 1024;

/** Maximum chunk size to prevent DoS (1MB) */
const MAX_CHUNK_SIZE = 1024 * 1024;

/** Pre-compiled regex for actions tag extraction */
const ACTIONS_REGEX = /<actions>([\s\S]*?)<\/actions>/;

/**
 * Result of attempting to extract content from an XML tag.
 */
interface TagExtractionResult {
  /** Content extracted (empty string if nothing yet) */
  content: string;
  /** Whether the closing tag was found */
  closed: boolean;
  /** Updated buffer after extraction */
  buffer: string;
  /** Whether we're now inside the tag */
  insideTag: boolean;
}

/**
 * Extracts content from an XML tag in a streaming-friendly way.
 * Shared utility used by multiple extractors.
 *
 * @param buffer - Current accumulated buffer
 * @param openTag - Opening tag (e.g., "<text>")
 * @param closeTag - Closing tag (e.g., "</text>")
 * @param insideTag - Whether we're currently inside the tag
 * @param safeMargin - Margin to keep for potential split tags
 * @returns Extraction result with content and updated state
 */
function extractTagContent(
  buffer: string,
  openTag: string,
  closeTag: string,
  insideTag: boolean,
  safeMargin: number = SAFE_MARGIN,
): TagExtractionResult {
  let currentBuffer = buffer;
  let currentInsideTag = insideTag;

  // Look for opening tag if not inside
  if (!currentInsideTag) {
    const idx = currentBuffer.indexOf(openTag);
    if (idx !== -1) {
      currentInsideTag = true;
      currentBuffer = currentBuffer.slice(idx + openTag.length);
    } else {
      return {
        content: "",
        closed: false,
        buffer: currentBuffer,
        insideTag: false,
      };
    }
  }

  // Check for closing tag
  const closeIdx = currentBuffer.indexOf(closeTag);
  if (closeIdx !== -1) {
    const content = currentBuffer.slice(0, closeIdx);
    const newBuffer = currentBuffer.slice(closeIdx + closeTag.length);
    return { content, closed: true, buffer: newBuffer, insideTag: false };
  }

  // Stream safe content (keep margin for potential closing tag split)
  if (currentBuffer.length > safeMargin) {
    const content = currentBuffer.slice(0, -safeMargin);
    const newBuffer = currentBuffer.slice(-safeMargin);
    return { content, closed: false, buffer: newBuffer, insideTag: true };
  }

  return { content: "", closed: false, buffer: currentBuffer, insideTag: true };
}

/**
 * Validates and limits chunk size to prevent DoS attacks.
 * @throws StreamError if chunk exceeds maximum size
 */
function validateChunkSize(chunk: string): void {
  if (chunk.length > MAX_CHUNK_SIZE) {
    throw new StreamError(
      "CHUNK_TOO_LARGE",
      `Chunk size ${chunk.length} exceeds maximum allowed ${MAX_CHUNK_SIZE}`,
      {
```