# a7046c18:packages_docs_plugin-registry_platform_discord_event-flow.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/event-flow.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Event Flow"
description: "This document provides a comprehensive breakdown of how events flow through the Discord plugin system."
---

This document provides a comprehensive breakdown of how events flow through the Discord plugin system.

## Complete Event Flow Diagram

```mermaid
flowchart TD
    Start([Discord Event]) --> A[Discord.js Client]
    
    A --> B{Event Type}
    B -->|Message| C[MESSAGE_CREATE Event]
    B -->|Interaction| D[INTERACTION_CREATE Event]
    B -->|Guild Join| E[GUILD_CREATE Event]
    B -->|Member Join| F[GUILD_MEMBER_ADD Event]
    B -->|Voice State| G[VOICE_STATE_UPDATE Event]
    
    %% Message Flow
    C --> H{Is Bot Message?}
    H -->|Yes| End1[Ignore]
    H -->|No| I[Check Channel Restrictions]
    
    I --> J{Channel Allowed?}
    J -->|No| End2[Ignore]
    J -->|Yes| K[Message Manager]
    
    K --> L{Has Attachments?}
    L -->|Yes| M[Process Attachments]
    L -->|No| N[Convert to elizaOS Format]
    M --> N
    
    N --> O[Add Discord Context]
    O --> P[Send to Bootstrap Plugin]
    
    P --> Q[Bootstrap Processes]
    Q --> R[Generate Response]
    
    R --> S{Has Callback?}
    S -->|Yes| T[Format Discord Response]
    S -->|No| End3[No Response]
    
    T --> U{Response Type}
    U -->|Text| V[Send Text Message]
    U -->|Embed| W[Send Embed]
    U -->|Buttons| X[Send with Components]
    
    V --> Y[Message Sent]
    W --> Y
    X --> Y
    
    %% Interaction Flow
    D --> Z{Interaction Type}
    Z -->|Command| AA[Slash Command Handler]
    Z -->|Button| AB[Button Handler]
    Z -->|Select Menu| AC[Select Menu Handler]
    
    AA --> AD[Validate Permissions]
    AD --> AE[Execute Command]
    AE --> AF[Send Interaction Response]
    
    %% Guild Flow
    E --> AG[Register Slash Commands]
    AG --> AH[Create Server Context]
    AH --> AI[Emit WORLD_JOINED]
    AI --> AJ[Initialize Server Settings]
    
    %% Voice Flow
    G --> AK{Voice Event Type}
    AK -->|Join| AL[Handle Voice Join]
    AK -->|Leave| AM[Handle Voice Leave]
    AK -->|Speaking| AN[Handle Speaking State]
    
    AL --> AO[Create Voice Connection]
    AO --> AP[Setup Audio Processing]
    AP --> AQ[Start Recording]
    
    AN --> AR[Process Audio Stream]
    AR --> AS[Transcribe Audio]
    AS --> AT[Process as Message]
    AT --> K
```

## Detailed Event Flows

### 1. Message Processing Flow

```mermaid
sequenceDiagram
    participant D as Discord
    participant C as Client
    participant MM as MessageManager
    participant AH as AttachmentHandler
    participant B as Bootstrap Plugin
    participant R as Runtime
    
    D->>C: MESSAGE_CREATE event
    C->>C: Check if bot message
    alt Is bot message
        C->>D: Ignore
    else Not bot message
        C->>C: Check channel restrictions
        alt Channel not allowed
            C->>D: Ignore
        else Channel allowed
            C->>MM: handleMessage()
            MM->>MM: Convert to elizaOS format
            
            alt Has attachments
                MM->>AH: processAttachments()
                AH->>AH: Download media
                AH->>AH: Process (vision/transcribe)
                AH->>MM: Return processed content
            end
            
            MM->>B: Send message with callback
            B->>R: Process message
            R->>B: Generate response
            B->>MM: Execute callback
            MM->>D: Send Discord message
        end
    end
```

### 2. Voice Channel Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as Discord
    participant C as Client
    participant VM as VoiceManager
    participant VC as VoiceConnection
    participant T as Transcription
    
    U->>D: Join voice channel
    D->>C: VOICE_STATE_UPDATE
    C->>VM: handleVoiceStateUpdate()
    VM->>VC: Create connection
    VC->>D: Connect to channel
    
    loop While in channel
        U->>D: Speak
        D->>VC: Audio stream
        VC->>VM: Process audio
        VM->>T: Transcribe audio
        T->>VM: Return text
        VM->>C: Create message from transcript
```