# a69475c0:packages_core_src_utils_streaming.ts:151-258

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils/streaming.ts:151-258
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
 * Filters action handler output for streaming.
 * Used by runtime.ts processActions() for each action's useModel calls.
 *
 * Rules (decides on first non-whitespace character - no magic thresholds):
 * - JSON (starts with { or [) → Don't stream (structured data for parsing)
 * - XML (starts with <) → Look for <message> tag and stream its content
 * - Plain text → Stream immediately
 */
export class ActionStreamFilter {
  private static readonly SAFE_MARGIN = 10;

  private buffer = '';
  private decided = false;
  private contentType: 'json' | 'xml' | 'text' | null = null;
  private insideMessageTag = false;
  private finished = false;

  /** Whether filtering is complete */
  get done(): boolean {
    return this.finished;
  }

  /** Reset filter state for reuse */
  reset(): void {
    this.buffer = '';
    this.decided = false;
    this.contentType = null;
    this.insideMessageTag = false;
    this.finished = false;
  }

  /**
   * Push a chunk and filter for streaming.
   * @param chunk - Raw chunk from action's useModel stream
   * @returns Text to stream to client (empty string if filtered out)
   */
  push(chunk: string): string {
    this.buffer += chunk;

    // Decide content type on first non-whitespace character
    if (!this.decided) {
      const trimmed = this.buffer.trimStart();
      if (trimmed.length > 0) {
        const firstChar = trimmed[0];
        if (firstChar === '{' || firstChar === '[') {
          this.contentType = 'json';
        } else if (firstChar === '<') {
          this.contentType = 'xml';
        } else {
          this.contentType = 'text';
        }
        this.decided = true;
      }
    }

    if (!this.decided) return '';

    // JSON → Never stream (structured data)
    if (this.contentType === 'json') {
      return '';
    }

    // Plain text → Stream everything immediately
    if (this.contentType === 'text') {
      const toStream = this.buffer;
      this.buffer = '';
      return toStream;
    }

    // XML → Look for <message> tag and stream its content
    return this.handleXml();
  }

  /** Handle XML content - extract and stream <message> tag content */
  private handleXml(): string {
    if (!this.insideMessageTag) {
      const openTag = '<message>';
      const idx = this.buffer.indexOf(openTag);
      if (idx !== -1) {
        this.insideMessageTag = true;
        this.buffer = this.buffer.slice(idx + openTag.length);
      } else {
        if (this.buffer.length > 1024) {
          this.buffer = this.buffer.slice(-1024);
        }
        return '';
      }
    }

    const closeTag = '</message>';
    const closeIdx = this.buffer.indexOf(closeTag);
    if (closeIdx !== -1) {
      const content = this.buffer.slice(0, closeIdx);
      this.buffer = this.buffer.slice(closeIdx + closeTag.length);
      this.insideMessageTag = false;
      this.finished = true;
      return content;
    }

    if (this.buffer.length > ActionStreamFilter.SAFE_MARGIN) {
      const toStream = this.buffer.slice(0, -ActionStreamFilter.SAFE_MARGIN);
      this.buffer = this.buffer.slice(-ActionStreamFilter.SAFE_MARGIN);
      return toStream;
    }

    return '';
  }
}
```