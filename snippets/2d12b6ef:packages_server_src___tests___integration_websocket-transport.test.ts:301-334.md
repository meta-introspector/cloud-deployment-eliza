# 2d12b6ef:packages_server_src___tests___integration_websocket-transport.test.ts:301-334

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/websocket-transport.test.ts:301-334
**Novelty Score:** 35.43
**Concepts:** testing

```
        entityId: authorId,
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
      });

      // Setup listener for agent response
      const agentResponsePromise = clientFixture.waitForEvent<{
        text: string;
        senderId: string;
      }>('messageBroadcast');

      // Act - Send message via HTTP with websocket transport
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${testSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello, waiting for Socket.IO response',
          author_id: authorId,
          transport: 'websocket',
        }),
      });

      // Assert HTTP response is immediate
      expect(response.status).toBe(201);
      const httpData = await response.json();
      expect(httpData.success).toBe(true);
      expect(httpData.agentResponse).toBeUndefined();

      // Assert agent response comes via Socket.IO
      const socketResponse = await agentResponsePromise;
      expect(socketResponse).toBeDefined();
      expect(socketResponse.text).toBeDefined();
    });
  });
});
```