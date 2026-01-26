# a7046c18:packages_docs_plugin-registry_platform_telegram_testing-guide.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/testing-guide.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(result.transcribed).toBe(true);
      expect(result.transcript).toContain('hello');
    });
  });
  
  describe('Interactive Elements', () => {
    it('should handle button clicks', async () => {
      const result = await suite.testButtonInteraction({
        message: 'Choose:',
        buttons: [
          { text: 'Yes', callback_data: 'yes' },
          { text: 'No', callback_data: 'no' }
        ],
        clickButton: 'yes'
      });
      
      expect(result.callbackProcessed).toBe(true);
    });
  });
  
  describe('Group Features', () => {
    it('should work in groups', async () => {
      const result = await suite.testGroupMessage({
        groupId: process.env.TELEGRAM_TEST_GROUP_ID,
        message: 'Bot, help!',
        shouldRespond: true
      });
      
      expect(result.responded).toBe(true);
    });
  });
});
```

## Performance Testing

### Load Testing

```typescript
describe('Performance Tests', () => {
  it('should handle concurrent messages', async () => {
    const messageCount = 50;
    const startTime = Date.now();
    
    const promises = Array(messageCount).fill(0).map((_, i) =>
      sendTestMessage(`Test message ${i}`, TEST_CHAT_ID)
    );
    
    const results = await Promise.all(promises);
    const endTime = Date.now();
    
    const totalTime = endTime - startTime;
    const avgTime = totalTime / messageCount;
    
    expect(results.every(r => r.ok)).toBe(true);
    expect(avgTime).toBeLessThan(500); // Less than 500ms per message
  });
  
  it('should maintain stable memory usage', async () => {
    const iterations = 100;
    const measurements = [];
    
    for (let i = 0; i < iterations; i++) {
      await processTestMessage(`Message ${i}`);
      
      if (i % 10 === 0) {
        global.gc(); // Force garbage collection
        measurements.push(process.memoryUsage().heapUsed);
      }
    }
    
    // Check memory growth
    const firstMeasurement = measurements[0];
    const lastMeasurement = measurements[measurements.length - 1];
    const growth = lastMeasurement - firstMeasurement;
    
    expect(growth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
  });
});
```

### Rate Limit Testing

```typescript
describe('Rate Limit Handling', () => {
  it('should handle rate limits gracefully', async () => {
    // Send many messages quickly
    const promises = Array(100).fill(0).map(() =>
      sendTestMessage('Spam test', TEST_CHAT_ID)
    );
    
    const results = await Promise.allSettled(promises);
    
    // Some should succeed, some might be rate limited
    const succeeded = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    
    // Should handle failures gracefully
    if (failed.length > 0) {
      expect(failed[0].reason).toMatch(/429|rate/i);
    }
    
    expect(succeeded.length).toBeGreaterThan(0);
  });
});
```

## Mock Utilities

### Telegram API Mocks

```typescript
export function createMockContext(options: any = {}): Context {
  return {
    message: options.message || createMockMessage(),
    chat: options.chat || { id: 123, type: 'private' },
    from: options.from || { id: 456, username: 'testuser' },
    telegram: createMockTelegram(),
    reply: vi.fn(),
    replyWithHTML: vi.fn(),
    answerCbQuery: vi.fn(),
    editMessageText: vi.fn(),
    deleteMessage: vi.fn(),
    ...options
  } as any;
}

export function createMockMessage(options: any = {}) {
  return {
    message_id: options.message_id || 789,
    from: options.from || { id: 456, username: 'testuser' },
    chat: options.chat || { id: 123, type: 'private' },
    date: options.date || Date.now() / 1000,
    text: options.text,
    photo: options.photo,
    voice: options.voice,
    document: options.document,
    ...options
  };
}

export function createMockTelegram() {
  return {
    sendMessage: vi.fn().mockResolvedValue({ message_id: 999 }),
    editMessageText: vi.fn().mockResolvedValue(true),
    deleteMessage: vi.fn().mockResolvedValue(true),
    answerCallbackQuery: vi.fn().mockResolvedValue(true),
    getFile: vi.fn().mockResolvedValue({ file_path: 'test/path' }),
    getFileLink: vi.fn().mockResolvedValue('https://example.com/file'),
    setWebhook: vi.fn().mockResolvedValue(true),
```