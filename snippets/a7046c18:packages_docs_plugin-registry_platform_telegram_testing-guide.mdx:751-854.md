# a7046c18:packages_docs_plugin-registry_platform_telegram_testing-guide.mdx:751-854

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/telegram/testing-guide.mdx:751-854
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  throw new Error('TELEGRAM_TEST_TOKEN not set in .env.test');
}

// Global test utilities
global.createMockRuntime = () => ({
  processMessage: vi.fn(),
  character: { 
    name: 'TestBot',
    allowDirectMessages: true
  },
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  },
  getSetting: vi.fn((key) => process.env[key]),
  getService: vi.fn(),
  emitEvent: vi.fn()
});

// Cleanup after all tests
afterAll(async () => {
  // Clean up test messages
  await cleanupTestChat();
});
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Telegram Plugin Tests

on:
  push:
    paths:
      - 'packages/plugin-telegram/**'
  pull_request:
    paths:
      - 'packages/plugin-telegram/**'

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
      run: bun test packages/plugin-telegram --run
      env:
        TELEGRAM_TEST_TOKEN: ${{ secrets.TELEGRAM_TEST_TOKEN }}
        TELEGRAM_TEST_CHAT_ID: ${{ secrets.TELEGRAM_TEST_CHAT_ID }}
        
    - name: Run integration tests
      if: github.event_name == 'push'
      run: bun test:integration packages/plugin-telegram
      env:
        TELEGRAM_TEST_TOKEN: ${{ secrets.TELEGRAM_TEST_TOKEN }}
        TELEGRAM_TEST_CHAT_ID: ${{ secrets.TELEGRAM_TEST_CHAT_ID }}
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json
        flags: telegram-plugin
```

## Best Practices

1. **Test Isolation**
   - Use separate test bots and chats
   - Clean up test data after tests
   - Don't interfere with production

2. **Mock External Services**
   - Mock Telegram API for unit tests
   - Use real API only for integration tests
   - Mock file downloads and processing

3. **Error Testing**
   - Test network failures
   - Test API errors (rate limits, etc.)
   - Test malformed data

4. **Performance Monitoring**
   - Track message processing time
   - Monitor memory usage
   - Check for memory leaks

5. **Security Testing**
   - Test input validation
   - Test access control
   - Test token handling
```