# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:1051-1171

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:1051-1171
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    ];

    mockRuntime.getMemories = mock().mockResolvedValue(recentMessages);

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data?.attachments).toHaveLength(1);
    expect(result.data?.attachments?.[0]?.id).toBe('shared-attach');
    // Should keep the current message's richer data
    expect(result.data?.attachments?.[0]?.text).toBe('Shared content with more details');
    expect(result.data?.attachments?.[0]?.description).toBe('Shared attachment');
  });

  it('should format attachment data correctly', async () => {
    const testAttachment: Media = {
      id: 'format-test',
      url: 'https://example.com/test.png',
      title: 'Format Test Image',
      source: 'image/png',
      description: 'Testing formatted output',
      text: 'This is the extracted text from the image',
    };

    mockMessage.content = {
      text: 'Testing format',
      channelType: ChannelType.GROUP,
      attachments: [testAttachment],
    };

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('# Attachments');
    expect(result.text).toContain('ID: format-test');
    expect(result.text).toContain('Name: Format Test Image');
    expect(result.text).toContain('URL: https://example.com/test.png');
    expect(result.text).toContain('Type: image/png');
    expect(result.text).toContain('Description: Testing formatted output');
    expect(result.text).toContain('Text: This is the extracted text from the image');
  });

  it('should handle messages with no recent attachments history', async () => {
    const currentAttachment: Media = {
      id: 'only-attach',
      url: 'https://example.com/only.jpg',
      title: 'Only Attachment',
      source: 'image/jpeg',
      description: 'The only attachment',
      text: 'Only attachment content',
    };

    mockMessage.content = {
      text: 'Message with attachment',
      channelType: ChannelType.GROUP,
      attachments: [currentAttachment],
    };

    // No messages have attachments
    const recentMessages = [
      {
        id: 'msg-1' as UUID,
        content: { text: 'Text only message 1' },
        createdAt: Date.now() - 5 * 60 * 1000,
      },
      {
        id: 'msg-2' as UUID,
        content: { text: 'Text only message 2' },
        createdAt: Date.now() - 2 * 60 * 1000,
      },
    ];

    mockRuntime.getMemories = mock().mockResolvedValue(recentMessages);

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data?.attachments).toHaveLength(1);
    expect(result.data?.attachments?.[0]?.id).toBe('only-attach');
    expect(result.text).toContain('Only Attachment');
  });

  it('should handle errors by throwing them', async () => {
    mockMessage.content = {
      text: 'Test message',
      channelType: ChannelType.GROUP,
      attachments: [
        {
          id: 'test-attach',
          url: 'https://example.com/test.jpg',
          title: 'Test',
          source: 'image/jpeg',
        },
      ],
    };

    // Mock error in getMemories
    mockRuntime.getMemories = mock().mockRejectedValue(new Error('Database error'));

    // The provider doesn't catch errors, so they propagate up
    expect(
      attachmentsProvider.get(
        mockRuntime as IAgentRuntime,
        mockMessage as Memory,
        mockState as State
      )
    ).rejects.toThrow('Database error');
  });
});
```