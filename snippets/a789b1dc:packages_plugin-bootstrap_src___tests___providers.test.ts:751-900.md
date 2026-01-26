# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:751-900

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:751-900
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    // When there's no world, it should handle gracefully
    expect(result.text).toBeDefined();
  });

  it('should handle missing world gracefully', async () => {
    mockRuntime.getWorld = mock().mockResolvedValue(null);
    mockMessage.content = { channelType: ChannelType.GROUP };
    mockState.data = {
      ...mockState.data,
      room: {
        type: ChannelType.GROUP,
        id: 'group-room-err' as UUID,
      },
    };
    mockMessage.roomId = 'group-room-err' as UUID;

    const result = await settingsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain(
      'Error retrieving configuration information. Please try again later.'
    );
  });
});

describe('Attachments Provider', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;

  beforeEach(() => {
    const setup = setupActionTest();
    mockRuntime = setup.mockRuntime;
    mockMessage = setup.mockMessage;
    mockState = setup.mockState;

    // Mock getConversationLength
    mockRuntime.getConversationLength = mock().mockReturnValue(10);

    // Mock getMemories for testing
    mockRuntime.getMemories = mock().mockResolvedValue([]);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should handle messages with no attachments', async () => {
    // Test message without attachments
    mockMessage.content = {
      text: 'Hello, how are you?',
      channelType: ChannelType.GROUP,
    };

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data?.attachments).toHaveLength(0);
    expect(result.text).toBe('');
    expect(result.values?.attachments).toBe('');
  });

  it('should return current message attachments', async () => {
    // Test message with attachments
    const testAttachments: Media[] = [
      {
        id: 'attach-1',
        url: 'https://example.com/image1.jpg',
        title: 'Test Image 1',
        source: 'image/jpeg',
        description: 'A test image',
        text: 'Image content text',
      },
      {
        id: 'attach-2',
        url: 'https://example.com/document.pdf',
        title: 'Test Document',
        source: 'application/pdf',
        description: 'A test PDF document',
        text: 'Document content text',
      },
    ];

    mockMessage.content = {
      text: 'Check out these attachments',
      channelType: ChannelType.GROUP,
      attachments: testAttachments,
    };

    const result = await attachmentsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data?.attachments).toHaveLength(2);
    expect(result.data?.attachments?.[0]?.id).toBe('attach-1');
    expect(result.data?.attachments?.[1]?.id).toBe('attach-2');
    expect(result.text).toContain('# Attachments');
    expect(result.text).toContain('Test Image 1');
    expect(result.text).toContain('Test Document');
    expect(result.text).toContain('https://example.com/image1.jpg');
    expect(result.text).toContain('Image content text');
  });

  it('should merge attachments from recent messages', async () => {
    const currentAttachment: Media = {
      id: 'current-attach',
      url: 'https://example.com/current.jpg',
      title: 'Current Image',
      source: 'image/jpeg',
      description: 'Current attachment',
      text: 'Current content',
    };

    mockMessage.content = {
      text: 'Current message with attachment',
      channelType: ChannelType.GROUP,
      attachments: [currentAttachment],
    };

    // Mock recent messages with attachments - note they will be reversed by the provider
    const recentMessages = [
      {
        id: 'msg-1' as UUID,
        content: {
          text: 'Previous message 1',
          attachments: [
            {
              id: 'prev-attach-1',
              url: 'https://example.com/prev1.jpg',
              title: 'Previous Image 1',
              source: 'image/jpeg',
              description: 'Previous attachment 1',
              text: 'Previous content 1',
            },
          ],
        },
        createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
      },
      {
```