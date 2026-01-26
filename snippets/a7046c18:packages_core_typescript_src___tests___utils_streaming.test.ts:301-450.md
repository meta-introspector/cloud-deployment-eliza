# a7046c18:packages_core_typescript_src___tests___utils_streaming.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/streaming.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    it("should handle large content before <text> tag without memory issues", () => {
      const extractor = new ResponseStreamExtractor();

      const largeThought = "a".repeat(150 * 1024); // 150KB
      let result = extractor.push(
        `<actions>REPLY</actions><thought>${largeThought}</thought>`,
      );
      expect(result).toBe("");
      expect(extractor.done).toBe(false);

      result = extractor.push("<text>Finally some text</text>");
      expect(result).toBe("Finally some text");
      expect(extractor.done).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should return empty string after done", () => {
      const extractor = new ResponseStreamExtractor();

      extractor.push("<actions>REPLY</actions><text>Hello</text>");
      expect(extractor.done).toBe(true);

      const result = extractor.push("more content");
      expect(result).toBe("");
    });

    it("should handle empty text content", () => {
      const extractor = new ResponseStreamExtractor();

      const result = extractor.push("<actions>REPLY</actions><text></text>");
      expect(result).toBe("");
      expect(extractor.done).toBe(true);
    });

    it("should handle newlines in text content", () => {
      const extractor = new ResponseStreamExtractor();

      const result = extractor.push(
        "<actions>REPLY</actions><text>Line 1\nLine 2\nLine 3</text>",
      );
      expect(result).toBe("Line 1\nLine 2\nLine 3");
    });

    it("should handle special characters in text content", () => {
      const extractor = new ResponseStreamExtractor();

      const result = extractor.push(
        '<actions>REPLY</actions><text>Special: &lt;tag&gt; &amp; "quotes"</text>',
      );
      expect(result).toBe('Special: &lt;tag&gt; &amp; "quotes"');
    });

    it("should wait for actions before deciding strategy", () => {
      const extractor = new ResponseStreamExtractor();
      const chunks: string[] = [];

      // Text comes before actions are known
      chunks.push(extractor.push("<response><text>Early text"));
      chunks.push(
        extractor.push("</text><actions>SEARCH</actions></response>"),
      );

      // Since actions were determined after text started, behavior depends on implementation
      // Currently, pending strategy treats text as not streamable until decided
      expect(extractor.done).toBe(false); // Text was skipped
    });
  });
});

describe("ActionStreamFilter", () => {
  describe("content type detection", () => {
    it("should detect JSON from first character {", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push('{"key": "value"}');

      expect(result).toBe(""); // JSON is never streamed
    });

    it("should detect JSON array from first character [", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push("[1, 2, 3]");

      expect(result).toBe(""); // JSON is never streamed
    });

    it("should detect XML from first character <", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push("<response><text>Hello</text></response>");

      expect(result).toBe("Hello");
    });

    it("should detect plain text and stream immediately", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push("Hello world!");

      expect(result).toBe("Hello world!");
    });

    it("should handle leading whitespace before detection", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push("   Hello world!");

      expect(result).toBe("   Hello world!"); // Whitespace included in output
    });

    it("should handle leading whitespace before JSON", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push('   {"key": "value"}');

      expect(result).toBe(""); // JSON detected after whitespace, not streamed
    });
  });

  describe("JSON handling", () => {
    it("should never stream JSON objects", () => {
      const filter = new ActionStreamFilter();
      const chunks: string[] = [];

      chunks.push(filter.push('{"name":'));
      chunks.push(filter.push(' "test",'));
      chunks.push(filter.push(' "value": 123}'));

      const fullText = chunks.join("");
      expect(fullText).toBe("");
    });

    it("should never stream JSON arrays", () => {
      const filter = new ActionStreamFilter();
      const chunks: string[] = [];

      chunks.push(filter.push("["));
      chunks.push(filter.push('"item1",'));
      chunks.push(filter.push(' "item2"]'));

      const fullText = chunks.join("");
      expect(fullText).toBe("");
    });
  });

  describe("XML handling", () => {
    it("should extract <text> tag content from XML", () => {
      const filter = new ActionStreamFilter();
      const result = filter.push(
        "<response><text>Action result</text></response>",
      );

      expect(result).toBe("Action result");
```