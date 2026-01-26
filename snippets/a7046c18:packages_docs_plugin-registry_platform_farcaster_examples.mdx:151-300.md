# a7046c18:packages_docs_plugin-registry_platform_farcaster_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  // Get author profile
  const author = await getProfile(cast.author.fid);
  
  return {
    originalCast: cast,
    thread: thread,
    author: author,
    topics: extractTopics(cast.text)
  };
}
```

## Engagement Examples

### Engagement Note

```typescript
// Note: Like, recast, and follow functionality are managed internally
// by the FarcasterService and MessageService based on agent behavior
// and are not exposed as direct actions at this time.
```

## Service Integration Examples

### Custom Service Implementation

```typescript
import { Service, IAgentRuntime } from "@elizaos/core";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

class CustomFarcasterService implements Service {
  private client: NeynarAPIClient;
  private runtime: IAgentRuntime;
  
  async start(runtime: IAgentRuntime): Promise<void> {
    this.runtime = runtime;
    this.client = new NeynarAPIClient({
      apiKey: process.env.FARCASTER_NEYNAR_API_KEY!
    });
    
    // Start monitoring
    this.startMonitoring();
  }
  
  private async startMonitoring() {
    // Monitor mentions
    setInterval(async () => {
      const mentions = await this.client.getMentions();
      
      for (const mention of mentions) {
        await this.handleMention(mention);
      }
    }, 30000); // Check every 30 seconds
  }
  
  private async handleMention(mention: Cast) {
    // Generate response
    const response = await this.generateResponse(mention);
    
    // Reply
    await this.client.reply(mention.hash, mention.author.fid, response);
  }
  
  async stop(): Promise<void> {
    // Cleanup
    await this.client.disconnect();
  }
}
```

### Event-Driven Responses

```typescript
// Set up event listeners for Farcaster events
runtime.on("farcaster:mention", async (event) => {
  const { cast, author } = event;
  
  // Check if we should respond
  if (shouldRespond(cast)) {
    const response = await generateResponse(cast);
    
    await replyToCast(cast.hash, author.fid, response);
  }
});

runtime.on("farcaster:followed", async (event) => {
  const { follower } = event;
  
  // Auto-follow back
  await followUser(follower.fid);
  
  // Send welcome message
  await postCast(`Welcome @${follower.username}! Looking forward to our interactions.`);
});
```

## Advanced Patterns

### Scheduled Casting

```typescript
// Schedule regular casts
class ScheduledCaster {
  private runtime: IAgentRuntime;
  
  constructor(runtime: IAgentRuntime) {
    this.runtime = runtime;
  }
  
  start() {
    // Morning update
    this.scheduleDaily("09:00", async () => {
      await this.postMorningUpdate();
    });
    
    // Evening reflection
    this.scheduleDaily("21:00", async () => {
      await this.postEveningReflection();
    });
  }
  
  private async postMorningUpdate() {
    const insights = await this.generateDailyInsights();
    
    await postCast({
      text: `Good morning! Today's insight: ${insights}`,
      channel: "/elizaos"
    });
  }
  
  private async postEveningReflection() {
    const reflection = await this.generateReflection();
    
    await postCast({
      text: `Evening thoughts: ${reflection}`,
      channel: "/elizaos"
    });
  }
}
```

### Channel-Specific Behavior

```typescript
// Different behavior for different channels
class ChannelManager {
  private channelConfigs = {
    "/elizaos": {
      style: "technical",
      replyProbability: 0.8,
```