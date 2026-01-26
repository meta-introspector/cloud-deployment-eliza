# a7046c18:packages_docs_plugin-registry_platform_telegram_developer-guide.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/developer-guide.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }
  
  // Generic document
  return {
    type: 'document',
    url,
    name: document.file_name,
    mimeType: document.mime_type
  };
}
```

## Interactive Elements

### Inline Keyboards

Create interactive button layouts:

```typescript
// Simple button layout
const keyboard = {
  inline_keyboard: [[
    { text: "Option 1", callback_data: "opt_1" },
    { text: "Option 2", callback_data: "opt_2" }
  ], [
    { text: "Cancel", callback_data: "cancel" }
  ]]
};

// URL buttons
const urlKeyboard = {
  inline_keyboard: [[
    { text: "Visit Website", url: "https://example.com" },
    { text: "Documentation", url: "https://docs.example.com" }
  ]]
};

// Mixed buttons
const mixedKeyboard = {
  inline_keyboard: [[
    { text: "Action", callback_data: "action" },
    { text: "Learn More", url: "https://example.com" }
  ]]
};
```

### Callback Handling

Process button clicks:

```typescript
bot.on('callback_query', async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  
  // Answer callback to remove loading state
  await ctx.answerCbQuery();
  
  // Process based on callback data
  switch (callbackData) {
    case 'opt_1':
      await ctx.editMessageText('You selected Option 1');
      break;
    case 'opt_2':
      await ctx.editMessageText('You selected Option 2');
      break;
    case 'cancel':
      await ctx.deleteMessage();
      break;
  }
});
```

### Reply Keyboards

Create custom keyboard layouts:

```typescript
const replyKeyboard = {
  keyboard: [
    ['Button 1', 'Button 2'],
    ['Button 3', 'Button 4'],
    ['Cancel']
  ],
  resize_keyboard: true,
  one_time_keyboard: true
};

await ctx.reply('Choose an option:', {
  reply_markup: replyKeyboard
});
```

## Group Management

### Access Control

Restrict bot to specific groups:

```typescript
function checkGroupAccess(ctx: Context): boolean {
  if (!this.runtime.character.shouldOnlyJoinInAllowedGroups) {
    return true;
  }
  
  const allowedGroups = this.runtime.character.allowedGroupIds || [];
  const chatId = ctx.chat?.id.toString();
  
  return allowedGroups.includes(chatId);
}
```

### Group Features

Handle group-specific functionality:

```typescript
// Check if bot is admin
async function isBotAdmin(ctx: Context): Promise<boolean> {
  const botId = ctx.botInfo.id;
  const member = await ctx.getChatMember(botId);
  
  return member.status === 'administrator' || member.status === 'creator';
}

// Get group info
async function getGroupInfo(ctx: Context) {
  const chat = await ctx.getChat();
  
  return {
    id: chat.id,
    title: chat.title,
    type: chat.type,
    memberCount: await ctx.getChatMembersCount(),
    description: chat.description
  };
}
```

### Privacy Mode

Handle bot privacy settings:

```typescript
// With privacy mode disabled (recommended)
// Bot receives all messages in groups

// With privacy mode enabled
// Bot only receives:
// - Messages that mention the bot
// - Replies to bot's messages
```