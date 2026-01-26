# a7046c18:packages_core_typescript_src_utils_streaming.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/streaming.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        chunkSize: chunk.length,
        maxAllowed: MAX_CHUNK_SIZE,
      },
    );
  }
}

/**
 * Trims buffer to prevent unbounded growth.
 */
function trimBuffer(
  buffer: string,
  maxSize: number = MAX_BUFFER,
  keepSize: number = 1024,
): string {
  if (buffer.length > maxSize) {
    return buffer.slice(-keepSize);
  }
  return buffer;
}

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
    validateChunkSize(chunk);
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
  private readonly openTag: string;
  private readonly closeTag: string;

  private buffer = "";
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
    if (this.finished) return "";

    validateChunkSize(chunk);
    this.buffer += chunk;

    // Trim buffer if too large and not inside tag
    if (!this.insideTag) {
      this.buffer = trimBuffer(this.buffer);
    }

    const result = extractTagContent(
      this.buffer,
      this.openTag,
      this.closeTag,
      this.insideTag,
      SAFE_MARGIN,
    );

    this.buffer = result.buffer;
    this.insideTag = result.insideTag;

    if (result.closed) {
      this.finished = true;
    }

    return result.content;
  }

  reset(): void {
    this.buffer = "";
    this.insideTag = false;
    this.finished = false;
  }
}

// ============================================================================
// ResponseStreamExtractor - Action-aware XML extraction (DefaultMessageService)
// ============================================================================

/** Response strategy based on <actions> content */
type ResponseStrategy = "pending" | "direct" | "delegated";

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
  private static readonly STREAM_TAGS = ["text"] as const;

  private buffer = "";
  private insideTag = false;
  private currentTag: string | null = null;
  private finished = false;
  private responseStrategy: ResponseStrategy = "pending";

  get done(): boolean {
    return this.finished;
  }

  reset(): void {
    this.buffer = "";
    this.insideTag = false;
    this.currentTag = null;
    this.finished = false;
```