# a7046c18:packages_docs_plugin-registry_platform_farcaster_developer-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/developer-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
// Automatically handled when casting
// Stores cast hash, thread ID, and message metadata
EventType: 'cast:sent'
Payload: {
  castHash: string,
  threadId: string,
  messageId: UUID,
  platform: 'farcaster'
}
```

### handleMessageReceived

Processes incoming Farcaster messages and creates memories:

```typescript
// Automatically triggered for incoming messages
EventType: 'message:received'
Payload: {
  cast: Cast,
  profile: Profile,
  threadId: string
}
```

## Managers

### FarcasterAgentManager

Orchestrates all Farcaster operations for an agent:

```typescript
class FarcasterAgentManager {
  client: FarcasterClient       // Neynar API client
  casts: FarcasterCastManager   // Autonomous posting
  interactions: FarcasterInteractionManager  // Mentions/replies
  
  async start()  // Start all managers
  async stop()   // Stop all managers
}
```

### FarcasterCastManager

Handles autonomous casting based on configuration:

```typescript
class FarcasterCastManager {
  // Manages periodic autonomous posts
  // Respects CAST_INTERVAL_MIN/MAX settings
  // Handles CAST_IMMEDIATELY flag
  
  async start()  // Begin autonomous casting
  async stop()   // Stop casting
  async publishCast(text: string)  // Manually publish
}
```

### FarcasterInteractionManager

Processes mentions, replies, and interactions:

```typescript
class FarcasterInteractionManager {
  // Polls for mentions at FARCASTER_POLL_INTERVAL
  // Processes up to MAX_ACTIONS_PROCESSING per cycle
  // Uses AI to determine appropriate responses
  
  async start()  // Start monitoring
  async stop()   // Stop monitoring
  async processInteractions()  // Process pending interactions
}
```

## Services

### FarcasterService

Main service coordinating all Farcaster operations:

```typescript
class FarcasterService extends Service {
  static serviceType = 'farcaster'
  
  // Service lifecycle
  async initialize(runtime: IAgentRuntime): Promise<void>
  static async start(runtime: IAgentRuntime): Promise<Service>
  static async stop(runtime: IAgentRuntime): Promise<void>
  
  // Get service instances
  getMessageService(agentId: UUID): FarcasterMessageService
  getCastService(agentId: UUID): FarcasterCastService
  getActiveManagers(): Map<UUID, FarcasterAgentManager>
  
  // Health check
  async healthCheck(): Promise<boolean>
}
```

### MessageService

Implements IMessageService for message operations:

```typescript
class FarcasterMessageService implements IMessageService {
  // Message retrieval
  async getMessages(options: GetMessagesOptions): Promise<Message[]>
  async getMessage(messageId: string): Promise<Message | null>
  
  // Message sending
  async sendMessage(options: {
    text: string,
    type: FarcasterMessageType,
    replyToId?: string
  }): Promise<Message>
}
```

### CastService

Implements IPostService with full CRUD operations:

```typescript
class FarcasterCastService implements IPostService {
  // Cast operations
  async getCasts(params: {
    agentId: UUID,
    limit?: number,
    cursor?: string
  }): Promise<FarcasterCast[]>
  
  async createCast(params: {
    text: string,
    media?: string[],
    replyTo?: { hash: string, fid: number }
  }): Promise<FarcasterCast>
  
  async deleteCast(castHash: string): Promise<void>
  
  // Engagement operations
  async likeCast(castHash: string): Promise<void>
  async unlikeCast(castHash: string): Promise<void>
  async recast(castHash: string): Promise<void>
  async unrecast(castHash: string): Promise<void>
  
  // Utility methods
  async publishCast(text: string): Promise<FarcasterCast>
  async getCastByHash(hash: string): Promise<Cast>
```