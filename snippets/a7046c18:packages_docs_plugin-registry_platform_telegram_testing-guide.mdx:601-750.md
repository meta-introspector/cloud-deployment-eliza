# a7046c18:packages_docs_plugin-registry_platform_telegram_testing-guide.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/testing-guide.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    deleteWebhook: vi.fn().mockResolvedValue(true)
  };
}
```

### Test Helpers

```typescript
export async function sendTestMessage(
  text: string,
  chatId: string | number
): Promise<any> {
  const response = await fetch(
    `https://api.telegram.org/bot${TEST_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    }
  );
  
  return response.json();
}

export async function waitForBotResponse(
  chatId: string | number,
  timeout = 5000
): Promise<any> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const updates = await getUpdates();
    const botMessage = updates.find(u => 
      u.message?.from?.is_bot && 
      u.message?.chat?.id === chatId
    );
    
    if (botMessage) return botMessage.message;
    
    await sleep(100);
  }
  
  return null;
}

export async function simulateCallbackQuery(
  messageId: number,
  callbackData: string
): Promise<void> {
  // Simulate callback query update
  const update = {
    update_id: Date.now(),
    callback_query: {
      id: 'test_callback_' + Date.now(),
      from: { id: TEST_USER_ID, username: 'testuser' },
      message: { message_id: messageId },
      data: callbackData
    }
  };
  
  // Process through bot
  await bot.handleUpdate(update);
}
```

## Debug Utilities

### Enable Debug Logging

```typescript
// Enable debug logging for tests
process.env.DEBUG = 'eliza:telegram:*';

// Custom test logger
export class TestLogger {
  private logs: Array<{
    level: string;
    message: string;
    data?: any;
    timestamp: Date;
  }> = [];
  
  log(level: string, message: string, data?: any) {
    this.logs.push({
      level,
      message,
      data,
      timestamp: new Date()
    });
    
    if (process.env.VERBOSE_TESTS) {
      console.log(`[${level}] ${message}`, data || '');
    }
  }
  
  getLogs(filter?: { level?: string; pattern?: RegExp }) {
    return this.logs.filter(log => {
      if (filter?.level && log.level !== filter.level) return false;
      if (filter?.pattern && !filter.pattern.test(log.message)) return false;
      return true;
    });
  }
  
  clear() {
    this.logs = [];
  }
}
```

## Test Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'forks', // Isolate tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'tests',
        '**/*.test.ts',
        '**/types.ts'
      ]
    }
  }
});
```

### Test Setup

```typescript
// tests/setup.ts
import { config } from 'dotenv';
import { vi } from 'vitest';

// Load test environment
config({ path: '.env.test' });

// Validate test environment
if (!process.env.TELEGRAM_TEST_TOKEN) {
```