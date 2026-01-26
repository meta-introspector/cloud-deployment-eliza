# 5e8c73c1:packages_core_src___tests___utils_streaming.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/utils/streaming.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
});

// ============================================================================
// ResponseStreamExtractor
// ============================================================================

describe('ResponseStreamExtractor', () => {
  describe('basic functionality', () => {
    it('should extract text content from complete XML', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push(
        '<response><actions>REPLY</actions><text>Hello world!</text></response>'
      );

      expect(result).toBe('Hello world!');
      expect(extractor.done).toBe(true);
    });

    it('should return empty string when no streamable content', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push('<response><thought>thinking</thought>');

      expect(result).toBe('');
      expect(extractor.done).toBe(false);
    });

    it('should reset properly', () => {
      const extractor = new ResponseStreamExtractor();

      extractor.push('<actions>REPLY</actions><text>First</text>');
      expect(extractor.done).toBe(true);

      extractor.reset();
      expect(extractor.done).toBe(false);

      const result = extractor.push('<actions>REPLY</actions><text>Second</text>');
      expect(result).toBe('Second');
      expect(extractor.done).toBe(true);
    });
  });

  describe('response strategy detection', () => {
    it('should stream <text> when action is REPLY (direct strategy)', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push(
        '<response><actions>REPLY</actions><text>Direct response</text></response>'
      );

      expect(result).toBe('Direct response');
    });

    it('should NOT stream <text> when action is not REPLY (delegated strategy)', () => {
      const extractor = new ResponseStreamExtractor();
      const chunks: string[] = [];

      chunks.push(extractor.push('<response><actions>SEARCH</actions>'));
      chunks.push(extractor.push('<text>This should not stream</text></response>'));

      const fullText = chunks.join('');
      expect(fullText).toBe('');
    });

    it('should NOT stream <text> when multiple actions (delegated)', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push(
        '<response><actions>REPLY,SEARCH</actions><text>Should not stream</text></response>'
      );

      expect(result).toBe('');
    });

    it('should NOT stream <text> when action is delegated (SEARCH)', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push(
        '<response><actions>SEARCH</actions><text>Action handler message</text></response>'
      );

      // Delegated actions use ActionStreamFilter separately, not ResponseStreamExtractor
      expect(result).toBe('');
    });

    it('should handle case-insensitive action names', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push(
        '<response><actions>reply</actions><text>Lowercase reply</text></response>'
      );

      expect(result).toBe('Lowercase reply');
    });

    it('should handle whitespace in actions tag', () => {
      const extractor = new ResponseStreamExtractor();
      const result = extractor.push(
        '<response><actions>  REPLY  </actions><text>Trimmed</text></response>'
      );

      expect(result).toBe('Trimmed');
    });
  });

  describe('streaming chunks', () => {
    it('should handle <text> tag split across chunks', () => {
      const extractor = new ResponseStreamExtractor();
      const chunks: string[] = [];

      chunks.push(extractor.push('<actions>REPLY</actions><te'));
      chunks.push(extractor.push('xt>Content here</text>'));

      const fullText = chunks.join('');
      expect(fullText).toBe('Content here');
      expect(extractor.done).toBe(true);
    });

    it('should handle </text> tag split across chunks', () => {
      const extractor = new ResponseStreamExtractor();
      const chunks: string[] = [];

      chunks.push(extractor.push('<actions>REPLY</actions><text>Hello'));
      chunks.push(extractor.push(' world</te'));
      chunks.push(extractor.push('xt>'));

      const fullText = chunks.join('');
      expect(fullText).toBe('Hello world');
      expect(extractor.done).toBe(true);
    });

    it('should stream content incrementally for long text', () => {
      const extractor = new ResponseStreamExtractor();
      const chunks: string[] = [];

      chunks.push(extractor.push('<actions>REPLY</actions><text>'));
      chunks.push(extractor.push('Hello beautiful '));
      chunks.push(extractor.push('world! How are '));
      chunks.push(extractor.push('you today?'));
      chunks.push(extractor.push('</text>'));

      const fullText = chunks.join('');
      expect(fullText).toBe('Hello beautiful world! How are you today?');
      expect(extractor.done).toBe(true);
    });

    it('should handle large content before <text> tag without memory issues', () => {
      const extractor = new ResponseStreamExtractor();

      const largeThought = 'a'.repeat(150 * 1024); // 150KB
      let result = extractor.push(`<actions>REPLY</actions><thought>${largeThought}</thought>`);
      expect(result).toBe('');
      expect(extractor.done).toBe(false);

      result = extractor.push('<text>Finally some text</text>');
```