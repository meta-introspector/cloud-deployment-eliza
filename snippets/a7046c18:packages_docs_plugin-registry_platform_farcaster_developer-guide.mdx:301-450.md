# a7046c18:packages_docs_plugin-registry_platform_farcaster_developer-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/developer-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  async getProfile(fid: number): Promise<Profile>
}
```

## Client Architecture

### FarcasterClient

Core client wrapping Neynar API operations:

```typescript
class FarcasterClient {
  private neynar: NeynarAPIClient;
  private signerUuid: string;
  
  constructor(params: {
    neynar: NeynarAPIClient,
    signerUuid: string
  })
  
  // Casting operations
  async publishCast(text: string, options?: {
    embeds?: Array<{ url: string }>,
    replyTo?: string,
    channelId?: string
  }): Promise<Cast>
  
  async reply(params: {
    text: string,
    replyTo: { hash: string, fid: number }
  }): Promise<Cast>
  
  async deleteCast(targetHash: string): Promise<void>
  
  // User operations
  async getUser(): Promise<User>
  async getUserByFid(fid: number): Promise<User>
  async getUserByUsername(username: string): Promise<User>
  
  // Timeline operations
  async getMentions(fid: number, cursor?: string): Promise<Cast[]>
  async getTimeline(type: 'ForYou' | 'Following', cursor?: string): Promise<Cast[]>
  async getCast(hash: string): Promise<Cast>
  
  // Engagement operations
  async likeCast(targetHash: string): Promise<void>
  async unlikeCast(targetHash: string): Promise<void>
  async recast(targetHash: string): Promise<void>
  async unrecast(targetHash: string): Promise<void>
  async followUser(targetFid: number): Promise<void>
  async unfollowUser(targetFid: number): Promise<void>
}
```

### Common Utilities

#### AsyncQueue
Manages asynchronous operations with concurrency control:

```typescript
class AsyncQueue {
  constructor(concurrency: number)
  push<T>(fn: () => Promise<T>): Promise<T>
}
```

#### Helper Functions

```typescript
// Cast utilities
castUuid(cast: Cast): UUID  // Generate unique ID for cast
neynarCastToCast(cast: NeynarCast): Cast  // Convert Neynar format
formatCastTimestamp(timestamp: number): string  // Format timestamps

// Prompt formatting
formatCast(cast: Cast): string  // Format cast for AI processing
formatTimeline(casts: Cast[]): string  // Format timeline for context

// Cache management
lastCastCacheKey(agentId: UUID): string  // Generate cache keys
```

## Event System

### Cast Events

```typescript
runtime.on("cast:new", (cast: Cast) => {
  // Handle new cast
});

runtime.on("cast:reply", (reply: CastReply) => {
  // Handle reply
});

runtime.on("cast:like", (like: CastLike) => {
  // Handle like
});
```

### Error Events

```typescript
runtime.on("farcaster:error", (error: FarcasterError) => {
  // Handle error
});
```

## Memory & Storage

### Memory System

The plugin uses elizaOS's memory system for persistence rather than direct database tables:

```typescript
// Cast metadata stored when sending
await runtime.createMemory({
  type: 'metadata',
  content: {
    castHash: string,
    threadId: string,
    platform: 'farcaster',
    messageId: UUID,
    sentAt: number
  }
});

// Message memory for each cast
await runtime.createMemory({
  type: 'message',
  content: {
    text: string,
    source: 'farcaster',
    hash: string,
    fid: number,
    timestamp: number,
    inReplyTo?: string
  }
});
```

### Caching Strategy

LRU cache for performance optimization:
- **Cast Cache**: TTL 30 minutes, 9000 entries max
- **Profile Cache**: User profile data
- **Timeline Cache**: Recent timeline casts
- **Last Cast Tracking**: Per-agent last cast timestamps

## Security Considerations
```