# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        const urgentKeywords = ['urgent', 'critical', 'emergency', 'asap'];
        const needsEscalation = urgentKeywords.some((word) =>
          message.content.text.toLowerCase().includes(word)
        );

        if (needsEscalation) {
          await runtime.emitEvent('TICKET_ESCALATED', {
            ticketId: message.content.ticketId,
            reason: 'Urgent keywords detected',
          });
        }

        return { escalated: needsEscalation };
      },
    },
  ],

  services: [],

  events: {
    [EventType.MESSAGE_RECEIVED]: [
      async (payload) => {
        // Auto-respond to DMs with ticket creation prompt
        const room = await payload.runtime.getRoom(payload.message.roomId);
        if (room?.type === ChannelType.DM) {
          // Check if this is a new conversation
          const messages = await payload.runtime.getMemories({
            tableName: 'messages',
            roomId: payload.message.roomId,
            count: 2,
          });

          if (messages.length === 1) {
            await payload.callback({
              text: "Hello! I'm here to help. Would you like to create a support ticket?",
              actions: ['GREET'],
              suggestions: ['Create ticket', 'Check ticket status', 'Get help'],
            });
          }
        }
      },
    ],
  },
};

// Create the support bot
const supportBot = new AgentRuntime({
  character: {
    name: 'SupportBot',
    description: '24/7 customer support specialist',
    bio: 'I help users resolve issues and create support tickets',
    modelProvider: 'openai',

    templates: {
      messageHandlerTemplate: `# Support Bot Response
{{providers}}

Guidelines:
- Be empathetic and professional
- Gather all necessary information
- Offer to create tickets for unresolved issues
- Provide ticket numbers for tracking
      `,
    },
  },

  plugins: [bootstrapPlugin, pglitePlugin, supportPlugin],

  settings: {
    CONVERSATION_LENGTH: 50, // Longer context for support
    SHOULD_RESPOND_BYPASS_TYPES: ['dm', 'support', 'ticket'],
  },
});

// Start the bot
await supportBot.start();
```

## Integration Examples

### Discord Integration

```typescript
import { DiscordClient } from '@elizaos/discord';

const discordBot = new AgentRuntime({
  character: {
    /* ... */
  },
  plugins: [bootstrapPlugin],
  clients: [new DiscordClient()],
});

// Discord-specific room handling
discordBot.on(EventType.MESSAGE_RECEIVED, async (payload) => {
  const room = await payload.runtime.getRoom(payload.message.roomId);

  // Handle Discord-specific features
  if (room?.metadata?.discordType === 'thread') {
    // Special handling for threads
  }
});
```

### Multi-Platform Bot

```typescript
import { DiscordClient } from '@elizaos/discord';
import { TelegramClient } from '@elizaos/telegram';
import { TwitterClient } from '@elizaos/twitter';

const multiPlatformBot = new AgentRuntime({
  character: {
    name: 'OmniBot',
    description: 'Available everywhere',
  },

  plugins: [
    bootstrapPlugin,
    {
      name: 'platform-adapter',
      providers: [
        {
          name: 'PLATFORM_INFO',
          get: async (runtime, message) => {
            const source = message.content.source;
            const platformTips = {
              discord: 'Use /commands for Discord-specific features',
              telegram: 'Use inline keyboards for better UX',
              twitter: 'Keep responses under 280 characters',
            };

            return {
              data: { platform: source },
              values: { isTwitter: source === 'twitter' },
              text: `Platform: ${source}\nTip: ${platformTips[source] || 'None'}`,
            };
          },
        },
      ],
    },
  ],

  clients: [new DiscordClient(), new TelegramClient(), new TwitterClient()],
});
```

## Best Practices

1. **Always include bootstrapPlugin** - It's the foundation
```