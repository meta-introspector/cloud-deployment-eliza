# a69475c0:packages_core_src___tests___utils.test.ts:601-750

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/__tests__/utils.test.ts:601-750
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
        {
          id: stringToUuid('msg-1'),
          entityId: stringToUuid('entity-1'),
          roomId,
          createdAt: Date.now() - 3600000,
          content: {
            text: 'First message',
            source: 'twitter',
          } as Content,
        },
        {
          id: stringToUuid('msg-2'),
          entityId: stringToUuid('entity-1'),
          roomId,
          createdAt: Date.now(),
          content: {
            text: 'Second message',
            source: 'twitter',
          } as Content,
        },
      ];

      const result = formatPosts({ messages, entities: mockEntities });

      // formatPosts uses roomId.slice(-5) to show only last 5 chars
      expect(result).toContain(`Conversation: ${roomId.slice(-5)}`);
      expect(result).toContain('Name: Alice');
      expect(result).toContain('First message');
      expect(result).toContain('Second message');
      expect(result).toContain('Source: twitter');
    });

    it('should include reply information', () => {
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: stringToUuid('entity-1'),
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: {
            text: 'Reply message',
            inReplyTo: stringToUuid('12345678-1234-1234-1234-123456789012'),
            source: 'chat',
          } as Content,
        },
      ];

      const result = formatPosts({ messages, entities: mockEntities });

      expect(result).toContain('In reply to: 12345678-1234-1234-1234-123456789012');
    });

    it('should format without conversation header when specified', () => {
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: stringToUuid('entity-1'),
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: { text: 'Message', source: 'chat' } as Content,
        },
      ];

      const result = formatPosts({
        messages,
        entities: mockEntities,
        conversationHeader: false,
      });

      expect(result).not.toContain('Conversation:');
    });

    it('should handle missing entity with warning', () => {
      // This tests line 209 - logger.warn when entity not found
      const unknownEntityId = stringToUuid('non-existent-entity');
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: unknownEntityId,
          roomId: stringToUuid('room-1'),
          createdAt: Date.now(),
          content: {
            text: 'Message from unknown entity',
            source: 'chat',
          } as Content,
        },
      ];

      // Empty entities array to ensure entity is not found
      const result = formatPosts({ messages, entities: [] });

      // Should use "Unknown User" when entity not found
      expect(result).toContain('Unknown User');
      expect(result).toContain('unknown');
      expect(result).toContain(unknownEntityId);
    });

    it('should handle messages without roomId', () => {
      const messages: Memory[] = [
        {
          id: stringToUuid('msg-1'),
          entityId: stringToUuid('entity-1'),
          roomId: null as any, // No roomId - testing with null value
          createdAt: Date.now(),
          content: {
            text: 'Message without room',
            source: 'chat',
          } as Content,
        },
      ];

      const result = formatPosts({ messages, entities: mockEntities });

      // Messages without roomId should be filtered out
      expect(result).toBe('');
    });
  });

  describe('validateUuid', () => {
    it('should validate correct UUID format', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = validateUuid(validUuid);
      expect(result).toBe(validUuid);
    });

    it('should return null for invalid UUID format', () => {
      expect(validateUuid('not-a-uuid')).toBeNull();
      expect(validateUuid('123')).toBeNull();
      expect(validateUuid('')).toBeNull();
      expect(validateUuid(null)).toBeNull();
      expect(validateUuid(undefined)).toBeNull();
      expect(validateUuid(123)).toBeNull();
      expect(validateUuid({})).toBeNull();
    });

    it('should handle UUID-like strings that are invalid', () => {
      // Wrong format variations
      expect(validateUuid('123e4567-e89b-12d3-a456')).toBeNull(); // Too short
      expect(validateUuid('123e4567-e89b-12d3-a456-426614174000-extra')).toBeNull(); // Too long
      expect(validateUuid('123e4567e89b12d3a456426614174000')).toBeNull(); // No dashes
      expect(validateUuid('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX')).toBeNull(); // Invalid chars
    });
  });

  describe('stringToUuid', () => {
    it('should convert string to UUID', () => {
      const result = stringToUuid('test-string');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // Should be in UUID format
```