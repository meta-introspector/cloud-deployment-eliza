# 2d12b6ef:packages_server_src___tests___integration_socketio-infrastructure.test.ts:151-300

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/socketio-infrastructure.test.ts:151-300
**Novelty Score:** 35.43
**Concepts:** testing

```
      ]);

      // Set up message broadcast listener on client2
      const messageReceived = clientFixture2.waitForEvent<{
        id: string;
        text: string;
        senderId: string;
        channelId: string;
      }>('messageBroadcast');

      // Client1 sends a message
      const ackPromise = clientFixture1.sendMessage({
        channelId,
        senderId: '123e4567-e89b-12d3-a456-426614174001',
        senderName: 'User 1',
        message: 'Hello from client1',
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
      });

      const [message, ack] = await Promise.all([messageReceived, ackPromise]);

      expect(message).toHaveProperty('id');
      expect(message.text).toBe('Hello from client1');
      expect(message.senderId).toBe('123e4567-e89b-12d3-a456-426614174001');
      expect(message.channelId).toBe(channelId);
      expect(ack.status).toBe('received_by_server_and_processing');
    });

    it('should handle message with attachments', async () => {
      const channelId = generateUniqueChannelId();

      await clientFixture1.connect();
      await clientFixture1.joinChannel({
        channelId,
        entityId: 'user-1',
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
      });

      const messageBroadcast = clientFixture1.waitForEvent<{
        attachments: Array<{ url: string; type: string }>;
      }>('messageBroadcast');

      await clientFixture1.sendMessage({
        channelId,
        senderId: '123e4567-e89b-12d3-a456-426614174002',
        senderName: 'User 1',
        message: 'Check out this image',
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        attachments: [
          {
            url: 'https://example.com/image.jpg',
            type: 'image',
          },
        ],
      });

      const message = await messageBroadcast;
      expect(message.attachments).toHaveLength(1);
      expect(message.attachments[0]).toEqual({
        url: 'https://example.com/image.jpg',
        type: 'image',
      });
    });
  });

  describe('DM Channel Creation and Messaging', () => {
    it('should auto-create DM channel and send message', async () => {
      const channelId = generateUniqueChannelId();
      const user1Id = stringToUuid(`test-user-dm-1-${Date.now()}`);
      const user2Id = stringToUuid(`test-user-dm-2-${Date.now()}`);

      await clientFixture1.connect();

      // Send DM message (channel doesn't exist yet)
      const ack = await clientFixture1.sendMessage({
        channelId,
        senderId: user1Id,
        senderName: 'User 1',
        message: 'Hello, this is a DM',
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        targetUserId: user2Id,
        metadata: {
          isDm: true,
          channelType: ChannelType.DM,
        },
      });

      expect(ack.status).toBe('received_by_server_and_processing');

      // Verify channel was created by checking database
      const channel = await serverFixture.getServer().getChannelDetails(channelId as UUID);
      expect(channel).toBeTruthy();
      expect(channel?.type).toBe(ChannelType.DM);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid channel ID gracefully', async () => {
      await clientFixture1.connect();

      // Use try/catch since joinChannel should reject
      await expect(
        clientFixture1.joinChannel({
          channelId: '' as UUID, // Invalid - empty
          entityId: 'user-1',
          messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        })
      ).rejects.toThrow();
    });

    it('should handle message without required fields', async () => {
      await clientFixture1.connect();

      // sendMessage requires message field, so this should fail
      await expect(
        clientFixture1.sendMessage({
          channelId: generateUniqueChannelId(),
          senderId: '123e4567-e89b-12d3-a456-426614174001',
          message: '', // Empty message
          messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        })
      ).rejects.toThrow();
    });

    it('should handle disconnection and cleanup', async () => {
      const channelId = generateUniqueChannelId();

      await clientFixture1.connect();
      await clientFixture1.joinChannel({
        channelId,
        entityId: 'user-1',
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
      });

      // Disconnect
      clientFixture1.disconnect();
      expect(clientFixture1.getClient().connected).toBe(false);
    });
  });

  describe('Log Streaming', () => {
    it('should subscribe to log stream and receive filtered logs', async () => {
      await clientFixture1.connect();

      // Subscribe to logs using fixture method
      await clientFixture1.subscribeToLogs({
        agentName: 'SocketIO Test Agent',
        level: 'info',
      });

```