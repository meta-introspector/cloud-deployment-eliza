# a7046c18:packages_docs_plugin-registry_platform_twitter_developer-guide.mdx:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/developer-guide.mdx:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
import { twitterPlugin } from '@elizaos/plugin-twitter';
import { AgentRuntime } from '@elizaos/core';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';

const runtime = new AgentRuntime({
  plugins: [bootstrapPlugin, twitterPlugin],
  character: {
    name: "TwitterBot",
    clients: ["twitter"],
    postExamples: [
      "Just shipped a new feature!",
      "Thoughts on the future of AI?"
    ],
    settings: {
      TWITTER_API_KEY: process.env.TWITTER_API_KEY,
      TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY,
      TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      TWITTER_POST_ENABLE: "true"
    }
  }
});

await runtime.start();
```

### Multi-Account Setup

```typescript
// Create multiple Twitter clients
const mainAccount = await twitterService.createClient(
  runtime,
  'main-account',
  mainAccountConfig
);

const supportAccount = await twitterService.createClient(
  runtime,
  'support-account',
  supportAccountConfig
);

// Each client operates independently
mainAccount.post.start();
supportAccount.interaction.start();
```

### Custom Actions

```typescript
const customTwitterAction: Action = {
  name: "TWITTER_ANALYTICS",
  description: "Analyze tweet performance",
  
  handler: async (runtime, message, state, options, callback) => {
    const twitterService = runtime.getService('twitter') as TwitterService;
    const client = twitterService.getClient(runtime.agentId);
    
    // Get recent tweets
    const tweets = await client.client.getRecentTweets();
    
    // Analyze performance
    const analytics = tweets.map(tweet => ({
      id: tweet.id,
      text: tweet.text.substring(0, 50),
      likes: tweet.public_metrics.like_count,
      retweets: tweet.public_metrics.retweet_count,
      replies: tweet.public_metrics.reply_count
    }));
    
    await callback({
      text: `Recent tweet performance:\n${JSON.stringify(analytics, null, 2)}`
    });
    
    return true;
  }
};
```

## Performance Optimization

### Caching Strategy

```typescript
class TwitterCache {
  private tweetCache: LRUCache<string, Tweet>;
  private userCache: LRUCache<string, TwitterUser>;
  private timelineCache: CachedTimeline | null = null;
  
  constructor() {
    this.tweetCache = new LRUCache({
      max: 10000,
      ttl: 1000 * 60 * 60 // 1 hour
    });
    
    this.userCache = new LRUCache({
      max: 5000,
      ttl: 1000 * 60 * 60 * 24 // 24 hours
    });
  }
  
  async getCachedTimeline(): Promise<Tweet[] | null> {
    if (!this.timelineCache) return null;
    
    const age = Date.now() - this.timelineCache.timestamp;
    if (age > 60000) return null; // 1 minute expiry
    
    return this.timelineCache.tweets;
  }
}
```

### Batch Operations

```typescript
async function batchOperations() {
  // Batch user lookups
  const userIds = tweets.map(t => t.author_id);
  const users = await client.v2.users(userIds);
  
  // Batch tweet lookups
  const tweetIds = mentions.map(m => m.referenced_tweet_id);
  const referencedTweets = await client.v2.tweets(tweetIds);
  
  // Process in parallel
  await Promise.all([
    processTweets(tweets),
    processUsers(users),
    processMentions(mentions)
  ]);
}
```

### Memory Management

```typescript
class MemoryManager {
  private maxProcessedTweets = 10000;
  private cleanupInterval = 1000 * 60 * 60; // 1 hour
  
  startCleanup() {
    setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }
  
  cleanup() {
    // Clean old processed tweets
```