# 5e8c73c1:packages_core_src___tests___utils_streaming.test.ts:451-553

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/utils/streaming.test.ts:451-553
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const fullText = chunks.join('');
      expect(fullText).toBe('Content');
      expect(filter.done).toBe(true);
    });

    it('should stream text content incrementally', () => {
      const filter = new ActionStreamFilter();
      const chunks: string[] = [];

      chunks.push(filter.push('<response><text>Part 1 '));
      chunks.push(filter.push('Part 2 '));
      chunks.push(filter.push('Part 3'));
      chunks.push(filter.push('</text></response>'));

      const fullText = chunks.join('');
      expect(fullText).toBe('Part 1 Part 2 Part 3');
      expect(filter.done).toBe(true);
    });
  });

  describe('plain text handling', () => {
    it('should stream plain text immediately', () => {
      const filter = new ActionStreamFilter();
      const chunks: string[] = [];

      chunks.push(filter.push('Hello '));
      chunks.push(filter.push('world '));
      chunks.push(filter.push('!'));

      const fullText = chunks.join('');
      expect(fullText).toBe('Hello world !');
    });

    it('should stream text starting with letters', () => {
      const filter = new ActionStreamFilter();
      const result = filter.push('The quick brown fox');

      expect(result).toBe('The quick brown fox');
    });

    it('should stream text starting with numbers', () => {
      const filter = new ActionStreamFilter();
      const result = filter.push('123 is a number');

      expect(result).toBe('123 is a number');
    });
  });

  describe('reset and reuse', () => {
    it('should reset properly', () => {
      const filter = new ActionStreamFilter();

      filter.push('{"json": true}');
      filter.reset();

      const result = filter.push('plain text');
      expect(result).toBe('plain text');
    });

    it('should handle multiple uses after reset', () => {
      const filter = new ActionStreamFilter();

      // First use: JSON
      filter.push('{"a": 1}');
      expect(filter.done).toBe(false);

      // Reset and use for XML
      filter.reset();
      filter.push('<r><text>Msg</text></r>');
      expect(filter.done).toBe(true);

      // Reset and use for text
      filter.reset();
      const result = filter.push('Hello');
      expect(result).toBe('Hello');
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      const filter = new ActionStreamFilter();
      const result = filter.push('');

      expect(result).toBe('');
    });

    it('should handle only whitespace', () => {
      const filter = new ActionStreamFilter();
      const result = filter.push('   ');

      expect(result).toBe(''); // Not decided yet, waiting for actual content
    });

    it('should handle large XML without text tag efficiently', () => {
      const filter = new ActionStreamFilter();

      const largeXml = `<response><data>${'a'.repeat(100 * 1024)}</data></response>`;
      const result = filter.push(largeXml);

      expect(result).toBe(''); // No text tag, nothing streamed
    });
  });
});
```