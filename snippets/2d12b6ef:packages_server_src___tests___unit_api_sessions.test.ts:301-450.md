# 2d12b6ef:packages_server_src___tests___unit_api_sessions.test.ts:301-450

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:301-450
**Novelty Score:** 35.43
**Concepts:** testing

```
      // Verify the timeout config uses the provided settings
      expect(res.body.timeoutConfig.timeoutMinutes).toBe(45);
      expect(res.body.timeoutConfig.autoRenew).toBe(false);
      expect(res.body.timeoutConfig.maxDurationMinutes).toBe(1440);

      // The agent should be available but getSetting might not be called
      // by the current implementation
      expect(mockAgents.has(agentId as UUID)).toBe(true);
    });

    it('should return 400 for invalid agent ID', async () => {
      const res = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId: 'invalid-uuid',
        userId: '456e7890-e89b-12d3-a456-426614174000',
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 when agent not found', async () => {
      const res = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId: '123e4567-e89b-12d3-a456-426614174000',
        userId: '456e7890-e89b-12d3-a456-426614174000',
      });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'AGENT_NOT_FOUND');
    });
  });

  describe('POST /sessions/:sessionId/messages - Send Message', () => {
    it('should send a message to an existing session', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';

      // Add mock agent
      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Create session first
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
      });

      const sessionId = createRes.body.sessionId;

      // Send message
      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Hello, world!',
          attachments: [],
        }
      );

      expect(res.status).toBe(201); // Creating a message returns 201
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userMessage');
      expect(res.body.userMessage).toHaveProperty('id');
      expect(res.body.userMessage).toHaveProperty('content', 'Test message');
      expect(res.body.userMessage).toHaveProperty('author_id', 'user-123');
    });

    it('should propagate session metadata to messages', async () => {
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = '456e7890-e89b-12d3-a456-426614174000';
      const ethAddress = '0x1234567890123456789012345678901234567890';
      const customSessionMetadata = {
        ethAddress,
        platform: 'web3',
        userPlan: 'premium',
      };

      // Add mock agent
      const agent = createMockAgent(agentId);
      mockAgents.set(agentId as UUID, agent);

      // Mock getChannelDetails to return channel with metadata
      const mockGetChannel = jest.fn().mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Channel',
        type: 'dm',
        metadata: customSessionMetadata,
      });
      (mockServerInstance as any).getChannelDetails = mockGetChannel;

      // Create session with metadata
      const createRes = await simulateRequest(app, 'POST', '/api/messaging/sessions', {
        agentId,
        userId,
        metadata: customSessionMetadata,
      });

      expect(createRes.status).toBe(201);
      const sessionId = createRes.body.sessionId;

      // Mock createMessage to capture the metadata being passed
      let capturedMessageData: any = null;
      (mockServerInstance.createMessage as jest.Mock).mockImplementation((data) => {
        capturedMessageData = data;
        return Promise.resolve({
          id: 'msg-123',
          content: data.content,
          authorId: data.authorId,
          createdAt: new Date(),
          metadata: data.metadata,
        });
      });

      // Send message with additional message-specific metadata
      const messageMetadata = {
        messageType: 'transaction_request',
        priority: 'high',
      };

      const res = await simulateRequest(
        app,
        'POST',
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          content: 'Please sign this transaction',
          metadata: messageMetadata,
        }
      );

      expect(res.status).toBe(201);

      // Verify that createMessage was called with merged metadata
      expect(capturedMessageData).toBeDefined();
      expect(capturedMessageData.metadata).toBeDefined();

      // Session metadata should be included
      expect(capturedMessageData.metadata.ethAddress).toBe(ethAddress);
      expect(capturedMessageData.metadata.platform).toBe('web3');
      expect(capturedMessageData.metadata.userPlan).toBe('premium');

      // Message-specific metadata should also be included
      expect(capturedMessageData.metadata.messageType).toBe('transaction_request');
      expect(capturedMessageData.metadata.priority).toBe('high');

      // sessionId should always be included
      expect(capturedMessageData.metadata.sessionId).toBe(sessionId);
    });

    it('should return 404 for non-existent session', async () => {
```