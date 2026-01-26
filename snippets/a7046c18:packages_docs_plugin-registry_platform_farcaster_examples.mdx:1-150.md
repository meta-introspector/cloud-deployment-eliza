# a7046c18:packages_docs_plugin-registry_platform_farcaster_examples.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster/examples.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Examples"
description: "Practical implementation examples for the @elizaos/plugin-farcaster package"
---

# Farcaster Plugin Examples

## Basic Setup

### Minimal Configuration

```typescript
// character.ts
import { Character } from "@elizaos/core";
import { farcasterPlugin } from "@elizaos/plugin-farcaster";

export const character: Character = {
  name: "MyFarcasterAgent",
  plugins: [farcasterPlugin],
  bio: "An AI agent exploring the Farcaster ecosystem",
  description: "I engage thoughtfully with the Farcaster community"
};
```

### Environment Configuration

```env
# .env file
FARCASTER_NEYNAR_API_KEY=your-neynar-api-key
FARCASTER_SIGNER_UUID=your-signer-uuid
FARCASTER_FID=12345
ENABLE_CAST=true
ENABLE_ACTION_PROCESSING=false
FARCASTER_DRY_RUN=false
```

## Casting Examples

### Simple Cast

```typescript
// Post a simple cast
import { runtime } from "@elizaos/core";

async function postSimpleCast() {
  const action = runtime.getAction("SEND_CAST");
  
  await action.handler(runtime, {
    text: "Hello Farcaster! Excited to be here 🎉"
  });
}
```

### Cast with Channel

```typescript
// Post to a specific channel
async function postToChannel() {
  const action = runtime.getAction("SEND_CAST");
  
  await action.handler(runtime, {
    text: "Building with elizaOS is amazing!",
    channel: "/elizaos"
  });
}
```

### Cast with Embeds

```typescript
// Post with embedded content
async function postWithEmbed() {
  const action = runtime.getAction("SEND_CAST");
  
  await action.handler(runtime, {
    text: "Check out this awesome project!",
    embeds: [
      { url: "https://github.com/elizaos/elizaos" }
    ]
  });
}
```

### Thread Creation

```typescript
// Create a thread of casts
async function createThread() {
  const action = runtime.getAction("SEND_CAST");
  
  // First cast
  const firstCast = await action.handler(runtime, {
    text: "Let me explain how elizaOS agents work 🧵"
  });
  
  // Reply to create thread
  const replyAction = runtime.getAction("REPLY_TO_CAST");
  
  await replyAction.handler(runtime, {
    text: "1/ Agents are autonomous entities that can interact across platforms",
    targetCastHash: firstCast.hash,
    targetFid: firstCast.fid
  });
  
  await replyAction.handler(runtime, {
    text: "2/ They use LLMs for natural language understanding and generation",
    targetCastHash: firstCast.hash,
    targetFid: firstCast.fid
  });
}
```

## Reply Examples

### Simple Reply

```typescript
// Reply to a cast
async function replyToCast(castHash: string, authorFid: number) {
  const action = runtime.getAction("REPLY_TO_CAST");
  
  await action.handler(runtime, {
    text: "Great point! I completely agree with this perspective.",
    targetCastHash: castHash,
    targetFid: authorFid
  });
}
```

### Contextual Reply

```typescript
// Reply with context awareness
async function contextualReply(cast: Cast) {
  const context = await buildContext(cast);
  const response = await generateResponse(context);
  
  const action = runtime.getAction("REPLY_TO_CAST");
  
  await action.handler(runtime, {
    text: response,
    targetCastHash: cast.hash,
    targetFid: cast.author.fid
  });
}

async function buildContext(cast: Cast) {
  // Get thread history
  const thread = await getThreadHistory(cast);
  
```