# a7046c18:packages_docs_plugin-registry_platform_twitter_developer-guide.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/developer-guide.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  postExamples: [
    "Exploring the future of decentralized AI...",
    "What if consciousness is just emergence at scale?",
    "Building in public: day 42 of the journey"
  ],
  settings: {
    // Override environment variables
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_INTERVAL_MIN: "60"
  }
};
```

## Timeline Algorithms

### Weighted Algorithm

Sophisticated scoring system for quality interactions:

```typescript
interface WeightedScoringParams {
  userWeight: number;      // Default: 3
  timeWeight: number;      // Default: 2
  relevanceWeight: number; // Default: 5
}

function calculateWeightedScore(tweet: Tweet, params: WeightedScoringParams): number {
  // User-based scoring (0-10)
  const userScore = calculateUserScore(tweet.author);
  
  // Time-based scoring (0-10)
  const ageInHours = (Date.now() - tweet.createdAt) / (1000 * 60 * 60);
  const timeScore = Math.max(0, 10 - (ageInHours / 2));
  
  // Relevance scoring (0-10)
  const relevanceScore = calculateRelevanceScore(tweet.text);
  
  // Combined weighted score
  return (userScore * params.userWeight) +
         (timeScore * params.timeWeight) +
         (relevanceScore * params.relevanceWeight);
}

function calculateUserScore(author: TwitterUser): number {
  let score = 5; // Base score
  
  // Target users get max score
  if (isTargetUser(author.username)) return 10;
  
  // Adjust based on metrics
  if (author.verified) score += 2;
  if (author.followersCount > 10000) score += 1;
  if (author.followingRatio > 0.8) score += 1;
  if (hasInteractedBefore(author.id)) score += 1;
  
  return Math.min(score, 10);
}
```

### Latest Algorithm

Simple chronological processing:

```typescript
function applyLatestAlgorithm(tweets: Tweet[]): Tweet[] {
  return tweets
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, this.maxInteractionsPerRun);
}
```

## Message Processing

### Tweet Generation

```typescript
async function generateTweet(runtime: IAgentRuntime): Promise<string> {
  // Build context
  const context = {
    recentTweets: await getRecentTweets(),
    currentTopics: await getTrendingTopics(),
    character: runtime.character,
    postExamples: runtime.character.postExamples
  };
  
  // Generate using LLM
  const response = await runtime.generateText({
    messages: [{
      role: 'system',
      content: buildTweetPrompt(context)
    }],
    maxTokens: 100
  });
  
  // Validate and clean
  return validateTweet(response.text);
}
```

### Response Generation

```typescript
async function generateResponse(
  tweet: Tweet,
  runtime: IAgentRuntime
): Promise<string | null> {
  // Check if we should respond
  if (!shouldRespond(tweet)) return null;
  
  // Build conversation context
  const thread = await getConversationThread(tweet.id);
  
  // Generate contextual response
  const response = await runtime.generateText({
    messages: [
      {
        role: 'system',
        content: 'You are responding to a tweet. Be concise and engaging.'
      },
      ...thread.map(t => ({
        role: t.author.id === runtime.agentId ? 'assistant' : 'user',
        content: t.text
      }))
    ],
    maxTokens: 100
  });
  
  return response.text;
}
```

## Rate Limiting & Queuing

### Request Queue Implementation

```typescript
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private rateLimiter: RateLimiter;
  
  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          // Check rate limits
          await this.rateLimiter.waitIfNeeded();
          
          // Execute request
          const result = await request();
```