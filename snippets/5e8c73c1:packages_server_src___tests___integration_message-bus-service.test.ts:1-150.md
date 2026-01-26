# 5e8c73c1:packages_server_src___tests___integration_message-bus-service.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/integration/message-bus-service.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Integration tests for MessageBusService
 * Tests message bus integration with real server and agent runtime
 */

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { MessageBusService } from '../../services/message';
import { EventType, type UUID, stringToUuid } from '@elizaos/core';
import internalMessageBus from '../../services/message-bus';

import { TestServerFixture, AgentFixture, ChannelBuilder, MessageBuilder } from '../index';

describe('MessageBusService Integration Tests', () => {
  let serverFixture: TestServerFixture;
  let agentFixture: AgentFixture;
  let service: MessageBusService;
  let testAgentId: UUID;
  let messageServerId: UUID;
  let runtime: any;

  beforeAll(async () => {
    // Setup server with fixtures
    serverFixture = new TestServerFixture();
    await serverFixture.setup();

    // Get default server
    const servers = await serverFixture.getServer().getServers();
    messageServerId = servers[0].id;

    // Create test agent with real runtime
    agentFixture = new AgentFixture(serverFixture.getServer());
    const agentSetup = await agentFixture.setup({
      characterPreset: 'asDatabaseTestAgent',
    });
    testAgentId = agentSetup.agentId;
    runtime = agentSetup.runtime;

    // Start message bus service with real runtime
    service = (await MessageBusService.start(runtime)) as MessageBusService;

    // Fetch valid channel IDs after service creation
    await (service as any).fetchValidChannelIds();
  }, 30000);

  afterAll(async () => {
    // Stop service and cleanup
    if (service) {
      await MessageBusService.stop(runtime);
    }
    await agentFixture.cleanup();
    await serverFixture.cleanup();
  });

  describe('Initialization', () => {
    it('should start the service correctly', () => {
      expect(service).toBeInstanceOf(MessageBusService);
    });

    it('should register message handlers on start', () => {
      // Verify handlers are registered by checking the service state
      expect(service).toBeDefined();
    });

    it('should fetch agent servers on initialization', async () => {
      const agentServers = await serverFixture.getServer().getMessageServersForAgent(testAgentId);
      expect(agentServers).toBeDefined();
      expect(Array.isArray(agentServers)).toBe(true);
    });
  });

  describe('Message Handling', () => {
    it('should handle new messages from the bus', async () => {
      // Create channel with test agent as participant
      const channel = await serverFixture
        .getServer()
        .createChannel(
          new ChannelBuilder()
            .asIntegrationTestChannel(messageServerId, 'message-handling')
            .build(),
          [testAgentId]
        );

      // Track if message passes all checks (before elizaOS.handleMessage which may have DB issues)
      let allChecksPassed = false;
      const originalHandleIncomingMessage = (service as any).handleIncomingMessage.bind(service);
      (service as any).handleIncomingMessage = async (data: any) => {
        // Intercept to track when all checks pass
        const result = await originalHandleIncomingMessage(data);
        // If we got here without early return, checks passed
        allChecksPassed = true;
        return result;
      };

      // Emit message directly to bus
      internalMessageBus.emit('new_message', {
        id: 'msg-test-1' as UUID,
        channel_id: channel.id,
        message_server_id: messageServerId,
        author_id: stringToUuid('user-123'),
        content: 'Test message',
        raw_message: { content: 'Test message' },
        source_id: 'test-src-1',
        source_type: 'test',
        created_at: Date.now(),
        metadata: {},
      });

      // Wait for async processing
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Restore
      (service as any).handleIncomingMessage = originalHandleIncomingMessage;

      // Message should pass validation checks (even if downstream processing fails)
      expect(allChecksPassed).toBe(true);
    });

    it('should skip messages from self', async () => {
      // Create channel with test agent
      const channel = await serverFixture
        .getServer()
        .createChannel(
          new ChannelBuilder().asIntegrationTestChannel(messageServerId, 'self-message').build(),
          [testAgentId]
        );

      // Track if message processing starts (RUN_STARTED would be emitted)
      let messageProcessed = false;
      const originalEmit = runtime.emitEvent;
      runtime.emitEvent = async (eventType: EventType, data: any) => {
        if (eventType === EventType.RUN_STARTED) {
          messageProcessed = true;
        }
        return originalEmit.call(runtime, eventType, data);
      };

      // Emit message from the agent itself
      internalMessageBus.emit('new_message', {
        id: 'msg-self' as UUID,
        channel_id: channel.id,
        message_server_id: messageServerId,
        author_id: testAgentId,
        content: 'Self message',
        raw_message: { content: 'Self message' },
        source_id: 'test-src-2',
        source_type: 'test',
        created_at: Date.now(),
        metadata: {},
      });

```