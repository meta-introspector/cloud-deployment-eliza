# a7046c18:packages_docs_plugin-registry_platform_twitter_examples.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/examples.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```typescript
const resilientBot = {
  name: "ResilientBot",
  description: "Bot with robust error handling",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    TWITTER_RETRY_LIMIT: "5",
    TWITTER_POST_ENABLE: "true"
  }
};

// Error handling wrapper
const safeTwitterAction = (action: Action): Action => ({
  ...action,
  handler: async (runtime, message, state, options, callback) => {
    try {
      return await action.handler(runtime, message, state, options, callback);
    } catch (error) {
      runtime.logger.error(`Twitter action failed: ${action.name}`, error);
      
      // Handle specific errors
      if (error.code === 403) {
        await callback({
          text: "I don't have permission to do that. Please check my Twitter app permissions."
        });
      } else if (error.code === 429) {
        await callback({
          text: "I'm being rate limited. I'll try again later."
        });
      } else {
        await callback({
          text: "Something went wrong with Twitter. I'll try again soon."
        });
      }
      
      return false;
    }
  }
});
```

## Integration Examples

### With Other Platforms

```typescript
import { discordPlugin } from '@elizaos/plugin-discord';
import { telegramPlugin } from '@elizaos/plugin-telegram';

const crossPlatformBot = {
  name: "CrossPlatform",
  description: "Bot that posts across platforms",
  plugins: [bootstrapPlugin, twitterPlugin, discordPlugin, telegramPlugin],
  clients: ["twitter", "discord", "telegram"],
  postExamples: [
    "New blog post: Understanding distributed systems",
    "What's your favorite programming language and why?"
  ],
  settings: {
    // Twitter settings
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_INTERVAL_MIN: "180",
    
    // Discord settings
    DISCORD_API_TOKEN: process.env.DISCORD_TOKEN,
    
    // Telegram settings
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_TOKEN
  }
};

// Cross-platform posting action
const crossPostAction: Action = {
  name: "CROSS_POST",
  description: "Post to all platforms",
  
  handler: async (runtime, message, state, options, callback) => {
    const content = options.content || "Hello from all platforms!";
    
    // Post to Twitter
    const twitterService = runtime.getService('twitter');
    await twitterService.client.tweet(content);
    
    // Post to Discord
    const discordService = runtime.getService('discord');
    await discordService.sendMessage(CHANNEL_ID, content);
    
    // Post to Telegram
    const telegramService = runtime.getService('telegram');
    await telegramService.sendMessage(CHAT_ID, content);
    
    await callback({
      text: "Posted to all platforms successfully!"
    });
    
    return true;
  }
};
```

## Best Practices Example

### Production Bot

Complete production-ready configuration:

```typescript
import { twitterPlugin } from '@elizaos/plugin-twitter';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';
import { AgentRuntime } from '@elizaos/core';

const productionBot = {
  name: "ProductionTwitterBot",
  description: "Production-ready Twitter bot",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  
  // Diverse post examples
  postExamples: [
    // Questions to drive engagement
    "What's the biggest challenge you're facing in your project right now?",
    "If you could automate one thing in your workflow, what would it be?",
    
    // Insights and observations
    "The best code is the code you don't have to write",
    "Sometimes the simplest solution is the hardest to find",
    
    // Personal updates
    "Working on something exciting today. Can't wait to share more soon!",
    "Learning from yesterday's debugging session: always check the obvious first",
    
    // Threads
    "Thread: 5 lessons from building production systems\n\n1/",
    
    // Reactions to trends
    "Interesting to see how AI is changing the way we think about software development"
  ],
  
  settings: {
    // Credentials from environment
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    
    // Conservative posting schedule
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_INTERVAL_MIN: "240",  // 4 hours
    TWITTER_POST_INTERVAL_MAX: "480",  // 8 hours
```