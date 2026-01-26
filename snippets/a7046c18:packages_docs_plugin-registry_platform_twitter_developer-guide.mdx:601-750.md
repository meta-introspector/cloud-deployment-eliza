# a7046c18:packages_docs_plugin-registry_platform_twitter_developer-guide.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/developer-guide.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      
      try {
        await request();
      } catch (error) {
        if (error.code === 429) {
          // Rate limited - pause queue
          const retryAfter = error.rateLimit?.reset || 900;
          await this.pause(retryAfter * 1000);
        }
      }
      
      // Small delay between requests
      await sleep(100);
    }
    
    this.processing = false;
  }
}
```

### Rate Limiter

```typescript
class RateLimiter {
  private windows: Map<string, RateLimitWindow> = new Map();
  
  async checkLimit(endpoint: string): Promise<boolean> {
    const window = this.getWindow(endpoint);
    const now = Date.now();
    
    // Reset window if expired
    if (now > window.resetTime) {
      window.count = 0;
      window.resetTime = now + window.windowMs;
    }
    
    // Check if limit exceeded
    return window.count < window.limit;
  }
  
  async waitIfNeeded(endpoint: string): Promise<void> {
    const canProceed = await this.checkLimit(endpoint);
    
    if (!canProceed) {
      const window = this.getWindow(endpoint);
      const waitTime = window.resetTime - Date.now();
      
      logger.warn(`Rate limit hit for ${endpoint}, waiting ${waitTime}ms`);
      await sleep(waitTime);
    }
  }
}
```

## Error Handling

### API Error Handling

```typescript
async function handleTwitterError(error: any): Promise<boolean> {
  // Rate limit error
  if (error.code === 429) {
    const resetTime = error.rateLimit?.reset || Date.now() + 900000;
    const waitTime = resetTime - Date.now();
    
    logger.warn(`Rate limited. Waiting ${waitTime}ms`);
    await sleep(waitTime);
    return true; // Retry
  }
  
  // Authentication errors
  if (error.code === 401) {
    logger.error('Authentication failed. Check credentials.');
    return false; // Don't retry
  }
  
  // Permission errors
  if (error.code === 403) {
    logger.error('Permission denied. Check app permissions.');
    return false; // Don't retry
  }
  
  // Bad request
  if (error.code === 400) {
    logger.error('Bad request:', error.message);
    return false; // Don't retry
  }
  
  // Network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    logger.warn('Network error, will retry...');
    return true; // Retry
  }
  
  // Unknown error
  logger.error('Unknown error:', error);
  return false;
}
```

### Retry Logic

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      const shouldRetry = await handleTwitterError(error);
      if (!shouldRetry) throw error;
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      logger.info(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }
  
  throw lastError;
}
```

## Integration Guide

### Basic Setup
```