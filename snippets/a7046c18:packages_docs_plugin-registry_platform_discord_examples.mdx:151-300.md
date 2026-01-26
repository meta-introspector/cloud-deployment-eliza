# a7046c18:packages_docs_plugin-registry_platform_discord_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

## Slash Command Bot

### Basic Slash Commands

Implement Discord slash commands:

```typescript
import { SlashCommandBuilder } from 'discord.js';

const slashCommandBot = {
  name: "CommandBot",
  description: "Bot with slash commands",
  plugins: [bootstrapPlugin, discordPlugin],
  clients: ["discord"],
  settings: {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN
  }
};

// Custom slash command registration
runtime.on('DISCORD_READY', async (event) => {
  const { client } = event;
  
  const commands = [
    new SlashCommandBuilder()
      .setName('ask')
      .setDescription('Ask the bot a question')
      .addStringOption(option =>
        option.setName('question')
          .setDescription('Your question')
          .setRequired(true)
      ),
    
    new SlashCommandBuilder()
      .setName('summarize')
      .setDescription('Summarize recent conversation')
      .addIntegerOption(option =>
        option.setName('messages')
          .setDescription('Number of messages to summarize')
          .setMinValue(5)
          .setMaxValue(50)
          .setRequired(false)
      )
  ];
  
  // Register commands globally
  await client.application.commands.set(commands);
});
```

### Advanced Command Handling

Handle complex slash command interactions:

```typescript
const advancedCommandAction: Action = {
  name: "HANDLE_SLASH_COMMAND",
  description: "Process slash command interactions",
  
  handler: async (runtime, message, state, options, callback) => {
    const { commandName, options: cmdOptions } = message.content;
    
    switch (commandName) {
      case 'ask':
        const question = cmdOptions.getString('question');
        // Process question through the agent
        const response = await runtime.processMessage({
          ...message,
          content: { text: question }
        });
        await callback(response);
        break;
        
      case 'summarize':
        const count = cmdOptions.getInteger('messages') || 20;
        const summary = await summarizeConversation(runtime, message.channelId, count);
        await callback({
          text: `Summary of last ${count} messages:\n\n${summary}`
        });
        break;
        
      case 'settings':
        // Show interactive settings menu
        await callback({
          text: "Bot Settings",
          components: [{
            type: 'ACTION_ROW',
            components: [{
              type: 'SELECT_MENU',
              customId: 'settings_menu',
              placeholder: 'Choose a setting',
              options: [
                { label: 'Response Style', value: 'style' },
                { label: 'Language', value: 'language' },
                { label: 'Notifications', value: 'notifications' }
              ]
            }]
          }]
        });
        break;
    }
    
    return true;
  }
};
```

## Image Analysis Bot

### Vision-Enabled Bot

Bot that can analyze images:

```typescript
const imageAnalysisBot = {
  name: "VisionBot",
  description: "Analyzes images using vision capabilities",
  plugins: [bootstrapPlugin, discordPlugin],
  clients: ["discord"],
  modelProvider: "openai",
  settings: {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
};

// Custom image analysis action
const analyzeImageAction: Action = {
  name: "ANALYZE_IMAGE",
  description: "Analyze attached images",
  
  validate: async (runtime, message) => {
    return message.attachments?.some(att => 
      att.contentType?.startsWith('image/')
    ) ?? false;
  },
  
  handler: async (runtime, message, state, options, callback) => {
    const imageAttachment = message.attachments.find(att =>
      att.contentType?.startsWith('image/')
    );
    
    if (imageAttachment) {
      // The Discord plugin automatically processes images
      // and adds descriptions to the message content
      const description = imageAttachment.description;
```