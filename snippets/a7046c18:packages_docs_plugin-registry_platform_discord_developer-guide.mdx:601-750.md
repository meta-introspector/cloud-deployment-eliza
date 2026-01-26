# a7046c18:packages_docs_plugin-registry_platform_discord_developer-guide.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/developer-guide.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Handle Discord API errors:

```typescript
async function handleDiscordAPIError(error: DiscordAPIError) {
  switch (error.code) {
    case 10008: // Unknown Message
      logger.debug('Message not found, may have been deleted');
      break;
    case 50001: // Missing Access
      logger.warn('Bot lacks access to channel');
      break;
    case 50013: // Missing Permissions
      logger.warn('Bot missing required permissions');
      break;
    default:
      logger.error('Discord API error:', error);
  }
}
```

## Integration Guide

### Basic Setup

```typescript
import { discordPlugin } from '@elizaos/plugin-discord';
import { AgentRuntime } from '@elizaos/core';

const runtime = new AgentRuntime({
  plugins: [discordPlugin],
  character: {
    name: "MyBot",
    clients: ["discord"],
    settings: {
      DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
      DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN
    }
  }
});

await runtime.start();
```

### Custom Actions

Add Discord-specific actions:

```typescript
const customDiscordAction: Action = {
  name: "DISCORD_CUSTOM",
  description: "Custom Discord action",
  
  async handler(runtime, message, state, options, callback) {
    // Access Discord-specific context
    const discordService = runtime.getService('discord') as DiscordService;
    const channel = await discordService.client.channels.fetch(message.channelId);
    
    // Perform Discord-specific operations
    if (channel?.type === ChannelType.GuildText) {
      await channel.setTopic('Updated by bot');
    }
    
    await callback({
      text: "Custom action completed"
    });
  }
};
```

### Event Handlers

Listen for Discord-specific events:

```typescript
runtime.on(DiscordEventTypes.GUILD_MEMBER_ADD, async (event) => {
  const { member, guild } = event;
  
  // Welcome new members
  const welcomeChannel = guild.channels.cache.find(
    ch => ch.name === 'welcome'
  );
  
  if (welcomeChannel?.type === ChannelType.GuildText) {
    await welcomeChannel.send(`Welcome ${member.user.username}!`);
  }
});
```

## Best Practices

1. **Token Security**
   ```typescript
   // Never hardcode tokens
   const token = process.env.DISCORD_API_TOKEN;
   if (!token) throw new Error('Discord token not configured');
   ```

2. **Error Recovery**
   ```typescript
   // Implement exponential backoff
   async function retryWithBackoff(fn: Function, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await sleep(Math.pow(2, i) * 1000);
       }
     }
   }
   ```

3. **Resource Cleanup**
   ```typescript
   // Clean up on shutdown
   process.on('SIGINT', async () => {
     await voiceManager.disconnectAll();
     client.destroy();
     process.exit(0);
   });
   ```

4. **Monitoring**
   ```typescript
   // Track performance metrics
   const metrics = {
     messagesProcessed: 0,
     averageResponseTime: 0,
     activeVoiceConnections: 0
   };
   ```

## Debugging

Enable debug logging:

```bash
DEBUG=eliza:discord:* npm run start
```

Common debug points:
- Connection establishment
- Message processing pipeline
- Voice connection state
- Permission checks
- API rate limits

## Support

```