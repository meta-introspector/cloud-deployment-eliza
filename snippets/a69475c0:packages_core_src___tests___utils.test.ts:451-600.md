# a69475c0:packages_core_src___tests___utils.test.ts:451-600

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/__tests__/utils.test.ts:451-600
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
      expect(result!.text).toContain('<text>inner</text>');
    });

    it('should treat self-closing tags with whitespace as self-closing and skip them', () => {
      // First tag is self-closing with whitespace before '/>'
      const xml = '<sc /> <container><key>value</key></container>';
      const result = parseKeyValueXml(xml);
      expect(result).toEqual({ key: 'value' });
    });

    it('should handle malicious input without ReDoS (unclosed response tag)', () => {
      // This input would cause exponential backtracking with regex /<response>([\s\S]*?)<\/response>/
      // With linear search, it should complete in O(n) time
      const maliciousInput = `<response>${'a'.repeat(10000)}`;
      const startTime = Date.now();
      const result = parseKeyValueXml(maliciousInput);
      const elapsed = Date.now() - startTime;

      // Should return null (no closing tag) and complete quickly (< 100ms)
      expect(result).toBeNull();
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('formatMessages', () => {
    const mockEntities: Entity[] = [
      {
        id: stringToUuid('entity-1'),
        names: ['Alice'],
        metadata: {},
        agentId: stringToUuid('agent-1'),
      },
      {
        id: stringToUuid('entity-2'),
        names: ['Bob'],
        metadata: {},
        agentId: stringToUuid('agent-1'),
      },
    ];

    it('should format messages with basic content', () => {
      const entityId = stringToUuid('entity-1');
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId,
          roomId: stringToUuid('room-1'),
          createdAt: Date.now() - 60000, // 1 minute ago
          content: {
            text: 'Hello world',
            source: 'chat',
          } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).toContain('Alice');
      expect(result).toContain('Hello world');
      expect(result).toContain('1 minute ago');
      expect(result).toContain(`[${entityId}]`);
    });

    it('should format messages with actions and thoughts', () => {
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: stringToUuid('entity-2'),
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: {
            text: 'Doing something',
            thought: 'I should help',
            actions: ['SEARCH', 'REPLY'],
            source: 'chat',
          } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).toContain('Bob');
      expect(result).toContain('Doing something');
      expect(result).toContain("(Bob's internal thought: I should help)");
      expect(result).toContain("(Bob's actions: SEARCH, REPLY)");
    });

    it('should handle attachments', () => {
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: stringToUuid('entity-1'),
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: {
            text: 'Check this out',
            attachments: [
              { id: 'att-1', title: 'Image', url: 'http://example.com/img.jpg' },
              { id: 'att-2', title: 'Document', url: 'http://example.com/doc.pdf' },
            ],
            source: 'chat',
          } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).toContain(
        '(Attachments: [att-1 - Image (http://example.com/img.jpg)], [att-2 - Document (http://example.com/doc.pdf)])'
      );
    });

    it('should filter out messages without entityId', () => {
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: null as any, // Testing with null value
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: { text: 'Should be filtered', source: 'chat' } as Content,
        },
        {
          id: stringToUuid('msg-2'),
          entityId: stringToUuid('entity-1'),
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: { text: 'Should appear', source: 'chat' } as Content,
        },
      ];

      const result = formatMessages({ messages, entities: mockEntities });

      expect(result).not.toContain('Should be filtered');
      expect(result).toContain('Should appear');
    });
  });

  describe('formatPosts', () => {
    const mockEntities: Entity[] = [
      {
        id: stringToUuid('entity-1'),
        names: ['Alice'],
        metadata: {},
        agentId: stringToUuid('agent-1'),
      },
    ];

    it('should format posts grouped by room', () => {
      const roomId = stringToUuid('room-1');
      const messages: Memory[] = [
```