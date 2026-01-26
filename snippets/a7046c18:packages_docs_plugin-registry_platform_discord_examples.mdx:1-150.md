# a7046c18:packages_docs_plugin-registry_platform_discord_examples.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/examples.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Examples"
description: "This document provides practical examples of using the @elizaos/plugin-discord package in various scenarios."
---

# Discord Plugin Examples

This document provides practical examples of using the @elizaos/plugin-discord package in various scenarios.

## Basic Bot Setup

### Simple Message Bot

Create a basic Discord bot that responds to messages:

```typescript
import { AgentRuntime } from '@elizaos/core';
import { discordPlugin } from '@elizaos/plugin-discord';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';

const character = {
  name: "SimpleBot",
  description: "A simple Discord bot",
  plugins: [bootstrapPlugin, discordPlugin],
  clients: ["discord"],
  settings: {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN
  },
  // Message examples for the bot's personality
  messageExamples: [
    {
      user: "user",
      content: { text: "Hello!" },
      response: { text: "Hello! How can I help you today?" }
    },
    {
      user: "user", 
      content: { text: "What can you do?" },
      response: { text: "I can chat with you, answer questions, and help with various tasks!" }
    }
  ]
};

// Create and start the runtime
const runtime = new AgentRuntime({ character });
await runtime.start();
```

### Channel-Restricted Bot

Limit the bot to specific channels:

```typescript
const channelRestrictedBot = {
  name: "RestrictedBot",
  description: "A bot that only works in specific channels",
  plugins: [bootstrapPlugin, discordPlugin],
  clients: ["discord"],
  settings: {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
    // Only respond in these channels
    CHANNEL_IDS: "123456789012345678,987654321098765432"
  }
};
```

## Voice Channel Bot

### Basic Voice Bot

Create a bot that can join voice channels:

```typescript
import { Action } from '@elizaos/core';

const voiceBot = {
  name: "VoiceAssistant",
  description: "A voice-enabled Discord bot",
  plugins: [bootstrapPlugin, discordPlugin],
  clients: ["discord"],
  settings: {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
    // Auto-join this voice channel on startup
    DISCORD_VOICE_CHANNEL_ID: process.env.DISCORD_VOICE_CHANNEL_ID
  }
};

// Custom action to join voice on command
const joinVoiceAction: Action = {
  name: "JOIN_VOICE_COMMAND",
  description: "Join the user's voice channel",
  similes: ["join voice", "come to voice", "join vc"],
  
  validate: async (runtime, message) => {
    // Check if user is in a voice channel
    const discordService = runtime.getService('discord');
    const member = await discordService.getMember(message.userId, message.serverId);
    return member?.voice?.channel != null;
  },
  
  handler: async (runtime, message, state, options, callback) => {
    const discordService = runtime.getService('discord');
    const member = await discordService.getMember(message.userId, message.serverId);
    
    if (member?.voice?.channel) {
      await discordService.voiceManager.joinChannel(member.voice.channel);
      await callback({
        text: `Joined ${member.voice.channel.name}!`
      });
    }
    
    return true;
  }
};
```

### Voice Transcription Bot

Bot that transcribes voice conversations:

```typescript
const transcriptionBot = {
  name: "TranscriptionBot",
  description: "Transcribes voice channel conversations",
  plugins: [bootstrapPlugin, discordPlugin],
  clients: ["discord"],
  settings: {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
    ENABLE_VOICE_TRANSCRIPTION: "true",
    VOICE_ACTIVITY_THRESHOLD: "0.5"
  },
  // Custom templates for voice interactions
  templates: {
    voiceMessageTemplate: `Respond to this voice message from {{user}}:
    
    Transcription: {{transcript}}
    
    Keep your response brief and conversational.`
  }
};

// Handle transcribed voice messages
runtime.on('VOICE_MESSAGE_RECEIVED', async (event) => {
  const { message, transcript } = event;
  console.log(`Voice message from ${message.userName}: ${transcript}`);
});
```