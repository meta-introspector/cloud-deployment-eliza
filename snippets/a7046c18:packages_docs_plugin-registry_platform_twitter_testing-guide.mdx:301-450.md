# a7046c18:packages_docs_plugin-registry_platform_twitter_testing-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/testing-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        clients: ['twitter']
      },
      settings: {
        TWITTER_API_KEY: process.env.TWITTER_TEST_API_KEY,
        TWITTER_API_SECRET_KEY: process.env.TWITTER_TEST_API_SECRET,
        TWITTER_ACCESS_TOKEN: process.env.TWITTER_TEST_ACCESS_TOKEN,
        TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_TEST_TOKEN_SECRET,
        TWITTER_DRY_RUN: 'true'  // Always dry run for tests
      }
    });
    
    service = await TwitterService.start(runtime);
  });
  
  afterAll(async () => {
    await service.stop();
  });
  
  it('should create client instance', async () => {
    const client = await service.createClient(
      runtime,
      'test-client',
      {}
    );
    
    expect(client).toBeDefined();
    expect(client.client).toBeDefined();
    expect(client.post).toBeDefined();
    expect(client.interaction).toBeDefined();
  });
  
  it('should handle WORLD_JOINED event', (done) => {
    runtime.on(['WORLD_JOINED', 'twitter:world:joined'], (event) => {
      expect(event.world).toBeDefined();
      expect(event.world.name).toContain('Twitter');
      done();
    });
    
    service.createClient(runtime, 'event-test', {});
  });
});
```

### Testing End-to-End Flow

```typescript
describe('E2E Twitter Flow', () => {
  let runtime: AgentRuntime;
  
  beforeAll(async () => {
    runtime = new AgentRuntime({
      character: {
        name: 'E2ETestBot',
        clients: ['twitter'],
        postExamples: ['Test tweet from E2E bot']
      },
      plugins: [bootstrapPlugin, twitterPlugin],
      settings: {
        TWITTER_DRY_RUN: 'true',
        TWITTER_POST_ENABLE: 'true',
        TWITTER_POST_IMMEDIATELY: 'true'
      }
    });
  });
  
  it('should post on startup when configured', async () => {
    const postSpy = vi.fn();
    runtime.on('twitter:post:simulate', postSpy);
    
    await runtime.start();
    
    // Wait for post
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.any(String)
      })
    );
  });
  
  it('should process timeline interactions', async () => {
    const interactionSpy = vi.fn();
    runtime.on('twitter:interaction:simulate', interactionSpy);
    
    // Simulate timeline update
    await runtime.emit('twitter:timeline:update', {
      tweets: [
        {
          id: '123',
          text: '@testbot hello!',
          author: { username: 'user1' }
        }
      ]
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    expect(interactionSpy).toHaveBeenCalled();
  });
});
```

## Performance Testing

### Rate Limit Testing

```typescript
describe('Rate Limit Handling', () => {
  it('should respect rate limits', async () => {
    const client = new ClientBase(runtime, {});
    const requests = [];
    
    // Simulate many requests
    for (let i = 0; i < 100; i++) {
      requests.push(client.tweet(`Test ${i}`));
    }
    
    const results = await Promise.allSettled(requests);
    
    // Should queue requests, not fail
    const succeeded = results.filter(r => r.status === 'fulfilled');
    expect(succeeded.length).toBeGreaterThan(0);
    
    // Check for rate limit handling
    const rateLimited = results.filter(r => 
      r.status === 'rejected' && 
      r.reason?.code === 429
    );
    
    if (rateLimited.length > 0) {
      // Should have retry logic
      expect(client.requestQueue.size()).toBeGreaterThan(0);
    }
  });
});
```

### Memory Usage Testing

```typescript
describe('Memory Management', () => {
  it('should not leak memory with processed tweets', async () => {
    const client = new TwitterInteractionClient(mockClient, runtime, {});
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Process many tweets
    for (let i = 0; i < 10000; i++) {
      client.markAsProcessed(`tweet_${i}`);
    }
```