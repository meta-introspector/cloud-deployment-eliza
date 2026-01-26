# 2d12b6ef:packages_server_src___tests___integration_socketio-infrastructure.test.ts:1-150

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/__tests__/integration/socketio-infrastructure.test.ts:1-150
**Novelty Score:** 35.43
**Concepts:** testing

```
/**
 * Socket.IO Infrastructure Tests
 *
 * Tests the Socket.IO server infrastructure:
 * - Connection and authentication
 * - Room/channel joining and management
 * - Message broadcasting between clients
 * - Log streaming subscriptions
 * - Error handling and disconnection
 *
 * These tests verify Socket.IO mechanics, NOT the transport layer API.
 * For transport-specific tests, see:
 * - http-transport.test.ts
 * - sse-transport.test.ts
 * - websocket-transport.test.ts
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import type { IAgentRuntime, UUID } from '@elizaos/core';
import { ChannelType } from '@elizaos/core';

// New architecture imports - fully using fixtures!
import {
  TestServerFixture,
  AgentFixture,
  SocketIOClientFixture,
  CharacterBuilder,
  stringToUuid,
} from '../index';

// Helper to generate unique channel IDs for each test to avoid conflicts in parallel execution
let channelIdCounter = 0;
function generateUniqueChannelId(): UUID {
  return stringToUuid(`test-channel-socketio-${Date.now()}-${channelIdCounter++}`);
}

const DEFAULT_MESSAGE_SERVER_ID = '00000000-0000-0000-0000-000000000000';

describe('Socket.IO End-to-End Message Flow', () => {
  let serverFixture: TestServerFixture;
  let agentFixture: AgentFixture;
  let port: number;
  let clientFixture1: SocketIOClientFixture;
  let clientFixture2: SocketIOClientFixture;
  let mockRuntime: IAgentRuntime;

  beforeAll(async () => {
    // Setup server with fixtures
    serverFixture = new TestServerFixture();
    const { port: serverPort } = await serverFixture.setup();
    port = serverPort;

    // Create test agent using fixture
    agentFixture = new AgentFixture(serverFixture.getServer());
    const { runtime } = await agentFixture.setup({
      character: new CharacterBuilder()
        .asSocketIOTestAgent()
        .withSettings({ model: 'gpt-4' })
        .withSecret('OPENAI_API_KEY', 'test-key')
        .build(),
    });
    mockRuntime = runtime;

    // Mock the agent's processActions to avoid calling OpenAI
    mockRuntime.processActions = async (message: any, responses: any[]) => {
      responses.push({
        id: `mock-response-${Date.now()}`,
        text: 'Mock response from agent',
        userId: mockRuntime.agentId,
        agentId: mockRuntime.agentId,
        roomId: message.roomId,
        createdAt: Date.now(),
      });
    };

    // Wait for server to fully start
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 30000);

  afterAll(async () => {
    await agentFixture.cleanup();
    await serverFixture.cleanup();
  });

  beforeEach(() => {
    // Create new client fixtures for each test with entityId for authentication
    const testEntityId1 = stringToUuid('test-entity-1');
    const testEntityId2 = stringToUuid('test-entity-2');
    clientFixture1 = new SocketIOClientFixture(port, { entityId: testEntityId1 });
    clientFixture2 = new SocketIOClientFixture(port, { entityId: testEntityId2 });
  });

  afterEach(async () => {
    // Cleanup client fixtures
    await SocketIOClientFixture.cleanupMany([clientFixture1, clientFixture2]);
  });

  describe('Connection and Channel Joining', () => {
    it('should establish connection and join channel', async () => {
      const client = await clientFixture1.connect();
      expect(client.connected).toBe(true);

      const channelId = generateUniqueChannelId();
      await clientFixture1.joinChannel({
        channelId,
        entityId: 'user-123',
        messageServerId: DEFAULT_MESSAGE_SERVER_ID,
      });
      // If we get here without error, channel was joined successfully
    });

    it('should allow multiple clients to join same channel', async () => {
      // Connect both clients using fixture helper
      await SocketIOClientFixture.connectMany([clientFixture1, clientFixture2]);

      const channelId = generateUniqueChannelId();

      // Both clients join the same channel
      await Promise.all([
        clientFixture1.joinChannel({
          channelId,
          entityId: 'user-1',
          messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        }),
        clientFixture2.joinChannel({
          channelId,
          entityId: 'user-2',
          messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        }),
      ]);
    });
  });

  describe('Message Sending and Broadcasting', () => {
    it('should send message and broadcast to other clients', async () => {
      const channelId = generateUniqueChannelId();

      // Connect and join channel for both clients
      await SocketIOClientFixture.connectMany([clientFixture1, clientFixture2]);
      await Promise.all([
        clientFixture1.joinChannel({
          channelId,
          entityId: 'user-1',
          messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        }),
        clientFixture2.joinChannel({
          channelId,
          entityId: 'user-2',
          messageServerId: DEFAULT_MESSAGE_SERVER_ID,
        }),
```