# 2d12b6ef:packages_server_src___tests___integration_http-transport.test.ts:1-150

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/http-transport.test.ts:1-150
**Novelty Score:** 35.43
**Concepts:** testing

```
/**
 * HTTP Transport Integration Tests
 *
 * Tests the HTTP transport for the messaging API:
 * - Synchronous request/response flow
 * - Agent response included in HTTP response
 * - Error handling
 *
 * HTTP transport is used when clients want immediate synchronous responses
 * without WebSocket or SSE streaming.
 *
 * Note: elizaOS.handleMessage is mocked to avoid LLM costs while testing
 * the full request/response flow.
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import type { UUID, ElizaOS, HandleMessageResult } from '@elizaos/core';

import { TestServerFixture, AgentFixture, CharacterBuilder, stringToUuid } from '../index';

describe('HTTP Transport Integration', () => {
  let serverFixture: TestServerFixture;
  let agentFixture: AgentFixture;
  let baseUrl: string;
  let agentId: UUID;
  let sessionId: UUID;
  let originalHandleMessage: ElizaOS['handleMessage'];

  beforeAll(async () => {
    // Arrange - Setup server
    serverFixture = new TestServerFixture();
    const { port } = await serverFixture.setup();
    baseUrl = `http://localhost:${port}`;

    // Arrange - Create test agent
    agentFixture = new AgentFixture(serverFixture.getServer());
    const { runtime } = await agentFixture.setup({
      character: new CharacterBuilder()
        .withName('HTTP Test Agent')
        .withBio(['A test agent for HTTP transport'])
        .build(),
    });

    agentId = runtime.agentId;

    // Mock elizaOS.handleMessage to avoid LLM calls
    // This is the ONLY mock - everything else is real
    const elizaOS = serverFixture.getServer().elizaOS!;
    originalHandleMessage = elizaOS.handleMessage.bind(elizaOS);
    elizaOS.handleMessage = async (
      _agentId: UUID,
      message: any,
      _options?: unknown
    ): Promise<HandleMessageResult> => {
      const mockMessageId = stringToUuid(`mock-msg-${Date.now()}`);
      return {
        messageId: mockMessageId,
        userMessage: {
          id: mockMessageId,
          entityId: message.entityId,
          agentId: _agentId,
          roomId: message.roomId,
          content: message.content,
          createdAt: Date.now(),
        } as any,
        processing: {
          didRespond: true,
          responseContent: {
            text: 'Mocked HTTP response from agent',
            thought: 'Test thought',
          },
          responseMessages: [],
          state: {} as any,
        },
      };
    };

    // Create a session for testing
    const userId = stringToUuid(`http-test-user-${Date.now()}`);
    const sessionResponse = await fetch(`${baseUrl}/api/messaging/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId,
        userId,
      }),
    });

    const sessionData = await sessionResponse.json();
    sessionId = sessionData.sessionId;

    await new Promise((resolve) => setTimeout(resolve, 500));
  }, 30000);

  afterAll(async () => {
    // Restore original handleMessage
    if (originalHandleMessage && serverFixture.getServer().elizaOS) {
      serverFixture.getServer().elizaOS!.handleMessage = originalHandleMessage;
    }
    await agentFixture.cleanup();
    await serverFixture.cleanup();
  });

  describe('POST /sessions/:sessionId/messages with transport=http', () => {
    it('should return synchronous response with agentResponse', async () => {
      // Arrange
      const authorId = stringToUuid('http-test-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello via HTTP transport',
          author_id: authorId,
          transport: 'http',
        }),
      });

      // Assert
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.userMessage).toBeDefined();
      expect(data.userMessage.content).toBe('Hello via HTTP transport');
      expect(data.agentResponse).toBeDefined();
      expect(data.agentResponse.text).toBe('Mocked HTTP response from agent');
    });

    it('should handle legacy sync mode for backward compatibility', async () => {
      // Arrange
      const authorId = stringToUuid('http-legacy-user');

      // Act - Using legacy 'mode: sync'
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello via legacy sync mode',
          author_id: authorId,
          mode: 'sync', // Legacy parameter
        }),
      });

      // Assert - Should work same as transport=http
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
```