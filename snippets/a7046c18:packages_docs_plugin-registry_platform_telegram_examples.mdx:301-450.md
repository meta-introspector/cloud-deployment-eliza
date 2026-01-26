# a7046c18:packages_docs_plugin-registry_platform_telegram_examples.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/examples.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    return message.attachments?.some(att => att.type === 'document') ?? false;
  },
  
  handler: async (runtime, message, state, options, callback) => {
    const doc = message.attachments.find(att => att.type === 'document');
    
    if (doc) {
      let response = `📄 Received document: ${doc.name}\n`;
      response += `Type: ${doc.mimeType}\n`;
      response += `Size: ${formatFileSize(doc.size)}\n\n`;
      
      if (doc.mimeType?.startsWith('text/')) {
        response += "I can read text from this document. What would you like me to help you with?";
      } else if (doc.mimeType?.startsWith('image/')) {
        response += "This appears to be an image document. I can analyze it for you!";
      } else {
        response += "I've received the document. How can I assist you with it?";
      }
      
      await callback({ text: response });
    }
    
    return true;
  }
};

function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
```

## Group Management Bots

### Group Moderator Bot

Bot that helps moderate groups:

```typescript
const moderatorBot = {
  name: "GroupModerator",
  description: "Helps moderate Telegram groups",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    // Only work in specific groups
    shouldOnlyJoinInAllowedGroups: true,
    allowedGroupIds: ["-1001234567890", "-1009876543210"]
  }
};

const welcomeAction: Action = {
  name: "WELCOME_NEW_MEMBERS",
  description: "Welcome new group members",
  
  handler: async (runtime, message, state, options, callback) => {
    if (message.content.new_chat_members) {
      const names = message.content.new_chat_members
        .map(member => member.first_name)
        .join(', ');
      
      await callback({
        text: `Welcome to the group, ${names}! 👋\n\nPlease read our rules in the pinned message.`,
        buttons: [[
          { text: "📋 View Rules", url: "https://example.com/rules" }
        ]]
      });
    }
    
    return true;
  }
};
```

### Restricted Access Bot

Bot with access control:

```typescript
const restrictedBot = {
  name: "PrivateBot",
  description: "Bot with restricted access",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_ALLOWED_CHATS: JSON.stringify([
      "123456789",    // User ID
      "-987654321",   // Group ID
      "@channelname"  // Channel username
    ])
  }
};

// Additional access control action
const checkAccessAction: Action = {
  name: "CHECK_ACCESS",
  description: "Verify user access",
  
  handler: async (runtime, message, state, options, callback) => {
    const allowedUsers = ["user1", "user2", "admin"];
    const username = message.username;
    
    if (!allowedUsers.includes(username)) {
      await callback({
        text: "Sorry, you don't have access to this bot. Please contact an administrator."
      });
      return false;
    }
    
    return true;
  }
};
```

### Forum Topic Bot

Bot that handles forum topics:

```typescript
const forumBot = {
  name: "ForumAssistant",
  description: "Manages forum topics",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    messageTrackingLimit: 50 // Track last 50 messages per topic
  }
};

// Topic-aware action
const topicAction: Action = {
  name: "TOPIC_SUMMARY",
  description: "Summarize current topic",
  
  handler: async (runtime, message, state, options, callback) => {
    const topicId = message.threadId;
    
    if (topicId) {
      // Get topic-specific context
      const topicMessages = state.recentMessages?.filter(
        msg => msg.threadId === topicId
      );
      
      await callback({
        text: `📋 Topic Summary\n\nMessages in this topic: ${topicMessages?.length || 0}\n\nUse /help for topic-specific commands.`
```