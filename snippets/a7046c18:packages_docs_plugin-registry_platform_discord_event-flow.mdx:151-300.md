# a7046c18:packages_docs_plugin-registry_platform_discord_event-flow.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/event-flow.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        C->>C: Process as text message
    end
    
    U->>D: Leave channel
    D->>C: VOICE_STATE_UPDATE
    C->>VM: handleVoiceStateUpdate()
    VM->>VC: Disconnect
    VM->>VM: Cleanup resources
```

### 3. Slash Command Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as Discord
    participant C as Client
    participant CH as CommandHandler
    participant A as Action
    participant R as Runtime
    
    U->>D: /command input
    D->>C: INTERACTION_CREATE
    C->>C: Check interaction type
    C->>CH: Route to handler
    
    CH->>CH: Validate permissions
    alt No permission
        CH->>D: Error response
    else Has permission
        CH->>CH: Parse arguments
        CH->>A: Execute action
        A->>R: Process with runtime
        R->>A: Return result
        A->>CH: Action complete
        CH->>D: Send response
        
        alt Needs follow-up
            CH->>D: Send follow-up
        end
    end
```

### 4. Attachment Processing Flow

```mermaid
flowchart TD
    A[Attachment Received] --> B{Attachment Type}
    
    B -->|Image| C[Image Handler]
    B -->|Audio| D[Audio Handler]
    B -->|Video| E[Video Handler]
    B -->|Document| F[Document Handler]
    B -->|Other| G[Generic Handler]
    
    C --> H[Download Image]
    H --> I[Check Image Size]
    I --> J{Size OK?}
    J -->|No| K[Resize Image]
    J -->|Yes| L[Send to Vision Model]
    K --> L
    L --> M[Generate Description]
    
    D --> N[Download Audio]
    N --> O[Convert Format if Needed]
    O --> P[Send to Transcription]
    P --> Q[Return Transcript]
    
    E --> R[Download Video]
    R --> S[Extract Audio Track]
    S --> P
    
    F --> T[Download Document]
    T --> U[Extract Text Content]
    
    M --> V[Add to Message Context]
    Q --> V
    U --> V
    G --> V
    
    V --> W[Continue Processing]
```

### 5. Multi-Server Event Flow

```mermaid
flowchart TD
    A[Bot Joins Server] --> B[GUILD_CREATE Event]
    B --> C[Create Server Context]
    
    C --> D[Initialize Components]
    D --> E[Message Context Map]
    D --> F[Voice Connection Pool]
    D --> G[User Relationship Map]
    D --> H[Server Settings]
    
    B --> I[Register Commands]
    I --> J[Guild-Specific Commands]
    I --> K[Global Commands]
    
    B --> L[Emit WORLD_JOINED]
    L --> M[Create World Entity]
    L --> N[Create Room Entities]
    L --> O[Create User Entities]
    
    P[Server Events] --> Q{Event Type}
    Q -->|Message| R[Route to Server Context]
    Q -->|Voice| S[Server Voice Manager]
    Q -->|Member| T[Update Relationships]
    
    R --> U[Process with Context]
    S --> V[Manage Connection]
    T --> W[Update Entity]
```

## Event Type Reference

### Discord.js Events

| Event | Description | Plugin Handler |
|-------|-------------|----------------|
| `ready` | Client is ready | Initialize services |
| `messageCreate` | New message | MessageManager |
| `messageUpdate` | Message edited | MessageManager |
| `messageDelete` | Message deleted | Cleanup handler |
| `interactionCreate` | Slash command/button | Interaction router |
| `guildCreate` | Bot joins server | Server initializer |
| `guildDelete` | Bot leaves server | Cleanup handler |
| `guildMemberAdd` | Member joins | Relationship manager |
| `voiceStateUpdate` | Voice state change | VoiceManager |
| `error` | Client error | Error handler |
| `disconnect` | Lost connection | Reconnection handler |

### elizaOS Events Emitted

| Event | When Emitted | Payload |
|-------|--------------|---------|
| `WORLD_JOINED` | Bot joins server | World, rooms, entities |
| `MESSAGE_RECEIVED` | Message processed | elizaOS message format |
| `VOICE_MESSAGE_RECEIVED` | Voice transcribed | Transcribed message |
| `REACTION_RECEIVED` | Reaction added | Reaction details |
| `INTERACTION_RECEIVED` | Slash command used | Interaction data |

## State Management

### Message Context

```typescript
interface MessageContext {
  channelId: string;
```