# a7046c18:packages_docs_plugin-registry_platform_farcaster_developer-guide.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/developer-guide.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Developer Guide"
description: "Comprehensive technical reference for the @elizaos/plugin-farcaster package"
---

# Farcaster Plugin Developer Guide

## Overview

The @elizaos/plugin-farcaster plugin enables elizaOS agents to interact with the Farcaster protocol through the Neynar API. This plugin provides comprehensive functionality for casting, replying, and engaging with the Farcaster ecosystem.

## Core Features

### 1. Casting Capabilities
- **Autonomous Casting**: Post original casts based on agent personality
- **Threaded Conversations**: Support for reply chains and threads
- **Media Support**: Embed images, links, and frames in casts
- **Scheduled Posting**: Time-based cast scheduling

### 2. Engagement Features
- **Reply Detection**: Monitor and respond to mentions and replies
- **Like/Recast**: Programmatic engagement with other casts
- **Follow Management**: Automatic follow/unfollow based on criteria
- **Channel Support**: Post to specific channels (e.g., /elizaos)

### 3. Hub Integration
- **Hub API**: Direct integration with Farcaster hubs
- **Message Validation**: Cryptographic message signing
- **Protocol Compliance**: Full Farcaster protocol v2 support

## Installation

```bash
# Using bun
bun add @elizaos/plugin-farcaster

# Using npm
npm install @elizaos/plugin-farcaster

# Using pnpm
pnpm add @elizaos/plugin-farcaster
```

## Configuration

### Environment Variables

```env
# Required
FARCASTER_NEYNAR_API_KEY=your-neynar-api-key
FARCASTER_SIGNER_UUID=your-signer-uuid
FARCASTER_FID=12345

# Feature Toggles
ENABLE_CAST=true
ENABLE_ACTION_PROCESSING=false
FARCASTER_DRY_RUN=false

# Timing Configuration (in minutes)
CAST_INTERVAL_MIN=90
CAST_INTERVAL_MAX=180
FARCASTER_POLL_INTERVAL=2
ACTION_INTERVAL=5

# Other Options
CAST_IMMEDIATELY=false
ACTION_TIMELINE_TYPE=ForYou
MAX_ACTIONS_PROCESSING=1
MAX_CAST_LENGTH=320
```

### Character Configuration

```typescript
import { Character } from "@elizaos/core";
import { farcasterPlugin } from "@elizaos/plugin-farcaster";

export const character: Character = {
  name: "FarcasterAgent",
  plugins: [farcasterPlugin],
  settings: {
    farcaster: {
      channels: ["/elizaos", "/ai16z"],
      replyProbability: 0.7,
      castStyle: "conversational",
      maxCastLength: 320
    }
  }
};
```

## Actions

### SEND_CAST

Posts a new cast to Farcaster.

```typescript
{
  name: "SEND_CAST",
  description: "Posts a cast (message) on Farcaster",
  examples: [
    "Can you post about the new ElizaOS features on Farcaster?",
    "Share on Farcaster that we just launched version 2.0!"
  ]
}
```

### REPLY_TO_CAST

Reply to an existing cast.

```typescript
{
  name: "REPLY_TO_CAST",
  description: "Replies to a cast on Farcaster",
  examples: [
    "Someone asked about ElizaOS on Farcaster, can you reply?",
    "Reply to that cast and thank them for the feedback"
  ]
}
```

## Providers

### farcasterProfile

Provides the agent's Farcaster profile information.

```typescript
// Provider name: 'farcasterProfile'
const profile = await runtime.providers.farcasterProfile.get(runtime, message, state);
// Returns profile data including FID, username, bio, etc.
```

### farcasterTimeline

Supplies recent timeline casts for context.

```typescript
// Provider name: 'farcasterTimeline'
const timeline = await runtime.providers.farcasterTimeline.get(runtime, message, state);
// Returns recent casts from the agent's timeline
```

## Events

### handleCastSent

Triggered when a cast is successfully sent. Stores metadata for tracking:
```