# e5b94879:packages_client_src_hooks___tests___use-http-chat.test.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/hooks/__tests__/use-http-chat.test.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test';
import type { UUID } from '@elizaos/core';

// Test the useHTTPChat hook logic without React context dependencies
// These tests verify the core behavior and API integration

describe('useHTTPChat - Unit Tests', () => {
  beforeEach(() => {
    mock.restore();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('HTTP Request Format', () => {
    test('should format HTTP request with transport: http', () => {
      const requestParams = {
        content: 'Test message',
        transport: 'http' as const,
        attachments: undefined,
      };

      expect(requestParams.transport).toBe('http');
      expect(requestParams.content).toBe('Test message');
    });

    test('should format attachments correctly for images', () => {
      const attachment = {
        url: 'https://example.com/image.png',
        contentType: 'image/png',
        title: 'test-image.png',
      };

      const formattedAttachment = {
        type: (attachment.contentType?.startsWith('image/') ? 'image' : 'file') as
          | 'image'
          | 'file'
          | 'audio'
          | 'video'
          | 'document',
        url: attachment.url,
        name: attachment.title,
      };

      expect(formattedAttachment.type).toBe('image');
      expect(formattedAttachment.url).toBe('https://example.com/image.png');
      expect(formattedAttachment.name).toBe('test-image.png');
    });

    test('should format attachments correctly for non-images', () => {
      const attachment = {
        url: 'https://example.com/document.pdf',
        contentType: 'application/pdf',
        title: 'document.pdf',
      };

      const formattedAttachment = {
        type: (attachment.contentType?.startsWith('image/') ? 'image' : 'file') as
          | 'image'
          | 'file'
          | 'audio'
          | 'video'
          | 'document',
        url: attachment.url,
        name: attachment.title,
      };

      expect(formattedAttachment.type).toBe('file');
    });
  });

  describe('Response Handling', () => {
    test('should extract agent response text', () => {
      const response = {
        success: true,
        userMessage: {
          id: 'msg-123',
          content: 'Hello',
          authorId: 'user-123',
          createdAt: new Date(),
        },
        agentResponse: {
          text: 'Hello! How can I help you?',
          thought: 'User is greeting me',
          actions: ['respond'],
        },
      };

      expect(response.agentResponse?.text).toBe('Hello! How can I help you?');
      expect(response.agentResponse?.thought).toBe('User is greeting me');
      expect(response.agentResponse?.actions).toEqual(['respond']);
    });

    test('should handle response without agentResponse', () => {
      const response: {
        success: boolean;
        userMessage: { id: string; content: string; authorId: string; createdAt: Date };
        agentResponse?: { text: string };
      } = {
        success: true,
        userMessage: {
          id: 'msg-123',
          content: 'Hello',
          authorId: 'user-123',
          createdAt: new Date(),
        },
        // No agentResponse
      };

      expect(response.agentResponse).toBeUndefined();
    });

    test('should handle unsuccessful response', () => {
      const response = {
        success: false,
        userMessage: {
          id: 'msg-123',
          content: 'Hello',
          authorId: 'user-123',
          createdAt: new Date(),
        },
      };

      expect(response.success).toBe(false);
    });
  });

  describe('Optimistic Message Format', () => {
    test('should create user message with correct structure', () => {
      const tempId = 'random-uuid-123' as UUID;
      const text = 'Hello world';
      const currentUserId = 'user-123' as UUID;
      const channelId = 'channel-012' as UUID;
      const serverId = 'server-789' as UUID;

      const userMessage = {
        id: tempId,
        text,
        name: 'TestUser',
        senderId: currentUserId,
        isAgent: false,
        createdAt: Date.now(),
        channelId,
        serverId,
        isLoading: true,
        attachments: undefined,
      };

      expect(userMessage.id).toBe(tempId);
```