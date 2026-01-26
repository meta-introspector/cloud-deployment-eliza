# a7046c18:packages_docs_plugin-registry_platform_discord_examples.mdx:601-708

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/examples.mdx:601-708
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const result = await riskyOperation();
      await callback({ text: `Success: ${result}` });
    } catch (error) {
      // Log the error
      runtime.logger.error('Action failed:', error);
      
      // Provide user-friendly error message
      if (error.code === 50013) {
        await callback({
          text: "I don't have permission to do that in this channel."
        });
      } else if (error.code === 50001) {
        await callback({
          text: "I can't access that channel or message."
        });
      } else {
        await callback({
          text: "Something went wrong. Please try again later."
        });
      }
    }
    
    return true;
  }
};
```

## Testing Examples

### Test Suite for Discord Bot

```typescript
import { DiscordTestSuite } from '@elizaos/plugin-discord';

const testSuite = new DiscordTestSuite();

// Configure test environment
testSuite.configure({
  testChannelId: process.env.DISCORD_TEST_CHANNEL_ID,
  testVoiceChannelId: process.env.DISCORD_TEST_VOICE_CHANNEL_ID
});

// Run tests
await testSuite.run();
```

## Best Practices Examples

### Rate Limiting

```typescript
import { RateLimiter } from '@elizaos/core';

const rateLimitedAction: Action = {
  name: "RATE_LIMITED_ACTION",
  description: "Action with rate limiting",
  
  handler: async (runtime, message, state, options, callback) => {
    const limiter = new RateLimiter({
      windowMs: 60000, // 1 minute
      max: 5 // 5 requests per minute per user
    });
    
    if (!limiter.tryConsume(message.userId)) {
      await callback({
        text: "Please wait a moment before using this command again."
      });
      return false;
    }
    
    // Proceed with action
    await performAction();
    return true;
  }
};
```

### Caching

```typescript
import { LRUCache } from 'lru-cache';

const cachedDataAction: Action = {
  name: "CACHED_DATA",
  description: "Action that uses caching",
  
  handler: async (runtime, message, state, options, callback) => {
    const cache = runtime.getCache('discord-data');
    const cacheKey = `user-data-${message.userId}`;
    
    // Try to get from cache
    let userData = cache.get(cacheKey);
    
    if (!userData) {
      // Fetch fresh data
      userData = await fetchUserData(message.userId);
      // Cache for 5 minutes
      cache.set(cacheKey, userData, { ttl: 300000 });
    }
    
    await callback({
      text: `Your data: ${JSON.stringify(userData)}`
    });
    
    return true;
  }
};
```
```