# 2d12b6ef:packages_server_src___tests___integration_sse-transport.test.ts:1-150

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/sse-transport.test.ts:1-150
**Novelty Score:** 35.43
**Concepts:** testing

```
/**
 * SSE Transport Integration Tests
 *
 * Tests the Server-Sent Events (SSE) transport for the messaging API:
 * - Streaming response flow
 * - SSE event format (user_message, chunk, done, error)
 * - Proper headers (text/event-stream, no-cache, keep-alive)
 * - Legacy 'stream' mode compatibility
 *
 * SSE transport is used when clients want real-time streaming without
 * the complexity of WebSocket connections.
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import type { UUID, ElizaOS, HandleMessageResult } from '@elizaos/core';

import { TestServerFixture, AgentFixture, CharacterBuilder, stringToUuid } from '../index';

/**
 * Parse SSE response body into events
 */
function parseSSEEvents(body: string): Array<{ event: string; data: unknown }> {
  const events: Array<{ event: string; data: unknown }> = [];
  const lines = body.split('\n');

  let currentEvent = '';
  let currentData = '';

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7);
    } else if (line.startsWith('data: ')) {
      currentData = line.slice(6);
    } else if (line === '' && currentEvent) {
      try {
        events.push({
          event: currentEvent,
          data: JSON.parse(currentData),
        });
      } catch {
        events.push({
          event: currentEvent,
          data: currentData,
        });
      }
      currentEvent = '';
      currentData = '';
    }
  }

  return events;
}

describe('SSE Transport Integration', () => {
  let serverFixture: TestServerFixture;
  let agentFixture: AgentFixture;
  let baseUrl: string;
  let agentId: UUID;
  let sessionId: UUID;

  beforeAll(async () => {
    // Arrange - Setup server
    serverFixture = new TestServerFixture();
    const { port } = await serverFixture.setup();
    baseUrl = `http://localhost:${port}`;

    // Arrange - Create test agent
    agentFixture = new AgentFixture(serverFixture.getServer());
    const { runtime } = await agentFixture.setup({
      character: new CharacterBuilder()
        .withName('SSE Test Agent')
        .withBio(['A test agent for SSE transport'])
        .withSettings({ model: 'gpt-4' })
        .withSecret('OPENAI_API_KEY', 'test-key')
        .build(),
    });

    agentId = runtime.agentId;

    // Mock processActions to simulate streaming
    runtime.processActions = async (_message: unknown, responses: unknown[]) => {
      (responses as Array<{ text: string }>).push({
        text: 'SSE streaming response',
      });
    };

    // Create a session for testing
    const userId = stringToUuid(`sse-test-user-${Date.now()}`);
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

  describe('POST /sessions/:sessionId/messages with transport=sse', () => {
    it('should return SSE stream with correct headers', async () => {
      // Arrange
      const authorId = stringToUuid('sse-test-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Hello via SSE transport',
          author_id: authorId,
          transport: 'sse',
        }),
      });

      // Assert - Check SSE headers
      expect(response.headers.get('Content-Type')).toBe('text/event-stream');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
      expect(response.headers.get('Connection')).toBe('keep-alive');
    });

    it('should emit user_message event first', async () => {
      // Arrange
      const authorId = stringToUuid('sse-user-msg-user');

      // Act
      const response = await fetch(`${baseUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test user message event',
          author_id: authorId,
          transport: 'sse',
        }),
      });

      const body = await response.text();
      const events = parseSSEEvents(body);

      // Assert
      expect(events.length).toBeGreaterThan(0);
```