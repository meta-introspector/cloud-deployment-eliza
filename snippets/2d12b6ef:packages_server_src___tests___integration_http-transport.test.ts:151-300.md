# 2d12b6ef:packages_server_src___tests___integration_http-transport.test.ts:151-300

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/http-transport.test.ts:151-300
**Novelty Score:** 35.43
**Concepts:** testing

```
      expect(data.agentResponse).toBeDefined();
    });

    it('should return error for invalid transport', async () => {
      // Arrange
      const authorId = stringToUuid('http-invalid-user');

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
      expect(data.error.message).toContain('Invalid transport');
    });

    it('should reject non-string transport parameter', async () => {
      // Arrange
      const authorId = stringToUuid('http-non-string-user');

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
      expect(data.error.message).toContain('Transport must be a string');
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for missing content', async () => {
      // Arrange
      const authorId = stringToUuid('http-no-content-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: authorId,
          transport: 'http',
          // Missing content
        }),
      });

      // Assert
      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent session', async () => {
      // Arrange
      const fakeSessionId = stringToUuid('non-existent-session');
      const authorId = stringToUuid('http-test-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${fakeSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test message',
          author_id: authorId,
          transport: 'http',
        }),
      });

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('Response Format', () => {
    it('should include userMessage with correct structure', async () => {
      // Arrange
      const authorId = stringToUuid('http-format-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Format test message',
          author_id: authorId,
          transport: 'http',
        }),
      });

      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.userMessage).toHaveProperty('id');
      expect(data.userMessage).toHaveProperty('content');
      expect(data.userMessage).toHaveProperty('authorId');
      expect(data.userMessage).toHaveProperty('createdAt');
    });

    it('should include agentResponse with text', async () => {
      // Arrange
      const authorId = stringToUuid('http-agent-response-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Get agent response',
          author_id: authorId,
          transport: 'http',
        }),
      });

      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data.agentResponse).toBeDefined();
      expect(data.agentResponse).toHaveProperty('text');
    });

    it('should include sessionStatus in response', async () => {
      // Arrange
      const authorId = stringToUuid('http-session-status-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Check session status',
          author_id: authorId,
          transport: 'http',
```