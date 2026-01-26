# a7046c18:packages_docs_plugin-registry_platform_twitter_testing-guide.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/testing-guide.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Testing Guide"
description: "This guide covers testing strategies, patterns, and best practices for the @elizaos/plugin-twitter package."
---

This guide covers testing strategies, patterns, and best practices for the @elizaos/plugin-twitter package.

## Test Environment Setup

### Prerequisites

1. **Test Twitter Account**
   - Create a dedicated test account
   - Apply for developer access
   - Create test app with read/write permissions

2. **Test Credentials**
   - Generate OAuth 1.0a credentials for testing
   - Store in `.env.test` file
   - Never use production credentials for tests

3. **Environment Configuration**

```bash
# .env.test
TWITTER_API_KEY=test_api_key
TWITTER_API_SECRET_KEY=test_api_secret
TWITTER_ACCESS_TOKEN=test_access_token
TWITTER_ACCESS_TOKEN_SECRET=test_token_secret

# Test configuration
TWITTER_DRY_RUN=true  # Always use dry run for tests
TWITTER_TEST_USER_ID=1234567890
TWITTER_TEST_USERNAME=testbot
TWITTER_TEST_TARGET_USER=testuser

# Rate limit safe values
TWITTER_POLL_INTERVAL=300  # 5 minutes
TWITTER_POST_INTERVAL_MIN=60
```

## Unit Testing

### Testing Client Base

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ClientBase } from '@elizaos/plugin-twitter';
import { TwitterApi } from 'twitter-api-v2';

describe('ClientBase', () => {
  let client: ClientBase;
  let mockTwitterApi: any;
  let mockRuntime: any;
  
  beforeEach(() => {
    // Mock Twitter API
    mockTwitterApi = {
      v2: {
        me: vi.fn().mockResolvedValue({
          data: {
            id: '123',
            username: 'testbot',
            name: 'Test Bot'
          }
        }),
        tweet: vi.fn().mockResolvedValue({
          data: {
            id: '456',
            text: 'Test tweet'
          }
        }),
        homeTimeline: vi.fn().mockResolvedValue({
          data: [
            { id: '789', text: 'Timeline tweet' }
          ]
        })
      }
    };
    
    // Mock runtime
    mockRuntime = {
      getSetting: vi.fn((key) => {
        const settings = {
          TWITTER_API_KEY: 'test_key',
          TWITTER_DRY_RUN: 'true'
        };
        return settings[key];
      }),
      logger: { info: vi.fn(), error: vi.fn() }
    };
    
    // Mock TwitterApi constructor
    vi.spyOn(TwitterApi, 'constructor').mockImplementation(() => mockTwitterApi);
    
    client = new ClientBase(mockRuntime, {});
  });
  
  describe('initialization', () => {
    it('should verify credentials on init', async () => {
      await client.init();
      
      expect(mockTwitterApi.v2.me).toHaveBeenCalled();
      expect(client.profile).toEqual({
        id: '123',
        username: 'testbot',
        name: 'Test Bot'
      });
    });
    
    it('should handle authentication failure', async () => {
      mockTwitterApi.v2.me.mockRejectedValue(new Error('401 Unauthorized'));
      
      await expect(client.init()).rejects.toThrow('401');
    });
  });
  
  describe('tweeting', () => {
    it('should simulate tweets in dry run mode', async () => {
      const result = await client.tweet('Test tweet');
      
      expect(mockTwitterApi.v2.tweet).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        text: 'Test tweet',
        id: expect.any(String)
      });
    });
    
    it('should post real tweets when not in dry run', async () => {
      mockRuntime.getSetting.mockImplementation((key) => 
        key === 'TWITTER_DRY_RUN' ? 'false' : 'test'
      );
      
      const result = await client.tweet('Real tweet');
      
      expect(mockTwitterApi.v2.tweet).toHaveBeenCalledWith({
        text: 'Real tweet'
      });
    });
  });
});
```

### Testing Post Client

```typescript
import { TwitterPostClient } from '@elizaos/plugin-twitter';

describe('TwitterPostClient', () => {
  let postClient: TwitterPostClient;
```