# a7046c18:packages_docs_plugin-registry_platform_telegram_developer-guide.mdx:751-860

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/developer-guide.mdx:751-860
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }
  }
});

await runtime.start();
```

### Custom Message Handler

Override default message handling:

```typescript
const customHandler = {
  name: "CUSTOM_TELEGRAM_HANDLER",
  description: "Custom Telegram message handler",
  
  handler: async (runtime, message, state, options, callback) => {
    // Access Telegram-specific data
    const telegramContext = message.metadata?.telegram;
    
    if (telegramContext?.messageType === 'photo') {
      // Special handling for photos
      const analysis = await analyzePhoto(message.attachments[0]);
      await callback({
        text: `I see: ${analysis}`
      });
      return true;
    }
    
    // Default handling
    return false;
  }
};
```

### Webhook Setup

Configure webhooks for production:

```typescript
// Set webhook
await bot.telegram.setWebhook('https://your-domain.com/telegram-webhook', {
  certificate: fs.readFileSync('path/to/cert.pem'), // Optional
  allowed_updates: ['message', 'callback_query'],
  drop_pending_updates: true
});

// Express webhook handler
app.post('/telegram-webhook', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});
```

### Testing

```typescript
describe('Telegram Plugin Tests', () => {
  let service: TelegramService;
  let runtime: AgentRuntime;
  
  beforeAll(async () => {
    runtime = createTestRuntime();
    service = new TelegramService(runtime);
    await service.start();
  });
  
  it('should process text messages', async () => {
    const mockUpdate = createMockTextMessage('Hello bot');
    await service.bot.handleUpdate(mockUpdate);
    
    // Verify response
    expect(mockTelegram.sendMessage).toHaveBeenCalled();
  });
});
```

## Best Practices

1. **Token Security**
   - Never commit tokens to version control
   - Use environment variables
   - Rotate tokens periodically

2. **Rate Limiting**
   - Implement exponential backoff
   - Cache frequently requested data
   - Use bulk operations when possible

3. **Group Management**
   - Always check permissions before actions
   - Handle bot removal gracefully
   - Implement admin controls

4. **Error Handling**
   - Log all API errors
   - Provide user-friendly error messages
   - Implement retry logic for transient errors

5. **Performance**
   - Use webhooks in production
   - Implement message queuing
   - Optimize media processing

## Support

For issues and questions:
- 📚 Check the [examples](/plugin-registry/platform/telegram/examples)
- 💬 Join our [Discord community](https://discord.com/invite/ai16z)
- 🐛 Report issues on [GitHub](https://github.com/elizaos-plugins/plugin-telegram/issues)
```