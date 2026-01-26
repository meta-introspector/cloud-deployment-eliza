# a7046c18:packages_docs_plugin-registry_platform_twitter_examples.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/examples.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      TWITTER_API_SECRET_KEY: process.env.SUPPORT_API_SECRET,
      TWITTER_ACCESS_TOKEN: process.env.SUPPORT_ACCESS_TOKEN,
      TWITTER_ACCESS_TOKEN_SECRET: process.env.SUPPORT_ACCESS_SECRET,
      TWITTER_POST_ENABLE: "false",
      TWITTER_SEARCH_ENABLE: "true"
    }
  );
  
  // News account
  const newsAccount = await twitterService.createClient(
    runtime,
    'news-account',
    {
      TWITTER_API_KEY: process.env.NEWS_API_KEY,
      TWITTER_API_SECRET_KEY: process.env.NEWS_API_SECRET,
      TWITTER_ACCESS_TOKEN: process.env.NEWS_ACCESS_TOKEN,
      TWITTER_ACCESS_TOKEN_SECRET: process.env.NEWS_ACCESS_SECRET,
      TWITTER_POST_ENABLE: "true",
      TWITTER_POST_INTERVAL_MIN: "60"  // More frequent posts
    }
  );
  
  console.log('Multi-account setup complete!');
};
```

### Analytics Bot

Bot that tracks and reports analytics:

```typescript
const analyticsBot = {
  name: "AnalyticsBot",
  description: "Tracks Twitter performance metrics",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    TWITTER_POST_ENABLE: "true",
    TWITTER_SEARCH_ENABLE: "false"  // Focus on analytics
  }
};

// Analytics action
const analyticsAction: Action = {
  name: "TWITTER_ANALYTICS",
  description: "Generate Twitter analytics report",
  
  handler: async (runtime, message, state, options, callback) => {
    const twitterService = runtime.getService('twitter');
    const client = twitterService.getClient(runtime.agentId);
    
    // Get recent tweets
    const tweets = await client.client.getUserTweets(client.profile.id, {
      max_results: 100,
      'tweet.fields': ['created_at', 'public_metrics']
    });
    
    // Calculate metrics
    const metrics = {
      totalTweets: tweets.data.length,
      totalLikes: 0,
      totalRetweets: 0,
      totalReplies: 0,
      avgEngagement: 0
    };
    
    tweets.data.forEach(tweet => {
      metrics.totalLikes += tweet.public_metrics.like_count;
      metrics.totalRetweets += tweet.public_metrics.retweet_count;
      metrics.totalReplies += tweet.public_metrics.reply_count;
    });
    
    metrics.avgEngagement = 
      (metrics.totalLikes + metrics.totalRetweets + metrics.totalReplies) / 
      metrics.totalTweets;
    
    // Generate report
    const report = `
📊 Twitter Analytics Report

📝 Total Tweets: ${metrics.totalTweets}
❤️ Total Likes: ${metrics.totalLikes}
🔄 Total Retweets: ${metrics.totalRetweets}
💬 Total Replies: ${metrics.totalReplies}
📈 Avg Engagement: ${metrics.avgEngagement.toFixed(2)}

Top performing tweets coming in next thread...
    `;
    
    await callback({ text: report });
    return true;
  }
};
```

## Testing Examples

### Dry Run Bot

Test without actually posting:

```typescript
const testBot = {
  name: "TestBot",
  description: "Bot for testing configurations",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  postExamples: [
    "This is a test tweet that won't actually post",
    "Testing the Twitter integration..."
  ],
  settings: {
    TWITTER_DRY_RUN: "true",  // Simulate all actions
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_IMMEDIATELY: "true",
    TWITTER_SEARCH_ENABLE: "true"
  }
};

// Monitor dry run output
runtime.on('twitter:dryRun', (action) => {
  console.log(`[DRY RUN] Would ${action.type}:`, action.content);
});
```

### Debug Bot

Bot with extensive logging:

```typescript
const debugBot = {
  name: "DebugBot",
  description: "Bot with debug logging enabled",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    DEBUG: "eliza:twitter:*",  // Enable all Twitter debug logs
    TWITTER_POST_ENABLE: "true",
    TWITTER_RETRY_LIMIT: "1",  // Fail fast for debugging
    TWITTER_POST_INTERVAL_MIN: "1"  // Quick testing
  }
};
```

## Error Handling Examples

### Resilient Bot

Bot with comprehensive error handling:

```