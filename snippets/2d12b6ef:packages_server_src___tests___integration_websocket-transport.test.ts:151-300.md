# 2d12b6ef:packages_server_src___tests___integration_websocket-transport.test.ts:151-300

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/websocket-transport.test.ts:151-300
**Novelty Score:** 35.43
**Concepts:** testing

```
          content: 'Hello via legacy websocket mode',
          author_id: authorId,
          mode: 'websocket', // Legacy parameter
        }),
      });

      // Assert
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.agentResponse).toBeUndefined();
    });

    it('should return error for invalid transport', async () => {
      // Arrange
      const authorId = stringToUuid('ws-invalid-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test message',
          author_id: authorId,
          transport: 'invalid_transport',
        }),
      });

      // Assert
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('Invalid transport');
    });

    it('should reject non-string transport parameter', async () => {
      // Arrange
      const authorId = stringToUuid('ws-non-string-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test message',
          author_id: authorId,
          transport: 123, // Invalid - should be string
        }),
      });

      // Assert
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('Transport must be a string');
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for missing content', async () => {
      // Arrange
      const authorId = stringToUuid('ws-no-content-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: authorId,
          transport: 'websocket',
          // Missing content
        }),
      });

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('Response Format', () => {
    it('should include userMessage with correct structure', async () => {
      // Arrange
      const authorId = stringToUuid('ws-format-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Format test message',
          author_id: authorId,
          transport: 'websocket',
        }),
      });

      const data = await response.json();

      // Assert
      expect(data.userMessage).toHaveProperty('id');
      expect(data.userMessage).toHaveProperty('content');
    });

    it('should NOT include agentResponse in websocket transport', async () => {
      // Arrange
      const authorId = stringToUuid('ws-no-agent-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test no agent response',
          author_id: authorId,
          transport: 'websocket',
        }),
      });

      const data = await response.json();

      // Assert - agentResponse should not be present
      expect(data).not.toHaveProperty('agentResponse');
    });
  });

  describe('WebSocket + Socket.IO Integration', () => {
    it('should receive agent response via Socket.IO after HTTP acknowledgment', async () => {
      // Arrange - Create new session for this test to get channelId
      const authorId = stringToUuid('ws-socketio-user');
      const entityId = stringToUuid('ws-socketio-entity');

      const newSessionResponse = await fetch(`${baseUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          userId: authorId,
        }),
      });
      const newSessionData = await newSessionResponse.json();
      const testSessionId = newSessionData.sessionId;
      const channelId = newSessionData.channelId;

      // Connect Socket.IO client
      clientFixture = new SocketIOClientFixture(port, { entityId });
      await clientFixture.connect();

      // Join the channel created by the session
      await clientFixture.joinChannel({
        channelId,
```