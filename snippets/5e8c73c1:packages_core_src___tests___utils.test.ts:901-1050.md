# 5e8c73c1:packages_core_src___tests___utils.test.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/utils.test.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      // Handlebars replaces missing values with empty string
      expect(result).toBe('Template with .');
    });

    it('should handle multiple occurrences of same placeholder', () => {
      const state = {
        word: 'test',
      };
      const template = '{{word}} {{word}} {{word}}';

      const result = composePrompt({ state, template });

      expect(result).toBe('test test test');
    });
  });

  describe('composePromptFromState', () => {
    it('should compose prompt from State object', () => {
      const mockState: State = {
        // Required State properties
        userId: stringToUuid('user-123'),
        agentId: stringToUuid('agent-123'),
        roomId: stringToUuid('room-123'),
        bio: 'I am a helpful assistant',
        lore: 'Created to help with tasks',
        senderName: 'Assistant',
        actors: 'user123',
        actorsData: [
          {
            id: stringToUuid('actor-1'),
            names: ['John'],
            metadata: {},
            agentId: stringToUuid('agent-123'),
          },
        ],
        // Template values
        recentMessages: 'Recent conversation history',
        relevantKnowledge: 'Relevant facts',
        recentMessagesData: [
          {
            id: stringToUuid('msg-1'),
            entityId: stringToUuid('entity-1'),
            roomId: stringToUuid('room-123'),
            createdAt: Date.now(),
            content: {
              text: 'Hello',
              source: 'chat',
            } as Content,
          },
        ],
        // Additional required State properties
        values: {},
        data: {},
        text: '',
      };

      const template = 'Bio: {{bio}}\nLore: {{lore}}\nRecent: {{recentMessages}}';

      const result = composePromptFromState({ state: mockState, template });

      expect(result).toContain('Bio: I am a helpful assistant');
      expect(result).toContain('Lore: Created to help with tasks');
      expect(result).toContain('Recent: Recent conversation history');
    });

    it('should handle State with array data', () => {
      const mockState: State = {
        userId: stringToUuid('user-123'),
        agentId: stringToUuid('agent-123'),
        roomId: stringToUuid('room-123'),
        bio: 'Assistant bio',
        lore: 'Assistant lore',
        senderName: 'User',
        actors: '',
        actorsData: [
          {
            id: stringToUuid('actor-1'),
            names: ['Alice'],
            metadata: {},
            agentId: stringToUuid('agent-123'),
          },
          {
            id: stringToUuid('actor-2'),
            names: ['Bob'],
            metadata: {},
            agentId: stringToUuid('agent-123'),
          },
        ],
        recentMessagesData: [],
        values: {},
        data: {},
        text: '',
      };

      const template = 'Actors: {{actors}}\nSender: {{senderName}}';

      const result = composePromptFromState({ state: mockState, template });

      expect(result).toContain('Sender: User');
      // actors field might be generated from actorsData
      expect(result).toBeDefined();
    });

    it('should handle missing properties in State', () => {
      const mockState: State = {
        userId: stringToUuid('user-123'),
        agentId: stringToUuid('agent-123'),
        roomId: stringToUuid('room-123'),
        bio: '',
        lore: '',
        senderName: '',
        actors: '',
        actorsData: [],
        recentMessagesData: [],
        values: {},
        data: {},
        text: '',
      };

      const template = 'Bio: {{bio}}\nMissing: {{missingProp}}';

      const result = composePromptFromState({ state: mockState, template });

      expect(result).toContain('Bio: ');
      // Handlebars replaces missing values with empty string
      expect(result).toBe('Bio: \nMissing: ');
    });
  });

  describe('addHeader', () => {
    it('should add header to body', () => {
      const header = '# Title';
      const body = 'This is the body content.';

      const result = addHeader(header, body);

      // addHeader adds only single newline between header and body, and adds newline at end
      expect(result).toBe('# Title\nThis is the body content.\n');
    });

    it('should handle empty header', () => {
      const header = '';
      const body = 'Body content';

      const result = addHeader(header, body);

      // Empty header results in just body with newline at end
      expect(result).toBe('Body content\n');
    });

```