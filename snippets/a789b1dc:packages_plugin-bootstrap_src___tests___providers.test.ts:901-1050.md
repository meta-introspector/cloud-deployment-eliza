# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:901-1050

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:901-1050
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
        id: 'msg-2' as UUID,
        content: {
          text: 'Previous message 2',
          attachments: [
            {
              id: 'prev-attach-2',
              url: 'https://example.com/prev2.jpg',
              title: 'Previous Image 2',
              source: 'image/jpeg',
              description: 'Previous attachment 2',
              text: 'Previous content 2',
            },
          ],
        },
        createdAt: Date.now() - 15 * 60 * 1000, // 15 minutes ago
      },
    ];

    mockRuntime.getMemories = mock().mockResolvedValue(recentMessages);

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data?.attachments).toHaveLength(3);
    expect(result.data?.attachments?.[0]?.id).toBe('current-attach');
    // Messages are reversed, so prev-attach-2 comes before prev-attach-1
    expect(result.data?.attachments?.[1]?.id).toBe('prev-attach-2');
    expect(result.data?.attachments?.[2]?.id).toBe('prev-attach-1');
    expect(result.text).toContain('Current Image');
    expect(result.text).toContain('Previous Image 1');
    expect(result.text).toContain('Previous Image 2');
  });

  it('should hide text for attachments older than 1 hour', async () => {
    const currentAttachment: Media = {
      id: 'current-attach',
      url: 'https://example.com/current.jpg',
      title: 'Current Image',
      source: 'image/jpeg',
      description: 'Current attachment',
      text: 'Current content',
    };

    mockMessage.content = {
      text: 'Current message',
      channelType: ChannelType.GROUP,
      attachments: [currentAttachment],
    };

    // Mock messages - the provider finds the first message with attachments
    // Recent message needs to come first to be the reference point
    const messages = [
      {
        id: 'msg-recent' as UUID,
        content: {
          text: 'Recent message',
          attachments: [
            {
              id: 'recent-attach',
              url: 'https://example.com/recent.jpg',
              title: 'Recent Image',
              source: 'image/jpeg',
              description: 'Recent attachment',
              text: 'This should be visible',
            },
          ],
        },
        createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
      },
      {
        id: 'msg-old' as UUID,
        content: {
          text: 'Old message',
          attachments: [
            {
              id: 'old-attach',
              url: 'https://example.com/old.jpg',
              title: 'Old Image',
              source: 'image/jpeg',
              description: 'Old attachment',
              text: 'This should be hidden',
            },
          ],
        },
        createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      },
    ];

    mockRuntime.getMemories = mock().mockResolvedValue(messages);

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data?.attachments).toHaveLength(3);

    // Check that old attachment has hidden text
    const oldAttachment = result.data?.attachments?.find((a) => a.id === 'old-attach');
    expect(oldAttachment?.text).toBe('[Hidden]');

    // Check that recent attachments have visible text
    const recentAttachment = result.data?.attachments?.find((a) => a.id === 'recent-attach');
    expect(recentAttachment?.text).toBe('This should be visible');

    const currentAtt = result.data?.attachments?.find((a) => a.id === 'current-attach');
    expect(currentAtt?.text).toBe('Current content');
  });

  it('should not duplicate attachments with same ID', async () => {
    const sharedAttachment: Media = {
      id: 'shared-attach',
      url: 'https://example.com/shared.jpg',
      title: 'Shared Image',
      source: 'image/jpeg',
      description: 'Shared attachment',
      text: 'Shared content with more details',
    };

    mockMessage.content = {
      text: 'Current message',
      channelType: ChannelType.GROUP,
      attachments: [sharedAttachment],
    };

    // Mock a recent message with the same attachment ID but less data
    const recentMessages = [
      {
        id: 'msg-1' as UUID,
        content: {
          text: 'Previous message',
          attachments: [
            {
              id: 'shared-attach', // Same ID as current
              url: 'https://example.com/shared.jpg',
              title: 'Shared Image',
              source: 'image/jpeg',
              description: 'Basic description',
              text: 'Basic text',
            },
          ],
        },
        createdAt: Date.now() - 10 * 60 * 1000, // 10 minutes ago
      },
```