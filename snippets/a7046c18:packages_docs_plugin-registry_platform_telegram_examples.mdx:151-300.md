# a7046c18:packages_docs_plugin-registry_platform_telegram_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
const linkAction: Action = {
  name: "SHARE_LINKS",
  description: "Share useful links",
  similes: ["links", "resources", "websites"],
  
  handler: async (runtime, message, state, options, callback) => {
    await callback({
      text: "Here are some useful resources:",
      buttons: [
        [
          { text: "📖 Documentation", url: "https://docs.example.com" },
          { text: "💬 Community", url: "https://discord.gg/example" }
        ],
        [
          { text: "🐙 GitHub", url: "https://github.com/example" },
          { text: "🐦 Twitter", url: "https://twitter.com/example" }
        ]
      ]
    });
    
    return true;
  }
};
```

### Callback Handler

Handle button callbacks:

```typescript
const callbackAction: Action = {
  name: "HANDLE_CALLBACK",
  description: "Handles button callbacks",
  
  handler: async (runtime, message, state, options, callback) => {
    const callbackData = message.content.callback_data;
    
    switch (callbackData) {
      case "view_stats":
        await callback({
          text: "📊 *Your Stats*\n\nMessages sent: 42\nActive days: 7\nPoints: 128"
        });
        break;
        
      case "settings":
        await callback({
          text: "⚙️ *Settings*",
          buttons: [
            [
              { text: "🔔 Notifications", callback_data: "toggle_notifications" },
              { text: "🌐 Language", callback_data: "change_language" }
            ],
            [
              { text: "⬅️ Back", callback_data: "main_menu" }
            ]
          ]
        });
        break;
        
      case "help":
        await callback({
          text: "📚 *Help*\n\nHere's how to use this bot:\n\n/start - Show main menu\n/help - Show this help\n/stats - View your statistics"
        });
        break;
    }
    
    return true;
  }
};
```

## Media Processing Bots

### Image Analysis Bot

Bot that analyzes images using vision capabilities:

```typescript
const imageAnalysisBot = {
  name: "ImageAnalyzer",
  description: "Analyzes images sent by users",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  modelProvider: "openai",
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
};

// The plugin automatically processes images and adds descriptions
// You can create custom actions to enhance this:

const analyzeImageAction: Action = {
  name: "ANALYZE_IMAGE_DETAILS",
  description: "Provide detailed image analysis",
  
  validate: async (runtime, message) => {
    return message.attachments?.some(att => att.type === 'image') ?? false;
  },
  
  handler: async (runtime, message, state, options, callback) => {
    const imageAttachment = message.attachments.find(att => att.type === 'image');
    
    if (imageAttachment && imageAttachment.description) {
      await callback({
        text: `🖼️ *Image Analysis*\n\n${imageAttachment.description}\n\nWhat would you like to know about this image?`
      });
    }
    
    return true;
  }
};
```

### Voice Transcription Bot

Bot that transcribes voice messages:

```typescript
const voiceBot = {
  name: "VoiceTranscriber",
  description: "Transcribes voice messages",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  },
  templates: {
    telegramMessageHandlerTemplate: `
      When you receive a voice message transcript, acknowledge it and offer to help
      with any questions about the content.
    `
  }
};

// Voice messages are automatically transcribed by the plugin
// The transcript appears as regular text in message.content.text
```

### Document Processor

Bot that processes various document types:

```typescript
const documentAction: Action = {
  name: "PROCESS_DOCUMENT",
  description: "Process uploaded documents",
  
  validate: async (runtime, message) => {
```