# a7046c18:packages_docs_plugin-registry_platform_telegram_testing-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/testing-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        })
      );
    });
  });
  
  describe('sendMessageToTelegram', () => {
    it('should send text messages', async () => {
      await messageManager.sendMessageToTelegram(
        123,
        { text: 'Test message' }
      );
      
      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        123,
        'Test message',
        expect.any(Object)
      );
    });
    
    it('should send messages with buttons', async () => {
      await messageManager.sendMessageToTelegram(
        123,
        {
          text: 'Choose an option',
          buttons: [
            { text: 'Option 1', callback_data: 'opt1' },
            { text: 'Option 2', callback_data: 'opt2' }
          ]
        }
      );
      
      expect(mockBot.telegram.sendMessage).toHaveBeenCalledWith(
        123,
        'Choose an option',
        expect.objectContaining({
          reply_markup: expect.objectContaining({
            inline_keyboard: expect.any(Array)
          })
        })
      );
    });
  });
});
```

### Testing Telegram Service

```typescript
import { TelegramService } from '@elizaos/plugin-telegram';
import { AgentRuntime } from '@elizaos/core';

describe('TelegramService', () => {
  let service: TelegramService;
  let runtime: AgentRuntime;
  
  beforeEach(() => {
    runtime = createMockRuntime();
    service = new TelegramService(runtime);
  });
  
  describe('initialization', () => {
    it('should initialize with valid token', () => {
      runtime.getSetting.mockReturnValue('valid_token');
      
      const service = new TelegramService(runtime);
      
      expect(service.bot).toBeDefined();
      expect(service.messageManager).toBeDefined();
    });
    
    it('should handle missing token gracefully', () => {
      runtime.getSetting.mockReturnValue('');
      
      const service = new TelegramService(runtime);
      
      expect(service.bot).toBeNull();
      expect(service.messageManager).toBeNull();
    });
  });
  
  describe('chat synchronization', () => {
    it('should sync new chats', async () => {
      const mockContext = createMockContext({
        chat: {
          id: 123,
          type: 'group',
          title: 'Test Group'
        }
      });
      
      await service.syncChat(mockContext);
      
      expect(service.knownChats.has('123')).toBe(true);
      expect(runtime.emitEvent).toHaveBeenCalledWith(
        expect.arrayContaining(['WORLD_JOINED']),
        expect.any(Object)
      );
    });
  });
});
```

### Testing Utilities

```typescript
import { processMediaAttachments, createInlineKeyboard } from '@elizaos/plugin-telegram/utils';

describe('Utilities', () => {
  describe('processMediaAttachments', () => {
    it('should process photo attachments', async () => {
      const mockContext = createMockContext({
        message: {
          photo: [{ file_id: 'photo_123' }]
        }
      });
      
      const attachments = await processMediaAttachments(
        mockContext,
        mockBot,
        mockRuntime
      );
      
      expect(attachments).toHaveLength(1);
      expect(attachments[0].type).toBe('image');
    });
  });
  
  describe('createInlineKeyboard', () => {
    it('should create inline keyboard markup', () => {
      const buttons = [
        { text: 'Button 1', callback_data: 'btn1' },
        { text: 'Button 2', url: 'https://example.com' }
      ];
      
      const keyboard = createInlineKeyboard(buttons);
      
      expect(keyboard.inline_keyboard).toHaveLength(2);
      expect(keyboard.inline_keyboard[0][0]).toHaveProperty('callback_data');
      expect(keyboard.inline_keyboard[1][0]).toHaveProperty('url');
    });
  });
});
```

## Integration Testing

### Testing Bot Lifecycle

```typescript
describe('Bot Lifecycle Integration', () => {
```