# a7046c18:packages_docs_plugin-registry_platform_telegram_examples.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/examples.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Examples"
description: "This document provides practical examples of using the @elizaos/plugin-telegram package in various scenarios."
---

# Telegram Plugin Examples

This document provides practical examples of using the @elizaos/plugin-telegram package in various scenarios.

## Basic Bot Setup

### Simple Message Bot

Create a basic Telegram bot that responds to messages:

```typescript
import { AgentRuntime } from '@elizaos/core';
import { telegramPlugin } from '@elizaos/plugin-telegram';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';

const character = {
  name: "SimpleTelegramBot",
  description: "A simple Telegram bot",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
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
      content: { text: "What's the weather?" },
      response: { text: "I'm sorry, I don't have access to weather data. Is there something else I can help you with?" }
    }
  ]
};

// Create and start the runtime
const runtime = new AgentRuntime({ character });
await runtime.start();

console.log('Telegram bot is running!');
```

### Echo Bot

A simple bot that echoes messages back:

```typescript
const echoBot = {
  name: "EchoBot",
  description: "Echoes messages back to users",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  },
  templates: {
    telegramMessageHandlerTemplate: `
      You are an echo bot. Simply repeat back what the user says.
      If they send media, describe what you received.
    `
  }
};
```

### FAQ Bot

Bot that answers frequently asked questions:

```typescript
const faqBot = {
  name: "FAQBot",
  description: "Answers frequently asked questions",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  },
  knowledge: [
    "Our business hours are 9 AM to 5 PM EST, Monday through Friday.",
    "Shipping typically takes 3-5 business days.",
    "We accept returns within 30 days of purchase.",
    "Customer support can be reached at support@example.com"
  ],
  templates: {
    telegramMessageHandlerTemplate: `
      You are a customer support FAQ bot. Answer questions based on the knowledge provided.
      If you don't know the answer, politely say so and suggest contacting support.
    `
  }
};
```

## Interactive Button Bots

### Button Menu Bot

Create a bot with interactive button menus:

```typescript
import { Action } from '@elizaos/core';

const menuAction: Action = {
  name: "SHOW_MENU",
  description: "Shows the main menu",
  similes: ["menu", "help", "start", "options"],
  
  handler: async (runtime, message, state, options, callback) => {
    await callback({
      text: "What would you like to do?",
      buttons: [
        [
          { text: "📊 View Stats", callback_data: "view_stats" },
          { text: "⚙️ Settings", callback_data: "settings" }
        ],
        [
          { text: "📚 Help", callback_data: "help" },
          { text: "ℹ️ About", callback_data: "about" }
        ]
      ]
    });
    
    return true;
  }
};

const buttonBot = {
  name: "MenuBot",
  description: "Bot with interactive menus",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  actions: [menuAction],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  }
};
```

### Inline Keyboard Bot

Bot with inline URL buttons:

```typescript
```