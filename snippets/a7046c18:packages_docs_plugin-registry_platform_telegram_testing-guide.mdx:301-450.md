# a7046c18:packages_docs_plugin-registry_platform_telegram_testing-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/testing-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  let service: TelegramService;
  let runtime: AgentRuntime;
  
  beforeAll(async () => {
    runtime = new AgentRuntime({
      character: {
        name: 'TestBot',
        clients: ['telegram']
      },
      settings: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_TEST_TOKEN
      }
    });
    
    service = await TelegramService.start(runtime);
  });
  
  afterAll(async () => {
    await service.stop();
  });
  
  it('should connect to Telegram', async () => {
    expect(service.bot).toBeDefined();
    const botInfo = await service.bot.telegram.getMe();
    expect(botInfo.is_bot).toBe(true);
  });
  
  it('should handle incoming messages', async () => {
    // Send test message
    const testMessage = await sendTestMessage(
      'Test message',
      process.env.TELEGRAM_TEST_CHAT_ID
    );
    
    // Wait for processing
    await waitForProcessing(1000);
    
    // Verify message was processed
    expect(runtime.processMessage).toHaveBeenCalled();
  });
});
```

### Testing Message Flow

```typescript
describe('Message Flow Integration', () => {
  it('should process message end-to-end', async () => {
    // Send message to test chat
    const response = await fetch(
      `https://api.telegram.org/bot${TEST_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TEST_CHAT_ID,
          text: 'Hello bot!'
        })
      }
    );
    
    const result = await response.json();
    expect(result.ok).toBe(true);
    
    // Wait for bot response
    const botResponse = await waitForBotResponse(TEST_CHAT_ID, 5000);
    expect(botResponse).toBeDefined();
    expect(botResponse.text).toContain('Hello');
  });
  
  it('should handle button interactions', async () => {
    // Send message with buttons
    const message = await sendMessageWithButtons(
      'Choose:',
      [
        { text: 'Option 1', callback_data: 'opt1' },
        { text: 'Option 2', callback_data: 'opt2' }
      ]
    );
    
    // Simulate button click
    await simulateCallbackQuery(message.message_id, 'opt1');
    
    // Verify callback was processed
    const response = await waitForCallbackResponse();
    expect(response).toBeDefined();
  });
});
```

## E2E Testing

### Complete Test Suite

```typescript
import { TelegramTestSuite } from '@elizaos/plugin-telegram/tests';

describe('Telegram Bot E2E Tests', () => {
  const suite = new TelegramTestSuite({
    botToken: process.env.TELEGRAM_TEST_TOKEN,
    testChatId: process.env.TELEGRAM_TEST_CHAT_ID,
    testUserId: process.env.TELEGRAM_TEST_USER_ID
  });
  
  beforeAll(async () => {
    await suite.setup();
  });
  
  afterAll(async () => {
    await suite.cleanup();
  });
  
  describe('Text Messages', () => {
    it('should respond to text messages', async () => {
      const result = await suite.testTextMessage({
        text: 'Hello!',
        expectedPattern: /hello|hi|hey/i
      });
      
      expect(result.success).toBe(true);
      expect(result.response).toMatch(/hello/i);
    });
    
    it('should handle mentions', async () => {
      const result = await suite.testMention({
        text: '@testbot how are you?',
        shouldRespond: true
      });
      
      expect(result.responded).toBe(true);
    });
  });
  
  describe('Media Handling', () => {
    it('should process images', async () => {
      const result = await suite.testImageMessage({
        imagePath: './test-assets/test-image.jpg',
        caption: 'What is this?'
      });
      
      expect(result.processed).toBe(true);
      expect(result.response).toContain('image');
    });
    
    it('should transcribe voice messages', async () => {
      const result = await suite.testVoiceMessage({
        audioPath: './test-assets/test-audio.ogg',
        expectedTranscript: 'hello world'
      });
      
```