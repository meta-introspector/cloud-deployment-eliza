# a7046c18:packages_docs_plugin-registry_platform_discord_testing-guide.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/testing-guide.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Testing Guide"
description: "This guide covers testing strategies, patterns, and best practices for the @elizaos/plugin-discord package."
---

This guide covers testing strategies, patterns, and best practices for the @elizaos/plugin-discord package.

## Test Environment Setup

### Prerequisites

1. **Test Discord Server**
   - Create a dedicated Discord server for testing
   - Set up test channels (text, voice, etc.)
   - Configure appropriate permissions

2. **Test Bot Application**
   - Create a separate bot application for testing
   - Generate test credentials
   - Add bot to test server with full permissions

3. **Environment Configuration**

```bash
# .env.test
DISCORD_APPLICATION_ID=test_application_id
DISCORD_API_TOKEN=test_bot_token
DISCORD_TEST_CHANNEL_ID=test_text_channel_id
DISCORD_TEST_VOICE_CHANNEL_ID=test_voice_channel_id
DISCORD_TEST_SERVER_ID=test_server_id

# Test user for interactions
DISCORD_TEST_USER_ID=test_user_id
```

## Unit Testing

### Testing Message Manager

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MessageManager } from '@elizaos/plugin-discord';
import { Client, Message, TextChannel } from 'discord.js';

describe('MessageManager', () => {
  let messageManager: MessageManager;
  let mockClient: Client;
  let mockRuntime: any;
  
  beforeEach(() => {
    // Mock Discord.js client
    mockClient = {
      channels: {
        cache: new Map(),
        fetch: vi.fn()
      },
      user: { id: 'bot-id' }
    } as any;
    
    // Mock runtime
    mockRuntime = {
      processMessage: vi.fn(),
      character: { name: 'TestBot' },
      logger: { info: vi.fn(), error: vi.fn() }
    };
    
    messageManager = new MessageManager(mockClient, mockRuntime);
  });
  
  describe('handleMessage', () => {
    it('should ignore bot messages', async () => {
      const mockMessage = {
        author: { bot: true },
        content: 'Test message'
      } as any;
      
      await messageManager.handleMessage(mockMessage);
      
      expect(mockRuntime.processMessage).not.toHaveBeenCalled();
    });
    
    it('should process user messages', async () => {
      const mockMessage = {
        author: { bot: false, id: 'user-123' },
        content: 'Hello bot',
        channel: { id: 'channel-123' },
        guild: { id: 'guild-123' }
      } as any;
      
      mockRuntime.processMessage.mockResolvedValue({
        text: 'Hello user!'
      });
      
      await messageManager.handleMessage(mockMessage);
      
      expect(mockRuntime.processMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: { text: 'Hello bot' },
          channelId: 'channel-123',
          serverId: 'guild-123'
        })
      );
    });
    
    it('should handle attachments', async () => {
      const mockMessage = {
        author: { bot: false, id: 'user-123' },
        content: 'Check this image',
        attachments: new Map([
          ['123', {
            url: 'https://example.com/image.png',
            contentType: 'image/png',
            name: 'image.png'
          }]
        ]),
        channel: { id: 'channel-123' }
      } as any;
      
      await messageManager.handleMessage(mockMessage);
      
      expect(mockRuntime.processMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: expect.arrayContaining([
            expect.objectContaining({
              url: 'https://example.com/image.png',
              contentType: 'image/png'
            })
          ])
        })
      );
    });
  });
});
```

### Testing Voice Manager

```typescript
import { VoiceManager } from '@elizaos/plugin-discord';
import { VoiceChannel, VoiceConnection } from '@discordjs/voice';

describe('VoiceManager', () => {
  let voiceManager: VoiceManager;
  let mockChannel: VoiceChannel;
  
  beforeEach(() => {
    voiceManager = new VoiceManager(mockClient, mockRuntime);
    
    mockChannel = {
      id: 'voice-123',
```