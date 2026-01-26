# 2d12b6ef:packages_server_src___tests___integration_sse-transport.test.ts:301-346

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/sse-transport.test.ts:301-346
**Novelty Score:** 35.43
**Concepts:** testing

```
      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Format test message',
          author_id: authorId,
          transport: 'sse',
        }),
      });

      const body = await response.text();
      const events = parseSSEEvents(body);

      // Assert
      const userMsgEvent = events.find((e) => e.event === 'user_message');
      expect(userMsgEvent).toBeDefined();
      expect(userMsgEvent?.data).toHaveProperty('id');
      expect(userMsgEvent?.data).toHaveProperty('content');
    });

    it('should include text in done event', async () => {
      // Arrange
      const authorId = stringToUuid('sse-agent-response-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Get agent response',
          author_id: authorId,
          transport: 'sse',
        }),
      });

      const body = await response.text();
      const events = parseSSEEvents(body);

      // Assert
      const doneEvent = events.find((e) => e.event === 'done');
      expect(doneEvent).toBeDefined();
      expect(doneEvent?.data).toHaveProperty('text');
    });
  });
});
```