# a7046c18:packages_docs_plugin-registry_platform_discord_developer-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/developer-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  private connections: Map<string, VoiceConnection>;
  
  async joinChannel(channel: VoiceChannel): Promise<void> {
    // Create voice connection
    // Set up audio processing
    // Handle connection events
  }
  
  async processAudioStream(stream: AudioStream): Promise<void> {
    // Process incoming audio
    // Send to transcription service
    // Handle transcribed text
  }
}
```

#### Voice Features:

1. **Connection Management**
   - Join/leave voice channels
   - Handle connection state changes
   - Manage multiple connections

2. **Audio Processing**
   - Capture audio streams
   - Process voice activity
   - Handle speaker changes

3. **Transcription Integration**
   - Send audio to transcription services
   - Process transcribed text
   - Generate responses

### Attachment Handler

Processes various types of Discord attachments:

```typescript
export async function processAttachments(
  attachments: Attachment[],
  runtime: IAgentRuntime
): Promise<Content[]> {
  const contents: Content[] = [];
  
  for (const attachment of attachments) {
    if (isImage(attachment)) {
      // Process image with vision model
      const description = await describeImage(attachment.url, runtime);
      contents.push({ type: 'image', description });
    } else if (isAudio(attachment)) {
      // Transcribe audio
      const transcript = await transcribeAudio(attachment.url, runtime);
      contents.push({ type: 'audio', transcript });
    }
  }
  
  return contents;
}
```

## Event Processing Flow

### 1. Guild Join Event

```typescript
client.on(Events.GuildCreate, async (guild: Guild) => {
  // Create server room
  await createGuildRoom(guild);
  
  // Emit WORLD_JOINED event
  runtime.emitEvent([DiscordEventTypes.GUILD_CREATE, EventType.WORLD_JOINED], {
    world: convertGuildToWorld(guild),
    runtime
  });
  
  // Register slash commands
  await registerCommands(guild);
});
```

### 2. Message Create Event

```typescript
client.on(Events.MessageCreate, async (message: DiscordMessage) => {
  // Check permissions and filters
  if (!shouldProcessMessage(message)) return;
  
  // Process through MessageManager
  await messageManager.handleMessage(message);
  
  // Track conversation context
  updateConversationContext(message);
});
```

### 3. Interaction Create Event

```typescript
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  // Route to appropriate handler
  const handler = commandHandlers.get(interaction.commandName);
  if (handler) {
    await handler(interaction, runtime);
  }
});
```

## Actions

### chatWithAttachments

Handles messages that include media attachments:

```typescript
export const chatWithAttachments: Action = {
  name: "CHAT_WITH_ATTACHMENTS",
  description: "Process and respond to messages with attachments",
  
  async handler(runtime, message, state, options, callback) {
    // Process attachments
    const processedContent = await processAttachments(
      message.attachments,
      runtime
    );
    
    // Generate response considering attachments
    const response = await generateResponse(
      message,
      processedContent,
      runtime
    );
    
    // Send response
    await callback(response);
  }
};
```

### joinVoice

Connects the bot to a voice channel:

```typescript
export const joinVoice: Action = {
  name: "JOIN_VOICE",
  description: "Join a voice channel",
  
  async handler(runtime, message, state, options, callback) {
```