# a7046c18:packages_docs_plugin-registry_platform_twitter_testing-guide.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/testing-guide.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    // Force garbage collection
    if (global.gc) global.gc();
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryGrowth = finalMemory - initialMemory;
    
    // Should maintain reasonable memory usage
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
});
```

## Mock Utilities

### Twitter API Mocks

```typescript
export function createMockTwitterApi() {
  return {
    v2: {
      me: vi.fn().mockResolvedValue({
        data: { id: '123', username: 'testbot' }
      }),
      
      tweet: vi.fn().mockResolvedValue({
        data: { id: '456', text: 'Mocked tweet' }
      }),
      
      reply: vi.fn().mockResolvedValue({
        data: { id: '789', text: 'Mocked reply' }
      }),
      
      homeTimeline: vi.fn().mockResolvedValue({
        data: [
          {
            id: '111',
            text: 'Timeline tweet 1',
            author_id: '222',
            created_at: new Date().toISOString()
          }
        ],
        meta: { next_token: 'next_123' }
      }),
      
      search: vi.fn().mockResolvedValue({
        data: [],
        meta: {}
      }),
      
      like: vi.fn().mockResolvedValue({ data: { liked: true } }),
      retweet: vi.fn().mockResolvedValue({ data: { retweeted: true } })
    }
  };
}

export function createMockRuntime(overrides = {}) {
  return {
    getSetting: vi.fn((key) => {
      const defaults = {
        TWITTER_DRY_RUN: 'true',
        TWITTER_POST_ENABLE: 'false',
        TWITTER_SEARCH_ENABLE: 'false'
      };
      return overrides[key] || defaults[key];
    }),
    
    generateText: vi.fn().mockResolvedValue({
      text: 'Generated response'
    }),
    
    character: {
      name: 'TestBot',
      postExamples: ['Example tweet'],
      ...overrides.character
    },
    
    logger: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn()
    },
    
    emit: vi.fn(),
    on: vi.fn(),
    
    ...overrides
  };
}
```

### Test Helpers

```typescript
export async function waitForTweet(
  runtime: IAgentRuntime,
  timeout = 5000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout waiting for tweet'));
    }, timeout);
    
    runtime.on('twitter:post:simulate', (tweet) => {
      clearTimeout(timer);
      resolve(tweet);
    });
  });
}

export async function simulateTimeline(
  runtime: IAgentRuntime,
  tweets: any[]
) {
  await runtime.emit('twitter:timeline:update', { tweets });
}

export function createTestTweet(overrides = {}) {
  return {
    id: Math.random().toString(36).substring(7),
    text: 'Test tweet',
    author_id: '123',
    created_at: new Date().toISOString(),
    public_metrics: {
      like_count: 0,
      retweet_count: 0,
      reply_count: 0,
      quote_count: 0
    },
    ...overrides
  };
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
    coverage: {
      provider: 'v8',
```