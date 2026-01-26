# 2d12b6ef:packages_server_src___tests___integration_sse-transport.test.ts:151-300

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/sse-transport.test.ts:151-300
**Novelty Score:** 35.43
**Concepts:** testing

```
      expect(events[0].event).toBe('user_message');

      const userMsgData = events[0].data as { id: string; content: string };
      expect(userMsgData).toHaveProperty('id');
      expect(userMsgData).toHaveProperty('content');
    });

    it('should emit done event with complete response', async () => {
      // Arrange
      const authorId = stringToUuid('sse-done-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test done event',
          author_id: authorId,
          transport: 'sse',
        }),
      });

      const body = await response.text();
      const events = parseSSEEvents(body);

      // Assert - Find done event
      const doneEvent = events.find((e) => e.event === 'done');
      expect(doneEvent).toBeDefined();

      const doneData = doneEvent?.data as { text: string };
      expect(doneData).toHaveProperty('text');
    });

    it('should handle legacy stream mode for backward compatibility', async () => {
      // Arrange
      const authorId = stringToUuid('sse-legacy-user');

      // Act - Using legacy 'mode: stream'
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello via legacy stream mode',
          author_id: authorId,
          mode: 'stream', // Legacy parameter
        }),
      });

      // Assert - Should return SSE headers like transport=sse
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
    });

    it('should return error for invalid transport', async () => {
      // Arrange
      const authorId = stringToUuid('sse-invalid-user');

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
      const authorId = stringToUuid('sse-non-string-user');

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
      const authorId = stringToUuid('sse-no-content-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: authorId,
          transport: 'sse',
          // Missing content
        }),
      });

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('SSE Event Format', () => {
    it('should format events according to SSE spec', async () => {
      // Arrange
      const authorId = stringToUuid('sse-format-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test SSE format',
          author_id: authorId,
          transport: 'sse',
        }),
      });

      const body = await response.text();

      // Assert - Check SSE format
      expect(body).toContain('event: ');
      expect(body).toContain('data: ');
      // SSE events should end with double newline
      expect(body).toMatch(/\n\n/);
    });
  });

  describe('Response Format', () => {
    it('should include userMessage in user_message event', async () => {
      // Arrange
      const authorId = stringToUuid('sse-response-user');

```