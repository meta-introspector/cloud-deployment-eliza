# 5e8c73c1:packages_core_src_utils_streaming.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/streaming.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    if (!this.insideTag) {
      for (const tag of ResponseStreamExtractor.STREAM_TAGS) {
        const openTag = `<${tag}>`;
        const closeTag = `</${tag}>`;
        const idx = this.buffer.indexOf(openTag);

        if (idx !== -1) {
          // Check if we should stream this tag
          if (!this.shouldStreamTag(tag)) {
            // Skip tag entirely - wait for closing tag and remove
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

    // Trim buffer if too large and not inside tag
    if (!this.insideTag) {
      this.buffer = trimBuffer(this.buffer);
      return '';
    }

    // Extract content from current tag using shared helper
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
    if (this.buffer.length > SAFE_MARGIN) {
      const toStream = this.buffer.slice(0, -SAFE_MARGIN);
      this.buffer = this.buffer.slice(-SAFE_MARGIN);
      return toStream;
    }

    return '';
  }

  /** Detect response strategy from <actions> tag using pre-compiled regex */
  private detectResponseStrategy(): void {
    const match = this.buffer.match(ACTIONS_REGEX);
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
    return tag === 'text' && this.responseStrategy === 'direct';
  }
}

// ============================================================================
// ActionStreamFilter - For action handler response filtering
// ============================================================================

/** Detected content type from first character */
type ContentType = 'json' | 'xml' | 'text';

/**
 * Filters action handler output for streaming.
 * Used by runtime.ts processActions() for each action's useModel calls.
 *
 * Auto-detects content type from first non-whitespace character:
 * - JSON (starts with { or [) → Don't stream (structured data for parsing)
 * - XML (starts with <) → Look for <text> tag and stream its content
 * - Plain text → Stream immediately
 */
export class ActionStreamFilter implements IStreamExtractor {
  private buffer = '';
  private decided = false;
  private contentType: ContentType | null = null;
  private insideTextTag = false;
  private finished = false;

  get done(): boolean {
    return this.finished;
  }

  reset(): void {
    this.buffer = '';
    this.decided = false;
    this.contentType = null;
    this.insideTextTag = false;
    this.finished = false;
  }

  push(chunk: string): string {
    validateChunkSize(chunk);
    this.buffer += chunk;

    // Decide content type on first non-whitespace character
    if (!this.decided) {
      const contentType = this.detectContentType();
      if (contentType) {
        this.contentType = contentType;
        this.decided = true;
      } else {
        return '';
      }
    }

    // Route based on content type
    switch (this.contentType) {
      case 'json':
        return ''; // Never stream JSON

      case 'text':
        return this.handlePlainText();

      case 'xml':
        return this.handleXml();

      default:
        return '';
    }
  }

  /** Detect content type from first non-whitespace character */
```