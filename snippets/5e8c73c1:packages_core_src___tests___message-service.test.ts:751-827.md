# 5e8c73c1:packages_core_src___tests___message-service.test.ts:751-827

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/message-service.test.ts:751-827
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          roomId,
          agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
          createdAt: Date.now(),
        } as Memory,
      ];

      const mockGetMemories = mock(async () => mockMemories);
      const mockDeleteMemory = mock(async () => {});

      mockRuntime.getMemoriesByRoomIds = mockGetMemories;
      mockRuntime.deleteMemory = mockDeleteMemory;

      await messageService.clearChannel(mockRuntime as IAgentRuntime, roomId, channelId);

      // Should not attempt to delete memories without IDs
      expect(mockDeleteMemory).not.toHaveBeenCalled();
    });
  });

  describe('parsedXml type safety', () => {
    it('should handle non-string thought/text values in logging without crashing', async () => {
      // Setup a message
      const message: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174200' as UUID,
        content: {
          text: 'Test message',
          source: 'test',
          channelType: ChannelType.API,
        } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        createdAt: Date.now(),
      };

      // Mock useModel to return XML where thought/text are objects (empty tags become {})
      mockRuntime.useModel = mock(
        async (modelType: (typeof ModelType)[keyof typeof ModelType], params: unknown) => {
          if (modelType === ModelType.TEXT_SMALL) {
            return '<response><action>REPLY</action><reason>User asked a question</reason></response>';
          }
          // Return XML with empty tags that parseKeyValueXml will parse as {} instead of strings
          const responseText =
            '<response><thought></thought><actions>REPLY</actions><text></text></response>';
          if ((params as any)?.stream) {
            return {
              textStream: (async function* () {
                yield responseText;
              })(),
              text: Promise.resolve(responseText),
              usage: Promise.resolve({ promptTokens: 10, completionTokens: 5, totalTokens: 15 }),
            };
          }
          return responseText;
        }
      ) as any;

      // Add required mocks for the message processing flow
      mockRuntime.emitEvent = mock(async () => {});
      mockRuntime.getRoom = mock(async () => ({
        id: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        name: 'Test Room',
        source: 'test',
        type: ChannelType.API,
        channelId: 'test-channel',
        worldId: '123e4567-e89b-12d3-a456-426614174099' as UUID,
      }));

      // The test passes if no error is thrown during message processing
      // This validates that the type guards prevent .substring() from being called on non-strings
      await messageService.handleMessage(mockRuntime as IAgentRuntime, message, mockCallback);

      // Verify the logging was called (which uses the type guards)
      expect(mockRuntime.logger?.info).toHaveBeenCalled();
    });
  });
});
```