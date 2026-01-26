# 01bfdece:packages_core_src_utils_streaming.ts:301-377

**Commit:** 01bfdece25ba458ee6499cab094d202fc217f6ad
**Author:** standujar
**Date:** Wed Dec 17 17:38:43 2025 +0100
**File:** packages/core/src/utils/streaming.ts:301-377
**Novelty Score:** 12.60
**Concepts:** plugin-system, testing

```
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

    // XML → Look for <text> tag and stream its content
    return this.handleXml();
  }

  /** Handle XML content - extract and stream <text> tag content */
  private handleXml(): string {
    if (!this.insideTextTag) {
      const openTag = '<text>';
      const idx = this.buffer.indexOf(openTag);
      if (idx !== -1) {
        this.insideTextTag = true;
        this.buffer = this.buffer.slice(idx + openTag.length);
      } else {
        if (this.buffer.length > 1024) {
          this.buffer = this.buffer.slice(-1024);
        }
        return '';
      }
    }

    const closeTag = '</text>';
    const closeIdx = this.buffer.indexOf(closeTag);
    if (closeIdx !== -1) {
      const content = this.buffer.slice(0, closeIdx);
      this.buffer = this.buffer.slice(closeIdx + closeTag.length);
      this.insideTextTag = false;
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