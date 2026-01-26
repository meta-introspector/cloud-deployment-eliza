# a7046c18:packages_docs_plugin-registry_platform_discord_testing-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/discord/testing-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      name: 'Test Voice',
      guild: { id: 'guild-123' },
      joinable: true
    } as any;
  });
  
  describe('joinChannel', () => {
    it('should create voice connection', async () => {
      const connection = await voiceManager.joinChannel(mockChannel);
      
      expect(connection).toBeDefined();
      expect(voiceManager.getConnection('guild-123')).toBe(connection);
    });
    
    it('should handle connection errors', async () => {
      mockChannel.joinable = false;
      
      await expect(voiceManager.joinChannel(mockChannel))
        .rejects
        .toThrow('Cannot join voice channel');
    });
  });
  
  describe('audio processing', () => {
    it('should process audio stream', async () => {
      const mockStream = createMockAudioStream();
      const transcribeSpy = vi.spyOn(voiceManager, 'transcribeAudio');
      
      await voiceManager.processAudioStream(mockStream, 'user-123');
      
      expect(transcribeSpy).toHaveBeenCalled();
    });
  });
});
```

## Integration Testing

### Testing Discord Service

```typescript
import { DiscordService } from '@elizaos/plugin-discord';
import { AgentRuntime } from '@elizaos/core';

describe('DiscordService Integration', () => {
  let service: DiscordService;
  let runtime: AgentRuntime;
  
  beforeAll(async () => {
    runtime = new AgentRuntime({
      character: {
        name: 'TestBot',
        clients: ['discord']
      },
      settings: {
        DISCORD_API_TOKEN: process.env.DISCORD_TEST_TOKEN,
        DISCORD_APPLICATION_ID: process.env.DISCORD_TEST_APP_ID
      }
    });
    
    service = new DiscordService(runtime);
    await service.start();
  });
  
  afterAll(async () => {
    await service.stop();
  });
  
  it('should connect to Discord', async () => {
    expect(service.client).toBeDefined();
    expect(service.client.isReady()).toBe(true);
  });
  
  it('should handle slash commands', async () => {
    const testChannel = await service.client.channels.fetch(
      process.env.DISCORD_TEST_CHANNEL_ID
    );
    
    // Simulate slash command
    const interaction = createMockInteraction({
      commandName: 'test',
      channel: testChannel
    });
    
    await service.handleInteraction(interaction);
    
    // Verify response was sent
    expect(interaction.reply).toHaveBeenCalled();
  });
});
```

### Testing Message Flow

```typescript
describe('Message Flow Integration', () => {
  it('should process message end-to-end', async () => {
    const testMessage = await sendTestMessage(
      'Hello bot!',
      process.env.DISCORD_TEST_CHANNEL_ID
    );
    
    // Wait for bot response
    const response = await waitForBotResponse(testMessage.channel, 5000);
    
    expect(response).toBeDefined();
    expect(response.content).toContain('Hello');
  });
  
  it('should handle media attachments', async () => {
    const testMessage = await sendTestMessageWithImage(
      'What is this?',
      'test-image.png',
      process.env.DISCORD_TEST_CHANNEL_ID
    );
    
    const response = await waitForBotResponse(testMessage.channel, 10000);
    
    expect(response.content).toMatch(/I can see|image shows/i);
  });
});
```

## E2E Testing

### Complete Bot Test Suite

```typescript
import { DiscordTestSuite } from '@elizaos/plugin-discord/tests';

describe('Discord Bot E2E Tests', () => {
  const suite = new DiscordTestSuite({
    testChannelId: process.env.DISCORD_TEST_CHANNEL_ID,
    testVoiceChannelId: process.env.DISCORD_TEST_VOICE_CHANNEL_ID,
    testUserId: process.env.DISCORD_TEST_USER_ID
  });
  
  beforeAll(async () => {
    await suite.setup();
  });
  
  afterAll(async () => {
    await suite.cleanup();
  });
  
  describe('Text Interactions', () => {
    it('should respond to messages', async () => {
      const result = await suite.testMessageResponse({
        content: 'Hello!',
        expectedPattern: /hello|hi|hey/i
```