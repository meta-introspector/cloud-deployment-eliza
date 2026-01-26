# a69475c0:packages_core_src_utils_streaming.ts:1-150

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils/streaming.ts:1-150
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
/**
 * Streaming utilities for filtering and extracting streamable content.
 *
 */

// ============================================================================
// Response Stream Extractor - For initial LLM response parsing
// ============================================================================

/** Response strategy based on <actions> content */
type ResponseStrategy = 'pending' | 'direct' | 'delegated';

/**
 * Extracts streamable text from XML-structured LLM responses.
 * Used by default-message-service.ts for the initial response from runSingleShotCore.
 *
 * Strategy:
 * - Parse <actions> to determine if response is direct (REPLY) or delegated (other actions)
 * - If direct: stream <text> content immediately
 * - If delegated: skip <text> (action handler will generate its own response)
 * - Always stream <message> content (from action handlers)
 */
export class ResponseStreamExtractor {
  private static readonly MAX_BUFFER = 100 * 1024;
  private static readonly SAFE_MARGIN = 10;
  private static readonly STREAM_TAGS = ['text', 'message'];

  private buffer = '';
  private insideTag = false;
  private currentTag: string | null = null;
  private finished = false;
  private responseStrategy: ResponseStrategy = 'pending';

  /** Whether extraction is complete */
  get done(): boolean {
    return this.finished;
  }

  /** Reset extractor state for reuse */
  reset(): void {
    this.buffer = '';
    this.insideTag = false;
    this.currentTag = null;
    this.finished = false;
    this.responseStrategy = 'pending';
  }

  /**
   * Push a chunk and extract streamable text.
   * @param chunk - Raw chunk from LLM stream
   * @returns Text to stream to client (empty string if nothing to stream)
   */
  push(chunk: string): string {
    this.buffer += chunk;

    // Detect strategy from <actions> tag (comes before <text>)
    if (this.responseStrategy === 'pending') {
      this.detectResponseStrategy();
    }

    // Look for streamable tags
    if (!this.insideTag) {
      for (const tag of ResponseStreamExtractor.STREAM_TAGS) {
        const openTag = `<${tag}>`;
        const idx = this.buffer.indexOf(openTag);
        if (idx !== -1) {
          // Check if we should stream this tag
          if (!this.shouldStreamTag(tag)) {
            // Skip tag entirely - wait for closing tag and remove
            const closeTag = `</${tag}>`;
            const closeIdx = this.buffer.indexOf(closeTag);
            if (closeIdx !== -1) {
              this.buffer = this.buffer.slice(closeIdx + closeTag.length);
              continue;
            }
            break; // Wait for closing tag
          }

          this.insideTag = true;
          this.currentTag = tag;
          this.buffer = this.buffer.slice(idx + openTag.length);
          break;
        }
      }
    }

    // Prevent unbounded buffer growth
    if (!this.insideTag && this.buffer.length > ResponseStreamExtractor.MAX_BUFFER) {
      this.buffer = this.buffer.slice(-1024);
    }

    if (!this.insideTag) return '';

    // Check for closing tag
    const closeTag = `</${this.currentTag}>`;
    const closeIdx = this.buffer.indexOf(closeTag);
    if (closeIdx !== -1) {
      const content = this.buffer.slice(0, closeIdx);
      this.buffer = this.buffer.slice(closeIdx + closeTag.length);
      this.insideTag = false;
      this.currentTag = null;
      this.finished = true;
      return content;
    }

    // Stream safe content (keep margin for potential closing tag split)
    if (this.buffer.length > ResponseStreamExtractor.SAFE_MARGIN) {
      const toStream = this.buffer.slice(0, -ResponseStreamExtractor.SAFE_MARGIN);
      this.buffer = this.buffer.slice(-ResponseStreamExtractor.SAFE_MARGIN);
      return toStream;
    }

    return '';
  }

  /** Detect response strategy from <actions> tag */
  private detectResponseStrategy(): void {
    const match = this.buffer.match(/<actions>([\s\S]*?)<\/actions>/);
    if (match) {
      const actions = this.parseActions(match[1]);
      this.responseStrategy = this.isDirectReply(actions) ? 'direct' : 'delegated';
    }
  }

  /** Parse comma-separated actions */
  private parseActions(raw: string): string[] {
    return raw
      .split(',')
      .map((a) => a.trim().toUpperCase())
      .filter(Boolean);
  }

  /** Check if actions represent a direct reply */
  private isDirectReply(actions: string[]): boolean {
    return actions.length === 1 && actions[0] === 'REPLY';
  }

  /** Determine if a tag should be streamed based on strategy */
  private shouldStreamTag(tag: string): boolean {
    if (tag === 'message') return true;
    if (tag === 'text') return this.responseStrategy === 'direct';
    return false;
  }
}

// ============================================================================
// Action Stream Filter - For action handler response filtering
// ============================================================================

/**
```