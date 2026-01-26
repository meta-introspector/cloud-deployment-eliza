# a7046c18:packages_docs_plugin-registry_platform_discord_developer-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/developer-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const channelId = options.channelId || message.channelId;
    const channel = await client.channels.fetch(channelId);
    
    if (channel?.type === ChannelType.GuildVoice) {
      await voiceManager.joinChannel(channel);
      await callback({
        text: `Joined voice channel: ${channel.name}`
      });
    }
  }
};
```

### transcribeMedia

Transcribes audio or video files:

```typescript
export const transcribeMedia: Action = {
  name: "TRANSCRIBE_MEDIA",
  description: "Convert audio/video to text",
  
  async handler(runtime, message, state, options, callback) {
    const mediaUrl = options.url || message.attachments?.[0]?.url;
    
    if (mediaUrl) {
      const transcript = await transcribeAudio(mediaUrl, runtime);
      await callback({
        text: `Transcript: ${transcript}`
      });
    }
  }
};
```

## Providers

### channelStateProvider

Provides current Discord channel context:

```typescript
export const channelStateProvider: Provider = {
  name: "CHANNEL_STATE",
  description: "Current Discord channel information",
  
  async get(runtime, message, state) {
    const channelId = message.channelId;
    const channel = await client.channels.fetch(channelId);
    
    return {
      channelId,
      channelName: channel?.name,
      channelType: channel?.type,
      guildId: channel?.guild?.id,
      guildName: channel?.guild?.name,
      memberCount: channel?.guild?.memberCount
    };
  }
};
```

### voiceStateProvider

Provides voice channel state information:

```typescript
export const voiceStateProvider: Provider = {
  name: "VOICE_STATE",
  description: "Voice channel state and members",
  
  async get(runtime, message, state) {
    const voiceChannel = getCurrentVoiceChannel(message.serverId);
    
    if (!voiceChannel) return null;
    
    return {
      channelId: voiceChannel.id,
      channelName: voiceChannel.name,
      members: voiceChannel.members.map(m => ({
        id: m.id,
        name: m.displayName,
        speaking: m.voice.speaking
      })),
      connection: {
        state: voiceConnection?.state,
        ping: voiceConnection?.ping
      }
    };
  }
};
```

## Configuration

### Environment Variables

```bash
# Required
DISCORD_APPLICATION_ID=123456789012345678
DISCORD_API_TOKEN=your-bot-token-here

# Optional Channel Restrictions
CHANNEL_IDS=123456789012345678,987654321098765432

# Voice Configuration
DISCORD_VOICE_CHANNEL_ID=123456789012345678
VOICE_ACTIVITY_THRESHOLD=0.5

# Testing
DISCORD_TEST_CHANNEL_ID=123456789012345678
```

### Bot Permissions

Required Discord permissions:

```typescript
const requiredPermissions = new PermissionsBitField([
  // Text Permissions
  PermissionsBitField.Flags.ViewChannel,
  PermissionsBitField.Flags.SendMessages,
  PermissionsBitField.Flags.SendMessagesInThreads,
  PermissionsBitField.Flags.CreatePublicThreads,
  PermissionsBitField.Flags.CreatePrivateThreads,
  PermissionsBitField.Flags.EmbedLinks,
  PermissionsBitField.Flags.AttachFiles,
  PermissionsBitField.Flags.ReadMessageHistory,
  PermissionsBitField.Flags.AddReactions,
  PermissionsBitField.Flags.UseExternalEmojis,
  
  // Voice Permissions
  PermissionsBitField.Flags.Connect,
  PermissionsBitField.Flags.Speak,
  PermissionsBitField.Flags.UseVAD,
  
  // Application Commands
  PermissionsBitField.Flags.UseApplicationCommands
]);
```

### Bot Invitation

Generate an invitation URL:

```typescript
const inviteUrl = `https://discord.com/api/oauth2/authorize?` +
  `client_id=${DISCORD_APPLICATION_ID}` +
  `&permissions=${requiredPermissions.bitfield}` +
  `&scope=bot%20applications.commands`;
```