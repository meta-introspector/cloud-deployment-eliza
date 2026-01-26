# a7046c18:packages_core_typescript_src___tests___utils_streaming.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/streaming.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import {
  ActionStreamFilter,
  type IStreamExtractor,
  PassthroughExtractor,
  ResponseStreamExtractor,
  XmlTagExtractor,
} from "../../utils/streaming";

// ============================================================================
// IStreamExtractor interface conformance
// ============================================================================

describe("IStreamExtractor interface", () => {
  it("PassthroughExtractor implements IStreamExtractor", () => {
    const extractor: IStreamExtractor = new PassthroughExtractor();
    expect(extractor.done).toBe(false);
    expect(typeof extractor.push).toBe("function");
  });

  it("XmlTagExtractor implements IStreamExtractor", () => {
    const extractor: IStreamExtractor = new XmlTagExtractor("text");
    expect(extractor.done).toBe(false);
    expect(typeof extractor.push).toBe("function");
  });

  it("ResponseStreamExtractor implements IStreamExtractor", () => {
    const extractor: IStreamExtractor = new ResponseStreamExtractor();
    expect(extractor.done).toBe(false);
    expect(typeof extractor.push).toBe("function");
  });

  it("ActionStreamFilter implements IStreamExtractor", () => {
    const extractor: IStreamExtractor = new ActionStreamFilter();
    expect(extractor.done).toBe(false);
    expect(typeof extractor.push).toBe("function");
  });
});

// ============================================================================
// PassthroughExtractor
// ============================================================================

describe("PassthroughExtractor", () => {
  it("should pass through all content immediately", () => {
    const extractor = new PassthroughExtractor();
    expect(extractor.push("Hello")).toBe("Hello");
    expect(extractor.push(" world!")).toBe(" world!");
  });

  it("should never be done", () => {
    const extractor = new PassthroughExtractor();
    extractor.push("content");
    expect(extractor.done).toBe(false);
  });

  it("should handle empty strings", () => {
    const extractor = new PassthroughExtractor();
    expect(extractor.push("")).toBe("");
  });
});

// ============================================================================
// XmlTagExtractor
// ============================================================================

describe("XmlTagExtractor", () => {
  describe("basic functionality", () => {
    it("should extract content from specified tag", () => {
      const extractor = new XmlTagExtractor("text");
      const result = extractor.push(
        "<response><text>Hello world!</text></response>",
      );
      expect(result).toBe("Hello world!");
      expect(extractor.done).toBe(true);
    });

    it("should work with custom tag names", () => {
      const extractor = new XmlTagExtractor("message");
      const result = extractor.push(
        "<response><message>Custom tag</message></response>",
      );
      expect(result).toBe("Custom tag");
    });

    it("should ignore content outside target tag", () => {
      const extractor = new XmlTagExtractor("text");
      const result = extractor.push(
        "<response><other>ignored</other><text>extracted</text></response>",
      );
      expect(result).toBe("extracted");
    });
  });

  describe("streaming chunks", () => {
    it("should handle tag split across chunks", () => {
      const extractor = new XmlTagExtractor("text");
      const chunks: string[] = [];

      chunks.push(extractor.push("<response><te"));
      chunks.push(extractor.push("xt>Content</text></response>"));

      expect(chunks.join("")).toBe("Content");
      expect(extractor.done).toBe(true);
    });

    it("should stream content progressively", () => {
      const extractor = new XmlTagExtractor("text");
      const chunks: string[] = [];

      chunks.push(extractor.push("<text>"));
      chunks.push(extractor.push("Hello beautiful "));
      chunks.push(extractor.push("world! How are "));
      chunks.push(extractor.push("you today?"));
      chunks.push(extractor.push("</text>"));

      expect(chunks.join("")).toBe("Hello beautiful world! How are you today?");
    });

    it("should handle closing tag split across chunks", () => {
      const extractor = new XmlTagExtractor("text");
      const chunks: string[] = [];

      chunks.push(extractor.push("<text>Content</te"));
      chunks.push(extractor.push("xt>"));

      expect(chunks.join("")).toBe("Content");
    });
  });

  describe("edge cases", () => {
    it("should return empty when tag not found", () => {
      const extractor = new XmlTagExtractor("text");
      const result = extractor.push(
        "<response><other>content</other></response>",
      );
      expect(result).toBe("");
      expect(extractor.done).toBe(false);
    });

    it("should handle empty tag content", () => {
      const extractor = new XmlTagExtractor("text");
      const result = extractor.push("<text></text>");
      expect(result).toBe("");
      expect(extractor.done).toBe(true);
    });

    it("should not extract after done", () => {
      const extractor = new XmlTagExtractor("text");
      extractor.push("<text>First</text>");
```