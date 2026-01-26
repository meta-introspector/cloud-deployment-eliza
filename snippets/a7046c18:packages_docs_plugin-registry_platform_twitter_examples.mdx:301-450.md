# a7046c18:packages_docs_plugin-registry_platform_twitter_examples.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/examples.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Bot that monitors specific keywords:

```typescript
const keywordMonitor = {
  name: "KeywordTracker",
  description: "Monitors and responds to keyword mentions",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  keywords: ["#AIagents", "#elizaOS", "autonomous agents", "AI automation"],
  settings: {
    TWITTER_SEARCH_ENABLE: "true",
    TWITTER_POST_ENABLE: "false"
  }
};

// Custom search action
const searchKeywordsAction: Action = {
  name: "SEARCH_KEYWORDS",
  description: "Search for specific keywords",
  
  handler: async (runtime, message, state, options, callback) => {
    const twitterService = runtime.getService('twitter');
    const keywords = runtime.character.keywords;
    
    for (const keyword of keywords) {
      const results = await twitterService.client.search(keyword, {
        max_results: 10,
        'tweet.fields': ['created_at', 'public_metrics', 'author_id']
      });
      
      for (const tweet of results.data || []) {
        // Process relevant tweets
        if (shouldEngageWith(tweet)) {
          await engageWithTweet(tweet, runtime);
        }
      }
    }
    
    return true;
  }
};
```

### Hashtag Tracker

Bot that tracks trending hashtags:

```typescript
const hashtagTracker = {
  name: "HashtagBot",
  description: "Tracks and engages with trending hashtags",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  trackedHashtags: ["#Web3", "#AI", "#BuildInPublic", "#100DaysOfCode"],
  settings: {
    TWITTER_SEARCH_ENABLE: "true",
    TWITTER_INTERACTION_INTERVAL_MIN: "30",  // Don't spam
    TWITTER_MAX_INTERACTIONS_PER_RUN: "5"    // Limit interactions
  }
};
```

### User Monitor

Bot that monitors specific users:

```typescript
const userMonitor = {
  name: "UserTracker",
  description: "Monitors and interacts with specific users",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    TWITTER_TARGET_USERS: "vitalikbuterin,balajis,cdixon",
    TWITTER_TIMELINE_ALGORITHM: "weighted",
    TWITTER_TIMELINE_USER_BASED_WEIGHT: "10",  // Heavily prioritize target users
    TWITTER_AUTO_RESPOND_MENTIONS: "false",    // Only interact with targets
    TWITTER_AUTO_RESPOND_REPLIES: "false"
  }
};
```

## Advanced Bots

### Full Engagement Bot

Bot with all features enabled:

```typescript
const fullEngagementBot = {
  name: "FullEngagement",
  description: "Complete Twitter engagement bot",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  postExamples: [
    "What's the most underrated technology right now?",
    "Building in public update: Just crossed 1000 users!",
    "The best developers I know are constantly learning"
  ],
  settings: {
    // Posting
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_INTERVAL_MIN: "180",
    TWITTER_POST_INTERVAL_MAX: "360",
    
    // Interactions
    TWITTER_SEARCH_ENABLE: "true",
    TWITTER_AUTO_RESPOND_MENTIONS: "true",
    TWITTER_AUTO_RESPOND_REPLIES: "true",
    
    // Timeline processing
    TWITTER_ENABLE_ACTION_PROCESSING: "true",
    TWITTER_ACTION_INTERVAL: "240",
    
    // Algorithm configuration
    TWITTER_TIMELINE_ALGORITHM: "weighted",
    TWITTER_TIMELINE_USER_BASED_WEIGHT: "4",
    TWITTER_TIMELINE_TIME_BASED_WEIGHT: "3",
    TWITTER_TIMELINE_RELEVANCE_WEIGHT: "6"
  }
};
```

### Multi-Account Bot

Managing multiple Twitter accounts:

```typescript
const multiAccountSetup = async (runtime: IAgentRuntime) => {
  const twitterService = runtime.getService('twitter') as TwitterService;
  
  // Main account
  const mainAccount = await twitterService.createClient(
    runtime,
    'main-account',
    {
      TWITTER_API_KEY: process.env.MAIN_API_KEY,
      TWITTER_API_SECRET_KEY: process.env.MAIN_API_SECRET,
      TWITTER_ACCESS_TOKEN: process.env.MAIN_ACCESS_TOKEN,
      TWITTER_ACCESS_TOKEN_SECRET: process.env.MAIN_ACCESS_SECRET,
      TWITTER_POST_ENABLE: "true"
    }
  );
  
  // Support account
  const supportAccount = await twitterService.createClient(
    runtime,
    'support-account',
    {
      TWITTER_API_KEY: process.env.SUPPORT_API_KEY,
```