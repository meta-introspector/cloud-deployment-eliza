# 2d12b6ef:packages_server_src___tests___integration_websocket-transport.test.ts:1-150

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/websocket-transport.test.ts:1-150
**Novelty Score:** 35.43
**Concepts:** testing

```
/**
 * WebSocket Transport Integration Tests
 *
 * Tests the WebSocket transport for the messaging API:
 * - Immediate acknowledgment (no blocking for agent response)
 * - Agent response delivered via Socket.IO events
 * - Default transport behavior
 * - Integration with Socket.IO infrastructure
 *
 * WebSocket transport is the default mode, used when clients
 * maintain a persistent Socket.IO connection for real-time updates.
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'bun:test';
import type { UUID } from '@elizaos/core';

import {
  TestServerFixture,
  AgentFixture,
  SocketIOClientFixture,
  CharacterBuilder,
  stringToUuid,
} from '../index';

const DEFAULT_MESSAGE_SERVER_ID = '00000000-0000-0000-0000-000000000000' as UUID;

describe('WebSocket Transport Integration', () => {
  let serverFixture: TestServerFixture;
  let agentFixture: AgentFixture;
  let baseUrl: string;
  let port: number;
  let agentId: UUID;
  let sessionId: UUID;
  let clientFixture: SocketIOClientFixture;

  beforeAll(async () => {
    // Arrange - Setup server
    serverFixture = new TestServerFixture();
    const result = await serverFixture.setup();
    port = result.port;
    baseUrl = `http://localhost:${port}`;

    // Arrange - Create test agent
    agentFixture = new AgentFixture(serverFixture.getServer());
    const { runtime } = await agentFixture.setup({
      character: new CharacterBuilder()
        .withName('WebSocket Test Agent')
        .withBio(['A test agent for WebSocket transport'])
        .withSettings({ model: 'gpt-4' })
        .withSecret('OPENAI_API_KEY', 'test-key')
        .build(),
    });

    agentId = runtime.agentId;

    // Mock processActions to avoid real API calls
    runtime.processActions = async (_message: unknown, responses: unknown[]) => {
      (responses as Array<{ text: string }>).push({
        text: 'WebSocket transport response',
      });
    };

    // Create a session for testing
    const userId = stringToUuid(`ws-test-user-${Date.now()}`);
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
    await agentFixture.cleanup();
    await serverFixture.cleanup();
  });

  afterEach(async () => {
    if (clientFixture) {
      await clientFixture.cleanup();
    }
  });

  describe('POST /sessions/:sessionId/messages with transport=websocket', () => {
    it('should return immediately without agentResponse', async () => {
      // Arrange
      const authorId = stringToUuid('ws-test-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello via WebSocket transport',
          author_id: authorId,
          transport: 'websocket',
        }),
      });

      // Assert
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.userMessage).toBeDefined();
      expect(data.userMessage.content).toBe('Hello via WebSocket transport');
      // WebSocket transport does NOT include agentResponse in HTTP response
      expect(data.agentResponse).toBeUndefined();
    });

    it('should be the default transport when not specified', async () => {
      // Arrange
      const authorId = stringToUuid('ws-default-user');

      // Act - No transport specified
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello with default transport',
          author_id: authorId,
          // No transport - should default to websocket
        }),
      });

      // Assert - Should behave like websocket transport
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.userMessage).toBeDefined();
      expect(data.agentResponse).toBeUndefined();
    });

    it('should handle legacy websocket mode for backward compatibility', async () => {
      // Arrange
      const authorId = stringToUuid('ws-legacy-user');

      // Act - Using legacy 'mode: websocket'
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
```