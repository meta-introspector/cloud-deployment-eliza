# a7046c18:packages_docs_plugin-registry_platform_twitter_testing-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/testing-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  let mockClient: any;
  let mockRuntime: any;
  
  beforeEach(() => {
    mockClient = {
      tweet: vi.fn().mockResolvedValue({ id: '123', text: 'Posted' })
    };
    
    mockRuntime = {
      getSetting: vi.fn(),
      generateText: vi.fn().mockResolvedValue({
        text: 'Generated tweet content'
      }),
      character: {
        postExamples: ['Example 1', 'Example 2']
      }
    };
    
    postClient = new TwitterPostClient(mockClient, mockRuntime, {});
  });
  
  describe('post generation', () => {
    it('should generate tweets from examples', async () => {
      const tweet = await postClient.generateTweet();
      
      expect(mockRuntime.generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('post')
            })
          ])
        })
      );
      
      expect(tweet).toBe('Generated tweet content');
    });
    
    it('should respect max tweet length', async () => {
      mockRuntime.generateText.mockResolvedValue({
        text: 'a'.repeat(500)  // Too long
      });
      
      const tweet = await postClient.generateTweet();
      
      expect(tweet.length).toBeLessThanOrEqual(280);
    });
  });
  
  describe('scheduling', () => {
    it('should calculate intervals with variance', () => {
      mockRuntime.getSetting.mockImplementation((key) => {
        const settings = {
          TWITTER_POST_INTERVAL_MIN: '60',
          TWITTER_POST_INTERVAL_MAX: '120',
          TWITTER_POST_INTERVAL_VARIANCE: '0.2'
        };
        return settings[key];
      });
      
      const interval = postClient.calculateNextInterval();
      
      // Base range: 60-120 minutes
      // With 20% variance: 48-144 minutes
      expect(interval).toBeGreaterThanOrEqual(48 * 60 * 1000);
      expect(interval).toBeLessThanOrEqual(144 * 60 * 1000);
    });
  });
});
```

### Testing Interaction Client

```typescript
import { TwitterInteractionClient } from '@elizaos/plugin-twitter';

describe('TwitterInteractionClient', () => {
  let interactionClient: TwitterInteractionClient;
  
  describe('timeline processing', () => {
    it('should apply weighted algorithm', () => {
      const tweets = [
        {
          id: '1',
          text: 'AI is amazing',
          author: { username: 'user1', verified: true },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          text: 'Hello world',
          author: { username: 'targetuser', verified: false },
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      const scored = interactionClient.applyWeightedAlgorithm(tweets);
      
      // Target user should score higher despite being older
      expect(scored[0].id).toBe('2');
    });
    
    it('should filter already processed tweets', async () => {
      interactionClient.processedTweets.add('123');
      
      const tweets = [
        { id: '123', text: 'Already processed' },
        { id: '456', text: 'New tweet' }
      ];
      
      const filtered = interactionClient.filterNewTweets(tweets);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('456');
    });
  });
  
  describe('response generation', () => {
    it('should decide when to respond', () => {
      const mentionTweet = {
        text: '@testbot what do you think?',
        author: { username: 'user1' }
      };
      
      const regularTweet = {
        text: 'Just a regular tweet',
        author: { username: 'user2' }
      };
      
      expect(interactionClient.shouldRespond(mentionTweet)).toBe(true);
      expect(interactionClient.shouldRespond(regularTweet)).toBe(false);
    });
  });
});
```

## Integration Testing

### Testing Twitter Service

```typescript
describe('TwitterService Integration', () => {
  let service: TwitterService;
  let runtime: AgentRuntime;
  
  beforeAll(async () => {
    runtime = new AgentRuntime({
      character: {
        name: 'TestBot',
```