# 5e8c73c1:packages_core_src_utils_streaming.ts:451-492

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/streaming.ts:451-492
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  private detectContentType(): ContentType | null {
    const trimmed = this.buffer.trimStart();
    if (trimmed.length === 0) return null;

    const firstChar = trimmed[0];
    if (firstChar === '{' || firstChar === '[') return 'json';
    if (firstChar === '<') return 'xml';
    return 'text';
  }

  /** Handle plain text - stream everything */
  private handlePlainText(): string {
    const toStream = this.buffer;
    this.buffer = '';
    return toStream;
  }

  /** Handle XML content - extract and stream <text> tag content */
  private handleXml(): string {
    const result = extractTagContent(
      this.buffer,
      '<text>',
      '</text>',
      this.insideTextTag,
      SAFE_MARGIN
    );

    this.buffer = result.buffer;
    this.insideTextTag = result.insideTag;

    if (result.closed) {
      this.finished = true;
    }

    // Trim buffer if not inside tag and not found yet
    if (!this.insideTextTag && !result.closed) {
      this.buffer = trimBuffer(this.buffer, 1024, 1024);
    }

    return result.content;
  }
}
```