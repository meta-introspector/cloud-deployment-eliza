# a69475c0:packages_core_src___tests___utils.test.ts:301-450

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/__tests__/utils.test.ts:301-450
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    let mockRuntime: IAgentRuntime;

    beforeEach(() => {
      mockRuntime = {
        useModel: mock(async (type, params) => {
          if (type === 'TEXT_TOKENIZER_ENCODE') {
            // Simple mock: each word is a token
            return params.prompt.split(' ');
          }
          if (type === 'TEXT_TOKENIZER_DECODE') {
            // Simple mock: join tokens back
            return params.tokens.join(' ');
          }
          return null;
        }),
      } as Partial<IAgentRuntime> as IAgentRuntime;
    });

    it('should trim tokens to specified limit', async () => {
      const prompt = 'one two three four five six seven eight nine ten';
      const result = await trimTokens(prompt, 5, mockRuntime);

      expect(result).toBe('six seven eight nine ten');
      expect(mockRuntime.useModel).toHaveBeenCalledTimes(2);
    });

    it('should return unchanged if within limit', async () => {
      const prompt = 'short text';
      const result = await trimTokens(prompt, 10, mockRuntime);

      expect(result).toBe(prompt);
    });

    it('should throw error for invalid inputs', async () => {
      await expect(trimTokens('', 10, mockRuntime)).rejects.toThrow();
      await expect(trimTokens('text', 0, mockRuntime)).rejects.toThrow();
      await expect(trimTokens('text', -1, mockRuntime)).rejects.toThrow();
    });

    it('should skip tokenization for very short prompts', async () => {
      const prompt = 'hi';
      const result = await trimTokens(prompt, 100, mockRuntime);

      expect(result).toBe(prompt);
      expect(mockRuntime.useModel).not.toHaveBeenCalled();
    });
  });

  describe('parseKeyValueXml', () => {
    it('should parse response XML blocks', () => {
      const xml = `<response>
                <name>TestAgent</name>
                <reasoning>Test reasoning</reasoning>
                <action>RESPOND</action>
            </response>`;

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        name: 'TestAgent',
        reasoning: 'Test reasoning',
        action: 'RESPOND',
      });
    });

    it('should handle comma-separated lists for specific keys', () => {
      const xml = `<response>
                <actions>ACTION1,ACTION2,ACTION3</actions>
                <providers>PROVIDER1, PROVIDER2</providers>
                <evaluators>EVAL1, EVAL2</evaluators>
            </response>`;

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        actions: ['ACTION1', 'ACTION2', 'ACTION3'],
        providers: ['PROVIDER1', 'PROVIDER2'],
        evaluators: ['EVAL1', 'EVAL2'],
      });
    });

    it('should parse boolean values', () => {
      const xml = '<response><simple>true</simple><complex>false</complex></response>';

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        simple: true,
        complex: 'false', // Only 'simple' key is treated as boolean
      });
    });

    it('should handle XML entities', () => {
      const xml = '<response><text>Value with &lt;tags&gt; &amp; entities</text></response>';

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        text: 'Value with <tags> & entities',
      });
    });

    it('should return null for invalid XML', () => {
      expect(parseKeyValueXml('')).toBeNull();
      expect(parseKeyValueXml('not xml')).toBeNull();
      expect(parseKeyValueXml('<unclosed>')).toBeNull();
    });

    it('should handle any root tag name', () => {
      const xml = '<custom><key>value</key></custom>';
      const result = parseKeyValueXml(xml);
      expect(result).toEqual({ key: 'value' });
    });

    it('should handle mismatched XML tags', () => {
      // This tests lines 393-395 - warning about mismatched tags
      const xml = '<response><start>value</end></response>';
      const result = parseKeyValueXml(xml);
      // Should still try to parse what it can
      expect(result).toBeNull();
    });

    it('should return null when no key-value pairs are found', () => {
      // This tests lines 400-403 - no key-value pairs extracted
      const xml = '<response></response>'; // Empty response
      const result = parseKeyValueXml(xml);
      expect(result).toBeNull();

      // Also test with content that doesn't match the pattern
      const xml2 = '<response>Just plain text</response>';
      const result2 = parseKeyValueXml(xml2);
      expect(result2).toBeNull();
    });

    it('should handle empty comma-separated lists', () => {
      const xml = `<response>
                <actions></actions>
                <providers> </providers>
            </response>`;

      const result = parseKeyValueXml(xml);
      expect(result).toEqual({
        actions: [],
        providers: [],
      });
    });

    it('should correctly handle nested same-name tags in fallback scan', () => {
      // No <response> tag so fallback scanner is used
      const xml = '<container><text><text>inner</text>outer</text></container>';
      const result = parseKeyValueXml(xml);
      // Ensure we did not truncate at the inner </text>
      expect(result).not.toBeNull();
      expect(result!.text).toContain('outer');
```