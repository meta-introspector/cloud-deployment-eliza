# a69475c0:packages_core_src___tests___utils.test.ts:1051-1177

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/__tests__/utils.test.ts:1051-1177
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    it('should handle empty body', () => {
      const header = 'Header';
      const body = '';

      const result = addHeader(header, body);

      // Empty body returns empty string regardless of header
      expect(result).toBe('');
    });

    it('should handle both empty', () => {
      const result = addHeader('', '');

      // Both empty returns empty string
      expect(result).toBe('');
    });

    it('should handle multiline header and body', () => {
      const header = 'Line 1\nLine 2';
      const body = 'Body line 1\nBody line 2';

      const result = addHeader(header, body);

      // Single newline between header and body, newline at end
      expect(result).toBe('Line 1\nLine 2\nBody line 1\nBody line 2\n');
    });
  });

  // we test this via composePrompt and composePromptFromState
  /*
  it('upgradeDoubleToTriple converts double braces to triple', () => {
    const tpl = 'Hello {{name}} and {{#if cond}}{{value}}{{/if}}';
    const out = upgradeDoubleToTriple(tpl);
    expect(out).toBe('Hello {{{name}}} and {{#if cond}}{{{value}}}{{/if}}');
  });
  */

  it('addHeader prepends header when body exists', () => {
    expect(addHeader('Head', 'Body')).toBe('Head\nBody\n');
    expect(addHeader('Head', '')).toBe('');
  });

  // we test this via composePrompt and composePromptFromState
  /*
  it('composeRandomUser replaces placeholders', () => {
    const result = composeRandomUser('hi {{name1}} {{name2}}', 2);
    expect(result).not.toContain('{{');
  });
  */

  it('parseKeyValueXml parses simple xml block', () => {
    const xml = '<response><key>value</key><actions>a,b</actions><simple>true</simple></response>';
    const parsed = parseKeyValueXml(xml);
    expect(parsed).toEqual({ key: 'value', actions: ['a', 'b'], simple: true });
  });

  it('safeReplacer handles circular objects', () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    const str = JSON.stringify(obj, safeReplacer());
    expect(str).toContain('[Circular]');
  });

  it('validateUuid validates correct uuid and rejects bad values', () => {
    const valid = validateUuid('123e4567-e89b-12d3-a456-426614174000');
    const invalid = validateUuid('not-a-uuid');
    expect(valid).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(invalid).toBeNull();
  });

  it('composePrompt inserts state values', () => {
    //const spy = vi.spyOn(utils, 'composeRandomUser').mockImplementation((t) => t);
    const out = utils.composePrompt({ state: { a: 'x' }, template: 'Hello {{a}}' });
    expect(out).toBe('Hello x');
    //spy.mockRestore();
  });

  it('composePromptFromState flattens state values', () => {
    //const spy = vi.spyOn(utils, 'composeRandomUser').mockImplementation((t) => t);
    const out = utils.composePromptFromState({
      state: { values: { b: 'y' }, data: {}, text: '', c: 'z' },
      template: '{{b}} {{c}}',
    });
    expect(out).toBe('y z');
    //spy.mockRestore();
  });

  it('formatPosts formats conversation text', () => {
    const messages = [
      {
        id: '1',
        entityId: 'e1',
        roomId: 'r1',
        createdAt: 1,
        content: { text: 'hi', source: 'chat' },
      },
      {
        id: stringToUuid('2'),
        entityId: stringToUuid('e1'),
        roomId: stringToUuid('r1'),
        createdAt: 2,
        content: { text: 'there', source: 'chat' },
      },
    ] as Memory[];
    const entities: Entity[] = [{ id: stringToUuid('e1'), names: ['Alice'], metadata: {}, agentId: stringToUuid('agent-1') }];
    const result = utils.formatPosts({ messages, entities });
    expect(result).toContain('Conversation:');
    expect(result).toContain('Alice');
    expect(result).toContain('hi');
    expect(result).toContain('there');
  });

  it('trimTokens truncates using runtime tokenizer', async () => {
    const runtime = {
      useModel: mock(
        async (type: (typeof ModelType)[keyof typeof ModelType], { prompt, tokens }: any) => {
          if (type === ModelType.TEXT_TOKENIZER_ENCODE) {return prompt.split(' ');}
          if (type === ModelType.TEXT_TOKENIZER_DECODE) {return tokens.join(' ');}
          return [];
        }
      ),
    } as Partial<IAgentRuntime> as IAgentRuntime;
    const result = await utils.trimTokens('a b c d e', 3, runtime);
    expect(result).toBe('c d e');
  });

});
```