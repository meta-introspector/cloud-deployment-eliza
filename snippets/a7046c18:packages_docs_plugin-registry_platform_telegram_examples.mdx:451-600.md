# a7046c18:packages_docs_plugin-registry_platform_telegram_examples.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/examples.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      });
    } else {
      await callback({
        text: "This command only works in forum topics."
      });
    }
    
    return true;
  }
};
```

## Advanced Examples

### Multi-Language Bot

Bot that supports multiple languages:

```typescript
const multiLangBot = {
  name: "PolyglotBot",
  description: "Multi-language support bot",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  }
};

const languageAction: Action = {
  name: "SET_LANGUAGE",
  description: "Set user language preference",
  similes: ["language", "lang", "idioma", "langue"],
  
  handler: async (runtime, message, state, options, callback) => {
    await callback({
      text: "Please select your language / Seleccione su idioma / Choisissez votre langue:",
      buttons: [
        [
          { text: "🇬🇧 English", callback_data: "lang_en" },
          { text: "🇪🇸 Español", callback_data: "lang_es" }
        ],
        [
          { text: "🇫🇷 Français", callback_data: "lang_fr" },
          { text: "🇩🇪 Deutsch", callback_data: "lang_de" }
        ]
      ]
    });
    
    return true;
  }
};
```

### Webhook Bot

Bot configured for webhooks:

```typescript
import express from 'express';
import { Telegraf } from 'telegraf';

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Set webhook
const WEBHOOK_URL = 'https://your-domain.com/telegram-webhook';
bot.telegram.setWebhook(WEBHOOK_URL);

// Webhook endpoint
app.post('/telegram-webhook', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const webhookBot = {
  name: "WebhookBot",
  description: "Production bot using webhooks",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_WEBHOOK_URL: WEBHOOK_URL
  }
};

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### State Management Bot

Bot with persistent state management:

```typescript
const stateBot = {
  name: "StatefulBot",
  description: "Bot with state management",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  }
};

// User preferences storage
const userPreferences = new Map();

const savePreferenceAction: Action = {
  name: "SAVE_PREFERENCE",
  description: "Save user preferences",
  
  handler: async (runtime, message, state, options, callback) => {
    const userId = message.userId;
    const preference = options.preference;
    
    // Save to persistent storage
    if (!userPreferences.has(userId)) {
      userPreferences.set(userId, {});
    }
    
    const prefs = userPreferences.get(userId);
    prefs[preference.key] = preference.value;
    
    await callback({
      text: `Preference saved! ${preference.key} = ${preference.value}`
    });
    
    return true;
  }
};
```

### Error Handling Bot

Bot with comprehensive error handling:

```typescript
const errorHandlingBot = {
  name: "RobustBot",
  description: "Bot with error handling",
  plugins: [bootstrapPlugin, telegramPlugin],
```