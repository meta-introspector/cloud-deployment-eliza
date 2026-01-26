# a7046c18:packages_docs_plugin-registry_platform_telegram_developer-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/developer-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Message Handling

### Message Types

The plugin handles various Telegram message types:

```typescript
// Text messages
if (ctx.message?.text) {
  content.text = ctx.message.text;
}

// Media messages
if (ctx.message?.photo) {
  // Process photo with caption
  content.text = ctx.message.caption || '';
  content.attachments = await processPhoto(ctx.message.photo);
}

// Voice messages
if (ctx.message?.voice) {
  // Transcribe voice to text
  const transcript = await transcribeVoice(ctx.message.voice);
  content.text = transcript;
}

// Documents
if (ctx.message?.document) {
  // Process document
  content.attachments = await processDocument(ctx.message.document);
}
```

### Message Context

Each message maintains context about its origin:

```typescript
interface TelegramMessageContext {
  chatId: string;
  chatType: 'private' | 'group' | 'supergroup' | 'channel';
  messageId: number;
  userId: string;
  username?: string;
  threadId?: number;  // For forum topics
  replyToMessageId?: number;
}
```

### Message History

The plugin tracks conversation history:

```typescript
class MessageHistory {
  private history: Map<string, TelegramMessage[]> = new Map();
  private limit: number;
  
  addMessage(chatId: string, message: TelegramMessage) {
    const messages = this.history.get(chatId) || [];
    messages.push(message);
    
    // Maintain limit
    if (messages.length > this.limit) {
      messages.splice(0, messages.length - this.limit);
    }
    
    this.history.set(chatId, messages);
  }
  
  getHistory(chatId: string): TelegramMessage[] {
    return this.history.get(chatId) || [];
  }
}
```

## Media Processing

### Image Processing

```typescript
async function processPhoto(
  photos: PhotoSize[],
  bot: Telegraf,
  runtime: IAgentRuntime
): Promise<Attachment> {
  // Get highest resolution photo
  const photo = photos[photos.length - 1];
  
  // Get file info
  const file = await bot.telegram.getFile(photo.file_id);
  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  
  // Download and analyze
  const description = await analyzeImage(url, runtime);
  
  return {
    type: 'image',
    url,
    description,
    metadata: {
      fileId: photo.file_id,
      width: photo.width,
      height: photo.height
    }
  };
}
```

### Voice Transcription

```typescript
async function transcribeVoice(
  voice: Voice,
  bot: Telegraf,
  runtime: IAgentRuntime
): Promise<string> {
  // Get voice file
  const file = await bot.telegram.getFile(voice.file_id);
  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  
  // Download audio
  const audioBuffer = await downloadFile(url);
  
  // Transcribe using runtime's transcription service
  const transcript = await runtime.transcribe(audioBuffer, {
    mimeType: voice.mime_type || 'audio/ogg',
    duration: voice.duration
  });
  
  return transcript;
}
```

### Document Handling

```typescript
async function processDocument(
  document: Document,
  bot: Telegraf,
  runtime: IAgentRuntime
): Promise<Attachment> {
  const file = await bot.telegram.getFile(document.file_id);
  const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
  
  // Process based on MIME type
  if (document.mime_type?.startsWith('image/')) {
    return processImageDocument(document, url, runtime);
  } else if (document.mime_type?.startsWith('text/')) {
    return processTextDocument(document, url, runtime);
```