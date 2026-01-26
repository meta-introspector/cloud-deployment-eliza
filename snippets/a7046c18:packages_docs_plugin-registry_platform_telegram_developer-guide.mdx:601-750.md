# a7046c18:packages_docs_plugin-registry_platform_telegram_developer-guide.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/developer-guide.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
// - Commands
```

## Forum Topics

### Topic Detection

Identify and handle forum topics:

```typescript
function getTopicId(ctx: Context): number | undefined {
  // Forum messages have thread_id
  return ctx.message?.message_thread_id;
}

function getRoomId(ctx: Context): string {
  const chatId = ctx.chat.id;
  const topicId = getTopicId(ctx);
  
  if (topicId) {
    // Treat topic as separate room
    return `${chatId}-topic-${topicId}`;
  }
  
  return chatId.toString();
}
```

### Topic Context

Maintain separate context per topic:

```typescript
class TopicManager {
  private topicContexts: Map<string, TopicContext> = new Map();
  
  getContext(chatId: string, topicId?: number): TopicContext {
    const key = topicId ? `${chatId}-${topicId}` : chatId;
    
    if (!this.topicContexts.has(key)) {
      this.topicContexts.set(key, {
        messages: [],
        metadata: {},
        lastActivity: Date.now()
      });
    }
    
    return this.topicContexts.get(key)!;
  }
}
```

## Error Handling

### API Errors

Handle Telegram API errors:

```typescript
async function handleTelegramError(error: any) {
  if (error.response?.error_code === 429) {
    // Rate limited
    const retryAfter = error.response.parameters?.retry_after || 60;
    logger.warn(`Rate limited, retry after ${retryAfter}s`);
    await sleep(retryAfter * 1000);
    return true; // Retry
  }
  
  if (error.response?.error_code === 400) {
    // Bad request
    logger.error('Bad request:', error.response.description);
    return false; // Don't retry
  }
  
  // Network error
  if (error.code === 'ETIMEOUT' || error.code === 'ECONNREFUSED') {
    logger.error('Network error:', error.message);
    return true; // Retry
  }
  
  return false;
}
```

### Multi-Agent Environment

Handle bot token conflicts:

```typescript
// Error: 409 Conflict
// Only one getUpdates request allowed per bot token

// Solution 1: Use different tokens
const bot1 = new Telegraf(process.env.BOT1_TOKEN);
const bot2 = new Telegraf(process.env.BOT2_TOKEN);

// Solution 2: Use webhooks instead of polling
bot.telegram.setWebhook('https://your-domain.com/bot-webhook');

// Solution 3: Single bot, multiple personalities
const multiPersonalityBot = new Telegraf(token);
multiPersonalityBot.use(async (ctx, next) => {
  // Route to different agents based on context
  const agent = selectAgent(ctx);
  await agent.handleUpdate(ctx);
});
```

### Connection Management

Handle connection issues:

```typescript
class ConnectionManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  async connect() {
    try {
      await this.bot.launch();
      this.reconnectAttempts = 0;
    } catch (error) {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        logger.warn(`Reconnecting in ${delay}ms...`);
        await sleep(delay);
        return this.connect();
      }
      throw error;
    }
  }
}
```

## Integration Guide

### Basic Setup

```typescript
import { telegramPlugin } from '@elizaos/plugin-telegram';
import { AgentRuntime } from '@elizaos/core';

const runtime = new AgentRuntime({
  plugins: [telegramPlugin],
  character: {
    name: "TelegramBot",
    clients: ["telegram"],
    settings: {
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
```