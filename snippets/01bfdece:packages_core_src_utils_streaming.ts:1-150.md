# 01bfdece:packages_core_src_utils_streaming.ts:1-150

**Commit:** 01bfdece25ba458ee6499cab094d202fc217f6ad
**Author:** standujar
**Date:** Wed Dec 17 17:38:43 2025 +0100
**File:** packages/core/src/utils/streaming.ts:1-150
**Novelty Score:** 12.60
**Concepts:** plugin-system, testing

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

import type { IStreamExtractor } from '../types/streaming';

// Re-export interface for convenience
export type { IStreamExtractor } from '../types/streaming';

// ============================================================================
// PassthroughExtractor - Simplest implementation
// ============================================================================

/**
 * Streams all content as-is without any filtering.
 * Use when LLM output is already in the desired format (e.g., plain text responses).
 */
export class PassthroughExtractor implements IStreamExtractor {
  get done(): boolean {
    return false; // Never "done" - always accepts more
  }

  push(chunk: string): string {
    return chunk; // Pass through everything
  }

  reset(): void {
    // Nothing to reset
  }
}

// ============================================================================
// XmlTagExtractor - Simple XML tag content extraction
// ============================================================================

/**
 * Extracts content from a specific XML tag, streaming it progressively.
 * Use when you have a simple XML format like `<response><text>content</text></response>`.
 *
 * @example
 * ```ts
 * const extractor = new XmlTagExtractor('text');
 * extractor.push('<response><text>Hello'); // Returns 'Hel' (keeps margin for split tags)
 * extractor.push(' world!</text></response>'); // Returns 'lo world!'
 * ```
 */
export class XmlTagExtractor implements IStreamExtractor {
  private static readonly SAFE_MARGIN = 10;
  private static readonly MAX_BUFFER = 100 * 1024;

  private readonly openTag: string;
  private readonly closeTag: string;

  private buffer = '';
  private insideTag = false;
  private finished = false;

  constructor(tagName: string) {
    this.openTag = `<${tagName}>`;
    this.closeTag = `</${tagName}>`;
  }

  get done(): boolean {
    return this.finished;
  }

  push(chunk: string): string {
    if (this.finished) return '';

    this.buffer += chunk;

    // Look for opening tag
    if (!this.insideTag) {
      const idx = this.buffer.indexOf(this.openTag);
      if (idx !== -1) {
        this.insideTag = true;
        this.buffer = this.buffer.slice(idx + this.openTag.length);
      } else {
        // Prevent unbounded buffer growth
        if (this.buffer.length > XmlTagExtractor.MAX_BUFFER) {
          this.buffer = this.buffer.slice(-1024);
        }
        return '';
      }
    }

    // Check for closing tag
    const closeIdx = this.buffer.indexOf(this.closeTag);
    if (closeIdx !== -1) {
      const content = this.buffer.slice(0, closeIdx);
      this.buffer = this.buffer.slice(closeIdx + this.closeTag.length);
      this.insideTag = false;
      this.finished = true;
      return content;
    }

    // Stream safe content (keep margin for potential closing tag split)
    if (this.buffer.length > XmlTagExtractor.SAFE_MARGIN) {
      const toStream = this.buffer.slice(0, -XmlTagExtractor.SAFE_MARGIN);
      this.buffer = this.buffer.slice(-XmlTagExtractor.SAFE_MARGIN);
      return toStream;
    }

    return '';
  }

  reset(): void {
    this.buffer = '';
    this.insideTag = false;
    this.finished = false;
  }
}

// ============================================================================
// ResponseStreamExtractor - Action-aware XML extraction (DefaultMessageService)
// ============================================================================

/** Response strategy based on <actions> content */
type ResponseStrategy = 'pending' | 'direct' | 'delegated';

/**
 * Extracts streamable text from XML-structured LLM responses with action-based routing.
 *
 * This is the default implementation used by DefaultMessageService.
 * It understands the `<actions>` tag to determine whether to stream `<text>` content.
 *
 * Strategy:
 * - Parse <actions> to determine if response is direct (REPLY) or delegated (other actions)
 * - If direct: stream <text> content immediately
 * - If delegated: skip <text> (action handler will generate its own response via ActionStreamFilter)
 *
 * For simpler use cases without action routing, use {@link XmlTagExtractor} instead.
 */
export class ResponseStreamExtractor implements IStreamExtractor {
  private static readonly MAX_BUFFER = 100 * 1024;
  private static readonly SAFE_MARGIN = 10;
  private static readonly STREAM_TAGS = ['text'];

  private buffer = '';
  private insideTag = false;
  private currentTag: string | null = null;
```