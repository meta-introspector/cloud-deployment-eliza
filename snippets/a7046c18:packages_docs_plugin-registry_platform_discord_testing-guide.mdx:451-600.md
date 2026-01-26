# a7046c18:packages_docs_plugin-registry_platform_discord_testing-guide.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/testing-guide.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    guild: options.guild || createMockGuild(),
    ...options
  } as any;
}

export function createMockInteraction(
  options: any = {}
): ChatInputCommandInteraction {
  return {
    id: 'mock-interaction-id',
    commandName: options.commandName || 'test',
    options: {
      getString: vi.fn((name) => options.options?.[name]),
      getInteger: vi.fn((name) => options.options?.[name])
    },
    reply: vi.fn(),
    deferReply: vi.fn(),
    editReply: vi.fn(),
    channel: options.channel || createMockTextChannel(),
    ...options
  } as any;
}
```

### Test Helpers

```typescript
export async function waitForBotResponse(
  channel: TextChannel,
  timeout = 5000
): Promise<Message | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      collector.stop();
      resolve(null);
    }, timeout);
    
    const collector = channel.createMessageCollector({
      filter: (m) => m.author.bot,
      max: 1,
      time: timeout
    });
    
    collector.on('collect', (message) => {
      clearTimeout(timer);
      resolve(message);
    });
  });
}

export async function sendTestMessage(
  content: string,
  channelId: string
): Promise<Message> {
  const channel = await client.channels.fetch(channelId) as TextChannel;
  return await channel.send(content);
}

export async function simulateVoiceActivity(
  connection: VoiceConnection,
  audioFile: string,
  userId: string
): Promise<void> {
  const resource = createAudioResource(audioFile);
  const player = createAudioPlayer();
  
  connection.subscribe(player);
  player.play(resource);
  
  // Simulate user speaking
  connection.receiver.speaking.on('start', userId);
  
  await new Promise((resolve) => {
    player.on(AudioPlayerStatus.Idle, resolve);
  });
}
```

## Debug Logging

### Enable Detailed Logging

```typescript
// Enable debug logging for tests
process.env.DEBUG = 'eliza:discord:*';

// Custom test logger
export class TestLogger {
  private logs: Array<{ level: string; message: string; timestamp: Date }> = [];
  
  log(level: string, message: string, ...args: any[]) {
    this.logs.push({
      level,
      message: `${message} ${args.join(' ')}`,
      timestamp: new Date()
    });
    
    if (process.env.VERBOSE_TESTS) {
      console.log(`[${level}] ${message}`, ...args);
    }
  }
  
  getLogs(level?: string) {
    return level 
      ? this.logs.filter(l => l.level === level)
      : this.logs;
  }
  
  clear() {
    this.logs = [];
  }
}
```

## Test Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'tests',
        '**/*.test.ts'
      ]
    }
  }
});
```

### Test Setup

```typescript
// tests/setup.ts
import { config } from 'dotenv';
import { vi } from 'vitest';

// Load test environment
config({ path: '.env.test' });
```