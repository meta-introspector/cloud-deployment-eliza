# 5e8c73c1:packages_server_src___tests___unit_services_message-stream-events.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/services/message-stream-events.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Unit tests for message streaming events on the internal message bus
 * Tests message_stream_chunk and message_stream_error events
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import internalMessageBus from '../../../services/message-bus';
import type { MessageStreamChunkPayload, MessageStreamErrorPayload, UUID } from '@elizaos/core';

describe('Message Stream Events', () => {
  beforeEach(() => {
    // Clean up any existing listeners to ensure test isolation
    (internalMessageBus as any).removeAllListeners();
  });

  describe('message_stream_chunk event', () => {
    it('should emit stream chunk with correct payload structure', (done) => {
      const chunkPayload: MessageStreamChunkPayload = {
        messageId: '123e4567-e89b-12d3-a456-426614174000' as UUID,
        chunk: 'Hello, ',
        index: 0,
        channelId: 'test-channel-123',
        agentId: '987fcdeb-51a2-3bc4-d567-890123456789' as UUID,
      };

      internalMessageBus.on('message_stream_chunk', (data) => {
        expect(data).toEqual(chunkPayload);
        expect(data.messageId).toBe(chunkPayload.messageId);
        expect(data.chunk).toBe('Hello, ');
        expect(data.index).toBe(0);
        expect(data.channelId).toBe('test-channel-123');
        expect(data.agentId).toBe(chunkPayload.agentId);
        done();
      });

      internalMessageBus.emit('message_stream_chunk', chunkPayload);
    });

    it('should handle multiple sequential chunks with incrementing index', () => {
      const receivedChunks: MessageStreamChunkPayload[] = [];
      const messageId = '123e4567-e89b-12d3-a456-426614174000' as UUID;
      const agentId = '987fcdeb-51a2-3bc4-d567-890123456789' as UUID;

      internalMessageBus.on('message_stream_chunk', (data) => {
        receivedChunks.push(data as MessageStreamChunkPayload);
      });

      // Simulate streaming chunks
      const chunks = ['Hello', ', ', 'world', '!'];
      chunks.forEach((chunk, index) => {
        internalMessageBus.emit('message_stream_chunk', {
          messageId,
          chunk,
          index,
          channelId: 'test-channel',
          agentId,
        });
      });

      expect(receivedChunks.length).toBe(4);
      expect(receivedChunks[0].index).toBe(0);
      expect(receivedChunks[1].index).toBe(1);
      expect(receivedChunks[2].index).toBe(2);
      expect(receivedChunks[3].index).toBe(3);
      expect(receivedChunks.map((c) => c.chunk).join('')).toBe('Hello, world!');
    });

    it('should allow multiple listeners for stream chunks', () => {
      let listener1Called = false;
      let listener2Called = false;

      internalMessageBus.on('message_stream_chunk', () => {
        listener1Called = true;
      });
      internalMessageBus.on('message_stream_chunk', () => {
        listener2Called = true;
      });

      internalMessageBus.emit('message_stream_chunk', {
        messageId: '123e4567-e89b-12d3-a456-426614174000',
        chunk: 'test',
        index: 0,
        channelId: 'test-channel',
        agentId: '987fcdeb-51a2-3bc4-d567-890123456789',
      });

      expect(listener1Called).toBe(true);
      expect(listener2Called).toBe(true);
    });

    it('should handle empty chunks', (done) => {
      internalMessageBus.on('message_stream_chunk', (data) => {
        expect((data as MessageStreamChunkPayload).chunk).toBe('');
        done();
      });

      internalMessageBus.emit('message_stream_chunk', {
        messageId: '123e4567-e89b-12d3-a456-426614174000',
        chunk: '',
        index: 0,
        channelId: 'test-channel',
        agentId: '987fcdeb-51a2-3bc4-d567-890123456789',
      });
    });
  });

  describe('message_stream_error event', () => {
    it('should emit stream error with correct payload structure', (done) => {
      const errorPayload: MessageStreamErrorPayload = {
        messageId: '123e4567-e89b-12d3-a456-426614174000' as any,
        channelId: 'test-channel-123',
        agentId: '987fcdeb-51a2-3bc4-d567-890123456789' as any,
        error: 'Connection timeout',
      };

      internalMessageBus.on('message_stream_error', (data) => {
        expect(data).toEqual(errorPayload);
        expect(data.messageId).toBe(errorPayload.messageId);
        expect(data.error).toBe('Connection timeout');
        expect(data.channelId).toBe('test-channel-123');
        expect(data.agentId).toBe(errorPayload.agentId);
        done();
      });

      internalMessageBus.emit('message_stream_error', errorPayload);
    });

    it('should emit stream error with partial text', (done) => {
      const errorPayload: MessageStreamErrorPayload = {
        messageId: '123e4567-e89b-12d3-a456-426614174000' as any,
        channelId: 'test-channel-123',
        agentId: '987fcdeb-51a2-3bc4-d567-890123456789' as any,
        error: 'Stream interrupted',
        partialText: 'This is what was generated before the error...',
      };

      internalMessageBus.on('message_stream_error', (data) => {
        expect((data as MessageStreamErrorPayload).partialText).toBe(
          'This is what was generated before the error...'
        );
        done();
      });

      internalMessageBus.emit('message_stream_error', errorPayload);
    });

    it('should handle error without partial text', (done) => {
      internalMessageBus.on('message_stream_error', (data) => {
        expect((data as MessageStreamErrorPayload).partialText).toBeUndefined();
        done();
```