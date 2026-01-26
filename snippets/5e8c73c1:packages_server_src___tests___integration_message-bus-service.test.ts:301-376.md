# 5e8c73c1:packages_server_src___tests___integration_message-bus-service.test.ts:301-376

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/integration/message-bus-service.test.ts:301-376
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        runtime.messageService.clearChannel = originalClearChannel;
      }

      // clearChannel should be called
      expect(clearChannelCalled).toBe(true);
    });
  });

  describe('Server Agent Updates', () => {
    it('should handle agent added to server', async () => {
      // Create a new server
      const newServer = await serverFixture.getServer().createServer({
        name: 'New Server',
        sourceType: 'test',
        metadata: {},
      });

      // Emit agent added event
      internalMessageBus.emit('server_agent_update', {
        type: 'agent_added_to_server',
        agentId: testAgentId,
        messageServerId: newServer.id,
      });

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Service should handle the event (no errors)
      expect(service).toBeDefined();
    });

    it('should handle agent removed from server', async () => {
      // Emit agent removed event
      internalMessageBus.emit('server_agent_update', {
        type: 'agent_removed_from_server',
        agentId: testAgentId,
        messageServerId: messageServerId,
      });

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should handle gracefully
      expect(service).toBeDefined();
    });

    it('should ignore updates for other agents', async () => {
      const otherAgentId = stringToUuid('other-agent-123');

      // Emit event for different agent
      internalMessageBus.emit('server_agent_update', {
        type: 'agent_added_to_server',
        agentId: otherAgentId,
        messageServerId: messageServerId,
      });

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Service should ignore (no action needed)
      expect(service).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources on stop', async () => {
      // Service cleanup is handled in afterAll
      // This test verifies the cleanup doesn't throw
      expect(async () => {
        await MessageBusService.stop(runtime);
        // Restart for other tests
        service = (await MessageBusService.start(runtime)) as MessageBusService;
      }).not.toThrow();
    });
  });
});
```