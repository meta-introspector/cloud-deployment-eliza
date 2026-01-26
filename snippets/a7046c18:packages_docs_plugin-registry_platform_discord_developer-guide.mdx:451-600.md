# a7046c18:packages_docs_plugin-registry_platform_discord_developer-guide.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/developer-guide.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Multi-Server Architecture

The plugin supports operating across multiple Discord servers simultaneously:

### Server Isolation

Each server maintains its own:
- Conversation context
- User relationships
- Channel states
- Voice connections

```typescript
// Server-specific context
const serverContext = new Map<string, ServerContext>();

interface ServerContext {
  guildId: string;
  conversations: Map<string, Conversation>;
  voiceConnection?: VoiceConnection;
  settings: ServerSettings;
}
```

### Command Registration

Slash commands are registered per-server:

```typescript
async function registerServerCommands(guild: Guild) {
  const commands = [
    {
      name: 'chat',
      description: 'Chat with the bot',
      options: [{
        name: 'message',
        type: ApplicationCommandOptionType.String,
        description: 'Your message',
        required: true
      }]
    }
  ];
  
  await guild.commands.set(commands);
}
```

## Permission Management

### Permission Checking

Before performing actions:

```typescript
function checkPermissions(
  channel: GuildChannel,
  permissions: PermissionsBitField
): boolean {
  const botMember = channel.guild.members.me;
  if (!botMember) return false;
  
  const channelPerms = channel.permissionsFor(botMember);
  return channelPerms?.has(permissions) ?? false;
}
```

### Error Handling

Handle permission errors gracefully:

```typescript
try {
  await channel.send(response);
} catch (error) {
  if (error.code === 50013) { // Missing Permissions
    logger.warn(`Missing permissions in channel ${channel.id}`);
    // Try to notify in a channel where we have permissions
    await notifyPermissionError(channel.guild);
  }
}
```

## Performance Optimization

### Message Caching

Cache frequently accessed data:

```typescript
const messageCache = new LRUCache<string, ProcessedMessage>({
  max: 1000,
  ttl: 1000 * 60 * 60 // 1 hour
});
```

### Rate Limiting

Implement rate limiting for API calls:

```typescript
const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  max: 30 // 30 requests per minute
});
```

### Voice Connection Pooling

Reuse voice connections:

```typescript
const voiceConnectionPool = new Map<string, VoiceConnection>();

async function getOrCreateVoiceConnection(
  channel: VoiceChannel
): Promise<VoiceConnection> {
  const existing = voiceConnectionPool.get(channel.guild.id);
  if (existing?.state.status === VoiceConnectionStatus.Ready) {
    return existing;
  }
  
  const connection = await createNewConnection(channel);
  voiceConnectionPool.set(channel.guild.id, connection);
  return connection;
}
```

## Error Handling

### Connection Errors

Handle Discord connection issues:

```typescript
client.on('error', (error) => {
  logger.error('Discord client error:', error);
  // Attempt reconnection
  scheduleReconnection();
});

client.on('disconnect', () => {
  logger.warn('Discord client disconnected');
  // Clean up resources
  cleanupConnections();
});
```

### API Errors
```