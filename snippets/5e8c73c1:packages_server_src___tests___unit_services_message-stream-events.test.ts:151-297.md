# 5e8c73c1:packages_server_src___tests___unit_services_message-stream-events.test.ts:151-297

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/services/message-stream-events.test.ts:151-297
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      });

      internalMessageBus.emit('message_stream_error', {
        messageId: '123e4567-e89b-12d3-a456-426614174000',
        channelId: 'test-channel',
        agentId: '987fcdeb-51a2-3bc4-d567-890123456789',
        error: 'Unknown error',
      });
    });
  });

  describe('Stream event flow simulation', () => {
    it('should simulate complete stream flow: chunks then completion', () => {
      const events: { type: string; data: any }[] = [];
      const messageId = '123e4567-e89b-12d3-a456-426614174000';

      internalMessageBus.on('message_stream_chunk', (data) => {
        events.push({ type: 'chunk', data });
      });

      internalMessageBus.on('new_message', (data) => {
        events.push({ type: 'complete', data });
      });

      // Simulate streaming
      internalMessageBus.emit('message_stream_chunk', {
        messageId,
        chunk: 'Hello',
        index: 0,
        channelId: 'ch1',
        agentId: 'agent1' as UUID,
      });
      internalMessageBus.emit('message_stream_chunk', {
        messageId,
        chunk: ' World',
        index: 1,
        channelId: 'ch1',
        agentId: 'agent1' as UUID,
      });

      // Simulate completion
      internalMessageBus.emit('new_message', {
        id: messageId,
        content: 'Hello World',
        channel_id: 'ch1' as UUID,
        message_server_id: 'server1' as UUID,
        author_id: 'agent1' as UUID,
        created_at: Date.now(),
      });

      expect(events.length).toBe(3);
      expect(events[0].type).toBe('chunk');
      expect(events[1].type).toBe('chunk');
      expect(events[2].type).toBe('complete');
    });

    it('should simulate stream flow with error', () => {
      const events: { type: string; data: any }[] = [];
      const messageId = '123e4567-e89b-12d3-a456-426614174000';

      internalMessageBus.on('message_stream_chunk', (data) => {
        events.push({ type: 'chunk', data });
      });

      internalMessageBus.on('message_stream_error', (data) => {
        events.push({ type: 'error', data });
      });

      // Simulate partial streaming
      internalMessageBus.emit('message_stream_chunk', {
        messageId,
        chunk: 'Partial',
        index: 0,
        channelId: 'ch1',
        agentId: 'agent1' as UUID,
      });

      // Simulate error
      internalMessageBus.emit('message_stream_error', {
        messageId,
        channelId: 'ch1',
        agentId: 'agent1' as UUID,
        error: 'Model API error',
        partialText: 'Partial',
      });

      expect(events.length).toBe(2);
      expect(events[0].type).toBe('chunk');
      expect(events[1].type).toBe('error');
      expect((events[1].data as MessageStreamErrorPayload).partialText).toBe('Partial');
    });
  });

  describe('Listener cleanup', () => {
    it('should properly remove stream chunk listeners', () => {
      let callCount = 0;
      const handler = () => {
        callCount++;
      };

      internalMessageBus.on('message_stream_chunk', handler);
      internalMessageBus.emit('message_stream_chunk', {
        messageId: 'id' as UUID,
        chunk: 'test',
        index: 0,
        channelId: 'ch',
        agentId: 'a' as UUID,
      });
      expect(callCount).toBe(1);

      internalMessageBus.off('message_stream_chunk', handler);
      internalMessageBus.emit('message_stream_chunk', {
        messageId: 'id' as UUID,
        chunk: 'test',
        index: 0,
        channelId: 'ch',
        agentId: 'a' as UUID,
      });
      expect(callCount).toBe(1); // Should not increase
    });

    it('should properly remove stream error listeners', () => {
      let callCount = 0;
      const handler = () => {
        callCount++;
      };

      internalMessageBus.on('message_stream_error', handler);
      internalMessageBus.emit('message_stream_error', {
        messageId: 'id' as UUID,
        channelId: 'ch',
        agentId: 'a' as UUID,
        error: 'test',
      });
      expect(callCount).toBe(1);

      internalMessageBus.off('message_stream_error', handler);
      internalMessageBus.emit('message_stream_error', {
        messageId: 'id' as UUID,
        channelId: 'ch',
        agentId: 'a' as UUID,
        error: 'test',
      });
      expect(callCount).toBe(1); // Should not increase
    });
  });
});
```