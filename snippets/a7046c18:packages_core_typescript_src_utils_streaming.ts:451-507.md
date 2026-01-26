# a7046c18:packages_core_typescript_src_utils_streaming.ts:451-507

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/streaming.ts:451-507
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      case "json":
        return ""; // Never stream JSON

      case "text":
        return this.handlePlainText();

      case "xml":
        return this.handleXml();

      default:
        return "";
    }
  }

  /** Detect content type from first non-whitespace character */
  private detectContentType(): ContentType | null {
    const trimmed = this.buffer.trimStart();
    if (trimmed.length === 0) return null;

    const firstChar = trimmed[0];
    if (firstChar === "{" || firstChar === "[") return "json";
    if (firstChar === "<") return "xml";
    return "text";
  }

  /** Handle plain text - stream everything */
  private handlePlainText(): string {
    const toStream = this.buffer;
    this.buffer = "";
    return toStream;
  }

  /** Handle XML content - extract and stream <text> tag content */
  private handleXml(): string {
    const result = extractTagContent(
      this.buffer,
      "<text>",
      "</text>",
      this.insideTextTag,
      SAFE_MARGIN,
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