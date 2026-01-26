# a7046c18:packages_docs_plugin-registry_platform_twitter_testing-guide.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/testing-guide.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'tests',
        '**/*.test.ts',
        '**/types.ts'
      ]
    },
    // Prevent rate limiting in tests
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
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

// Mock external services
vi.mock('twitter-api-v2', () => ({
  TwitterApi: vi.fn(() => createMockTwitterApi())
}));

// Global test configuration
global.testConfig = {
  timeout: 30000,
  retries: 3
};

// Ensure dry run for all tests
process.env.TWITTER_DRY_RUN = 'true';

// Mock timers for scheduled posts
vi.useFakeTimers();

// Cleanup after tests
afterEach(() => {
  vi.clearAllTimers();
});
```

## Debugging Tests

### Enable Debug Logging

```typescript
// Enable detailed logging for specific test
it('should process timeline with debug info', async () => {
  process.env.DEBUG = 'eliza:twitter:*';
  
  const debugLogs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    debugLogs.push(args.join(' '));
    originalLog(...args);
  };
  
  // Run test
  await client.processTimeline();
  
  // Check debug output
  expect(debugLogs.some(log => log.includes('timeline'))).toBe(true);
  
  // Restore
  console.log = originalLog;
  delete process.env.DEBUG;
});
```

### Test Reporters

```typescript
// Custom reporter for Twitter-specific tests
export class TwitterTestReporter {
  onTestStart(test: Test) {
    if (test.name.includes('twitter')) {
      console.log(`🐦 Running: ${test.name}`);
    }
  }
  
  onTestComplete(test: Test, result: TestResult) {
    if (test.name.includes('twitter')) {
      const emoji = result.status === 'passed' ? '✅' : '❌';
      console.log(`${emoji} ${test.name}: ${result.duration}ms`);
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Twitter Plugin Tests

on:
  push:
    paths:
      - 'packages/plugin-twitter/**'
  pull_request:
    paths:
      - 'packages/plugin-twitter/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 20
        
    - name: Install dependencies
      run: bun install
      
    - name: Run unit tests
      run: bun test packages/plugin-twitter
      env:
        TWITTER_DRY_RUN: true
        
    - name: Run integration tests
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      run: bun test:integration packages/plugin-twitter
      env:
        TWITTER_API_KEY: ${{ secrets.TEST_TWITTER_API_KEY }}
        TWITTER_API_SECRET_KEY: ${{ secrets.TEST_TWITTER_API_SECRET }}
        TWITTER_ACCESS_TOKEN: ${{ secrets.TEST_TWITTER_ACCESS_TOKEN }}
        TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TEST_TWITTER_TOKEN_SECRET }}
        TWITTER_DRY_RUN: true
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
        flags: twitter-plugin
```