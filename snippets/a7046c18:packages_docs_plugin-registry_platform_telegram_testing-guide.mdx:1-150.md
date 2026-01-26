# a7046c18:packages_docs_plugin-registry_platform_telegram_testing-guide.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/testing-guide.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Testing Guide"
description: "Testing strategies, patterns, and best practices for the Telegram plugin package."
---

## Test Environment Setup

### Prerequisites

1. **Test Bot Setup**
   - Create a dedicated test bot via @BotFather
   - Get test bot token
   - Configure test bot settings

2. **Test Infrastructure**
   - Create a test group/channel
   - Add test bot as admin (for group tests)
   - Set up test user accounts

3. **Environment Configuration**

```bash
# .env.test
TELEGRAM_BOT_TOKEN=test_bot_token_here
TELEGRAM_TEST_CHAT_ID=-1001234567890  # Test group ID
TELEGRAM_TEST_USER_ID=123456789        # Test user ID
TELEGRAM_TEST_CHANNEL_ID=@testchannel  # Test channel

# Optional test settings
TELEGRAM_API_ROOT=https://api.telegram.org  # Or test server
TELEGRAM_TEST_TIMEOUT=30000             # Test timeout in ms
```

## Unit Testing

### Testing Message Manager

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MessageManager } from '@elizaos/plugin-telegram';
import { Telegraf, Context } from 'telegraf';

describe('MessageManager', () => {
  let messageManager: MessageManager;
  let mockBot: Telegraf;
  let mockRuntime: any;
  
  beforeEach(() => {
    // Mock Telegraf bot
    mockBot = {
      telegram: {
        sendMessage: vi.fn(),
        editMessageText: vi.fn(),
        answerCallbackQuery: vi.fn()
      }
    } as any;
    
    // Mock runtime
    mockRuntime = {
      processMessage: vi.fn(),
      character: { name: 'TestBot' },
      logger: { info: vi.fn(), error: vi.fn() },
      getSetting: vi.fn()
    };
    
    messageManager = new MessageManager(mockBot, mockRuntime);
  });
  
  describe('handleMessage', () => {
    it('should process text messages', async () => {
      const mockContext = createMockContext({
        message: {
          text: 'Hello bot',
          from: { id: 123, username: 'testuser' },
          chat: { id: -456, type: 'group' }
        }
      });
      
      mockRuntime.processMessage.mockResolvedValue({
        text: 'Hello user!'
      });
      
      await messageManager.handleMessage(mockContext);
      
      expect(mockRuntime.processMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: { text: 'Hello bot' },
          userId: expect.any(String),
          channelId: '-456'
        })
      );
    });
    
    it('should handle photo messages', async () => {
      const mockContext = createMockContext({
        message: {
          photo: [
            { file_id: 'photo_123', width: 100, height: 100 },
            { file_id: 'photo_456', width: 200, height: 200 }
          ],
          caption: 'Check this out',
          from: { id: 123 },
          chat: { id: 456 }
        }
      });
      
      mockBot.telegram.getFile = vi.fn().mockResolvedValue({
        file_path: 'photos/test.jpg'
      });
      
      await messageManager.handleMessage(mockContext);
      
      expect(mockBot.telegram.getFile).toHaveBeenCalledWith('photo_456');
      expect(mockRuntime.processMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            text: 'Check this out',
            attachments: expect.arrayContaining([
              expect.objectContaining({
                type: 'image'
              })
            ])
          })
        })
      );
    });
    
    it('should handle voice messages', async () => {
      const mockContext = createMockContext({
        message: {
          voice: {
            file_id: 'voice_123',
            duration: 5,
            mime_type: 'audio/ogg'
          },
          from: { id: 123 },
          chat: { id: 456 }
        }
      });
      
      // Mock transcription
      mockRuntime.transcribe = vi.fn().mockResolvedValue('Hello world');
      
      await messageManager.handleMessage(mockContext);
      
      expect(mockRuntime.processMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            text: 'Hello world'
          })
```