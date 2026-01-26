# a7046c18:packages_docs_plugin-registry_platform_telegram_examples.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/examples.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
  }
};

const safeAction: Action = {
  name: "SAFE_ACTION",
  description: "Action with error handling",
  
  handler: async (runtime, message, state, options, callback) => {
    try {
      // Risky operation
      const result = await riskyOperation();
      
      await callback({
        text: `Success: ${result}`
      });
    } catch (error) {
      runtime.logger.error('Action failed:', error);
      
      // User-friendly error message
      let errorMessage = "Sorry, something went wrong. ";
      
      if (error.code === 'TIMEOUT') {
        errorMessage += "The operation timed out. Please try again.";
      } else if (error.code === 'RATE_LIMIT') {
        errorMessage += "Too many requests. Please wait a moment.";
      } else {
        errorMessage += "Please try again or contact support.";
      }
      
      await callback({
        text: errorMessage,
        buttons: [[
          { text: "🔄 Retry", callback_data: "retry_action" },
          { text: "❌ Cancel", callback_data: "cancel" }
        ]]
      });
    }
    
    return true;
  }
};
```

## Testing Examples

### Test Bot Configuration

```typescript
const testBot = {
  name: "TestBot",
  description: "Bot for testing",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_TEST_BOT_TOKEN,
    TELEGRAM_TEST_CHAT_ID: process.env.TELEGRAM_TEST_CHAT_ID
  }
};

// Test action
const testAction: Action = {
  name: "RUN_TEST",
  description: "Run test scenarios",
  
  handler: async (runtime, message, state, options, callback) => {
    const testResults = [];
    
    // Test 1: Text message
    testResults.push({
      test: "Text Message",
      result: "✅ Passed"
    });
    
    // Test 2: Button interaction
    await callback({
      text: "Test: Button Interaction",
      buttons: [[
        { text: "Test Button", callback_data: "test_button" }
      ]]
    });
    
    // Test 3: Media handling
    if (message.attachments?.length > 0) {
      testResults.push({
        test: "Media Processing",
        result: "✅ Passed"
      });
    }
    
    // Send results
    const summary = testResults.map(r => `${r.test}: ${r.result}`).join('\n');
    await callback({
      text: `Test Results:\n\n${summary}`
    });
    
    return true;
  }
};
```

## Best Practices Examples

### Production-Ready Bot

```typescript
import { telegramPlugin } from '@elizaos/plugin-telegram';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';
import { AgentRuntime } from '@elizaos/core';

const productionBot = {
  name: "ProductionBot",
  description: "Production-ready Telegram bot",
  plugins: [bootstrapPlugin, telegramPlugin],
  clients: ["telegram"],
  settings: {
    // Security
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_ALLOWED_CHATS: process.env.TELEGRAM_ALLOWED_CHATS,
    
    // Performance
    messageTrackingLimit: 50,
    
    // Behavior
    allowDirectMessages: true,
    shouldOnlyJoinInAllowedGroups: true,
    allowedGroupIds: JSON.parse(process.env.ALLOWED_GROUPS || '[]')
  },
  // Rate limiting
  rateLimits: {
    maxMessagesPerMinute: 60,
    maxMessagesPerHour: 1000
  }
};

// Error recovery
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  // Implement recovery logic
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await runtime.stop();
  process.exit(0);
});
```
```