# a7046c18:packages_ts-plugin-starter_CLAUDE.md:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/CLAUDE.md:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
export const robustAction: Action = {
  name: 'ROBUST_ACTION',
  description: 'Demonstrates robust error handling',

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    // Validate user input before processing
    const text = message.content.text.toLowerCase();
    return text.includes('process') || text.includes('execute');
  },

  handler: async (runtime, message, state, options, callback): Promise<ActionResult> => {
    try {
      const service = runtime.getService<YourService>('yourService');
      if (!service) {
        throw new Error('Service not available');
      }

      const result = await service.performOperation();

      await callback({
        text: `Operation completed: ${result}`,
        action: 'ROBUST_ACTION',
      });

      return {
        success: true,
        text: `Successfully completed operation`,
        values: {
          operationResult: result,
          processedAt: Date.now(),
        },
        data: {
          actionName: 'ROBUST_ACTION',
          result,
        },
      };
    } catch (error) {
      console.error(`Action failed: ${error instanceof Error ? error.message : String(error)}`);

      await callback({
        text: "I'm sorry, I couldn't complete that request. Please try again.",
        error: true,
      });

      return {
        success: false,
        text: 'Failed to complete operation',
        error: error instanceof Error ? error : new Error(String(error)),
        data: {
          actionName: 'ROBUST_ACTION',
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      };
    }
  },
};
```

#### Service Initialization Pattern

```typescript
export class RobustService extends Service {
  private client: ExternalClient;
  private isInitialized = false;

  async initialize(runtime: IAgentRuntime): Promise<void> {
    try {
      this.client = new ExternalClient({
        apiKey: process.env.EXTERNAL_API_KEY,
        timeout: 30000,
      });

      await this.client.authenticate();
      this.isInitialized = true;

      console.log('Service initialized successfully');
    } catch (error) {
      console.error('Service initialization failed:', error);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Service not initialized');
    }
  }

  async performOperation(): Promise<any> {
    this.ensureInitialized();
    return await this.client.operation();
  }
}
```

## 🐛 Debugging Guide

### Environment Variables

```bash
# Enable detailed logging
LOG_LEVEL=debug elizaos dev

# Test specific components
elizaos test --filter "action-name"
```

### Common Issues & Solutions

| Issue                   | Cause                          | Solution                     |
| ----------------------- | ------------------------------ | ---------------------------- |
| "Service not found"     | Service not registered         | Add to plugin services array |
| "Action not triggering" | Validation function too strict | Check validate() logic       |
| "Provider not updating" | Provider has state             | Make provider stateless      |
| "Memory errors"         | Database connection issues     | Check database adapter setup |

## 📋 Package.json Template

```json
{
  "name": "@your-org/elizaos-plugin-example",
  "version": "1.0.0",
  "description": "elizaOS plugin for example functionality",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],

  "scripts": {
    "build": "bun run build:types && bun run build:js",
    "build:types": "tsc",
    "build:js": "bun build src/index.ts --outdir dist",
    "test": "bun test",
    "dev": "elizaos dev"
  },

  "peerDependencies": {
    "@elizaos/core": "*"
  },

  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.0.0"
  },

  "keywords": ["elizaos", "plugin", "ai-agent"]
}
```

## 🎯 Final Checklist
```